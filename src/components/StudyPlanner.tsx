import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, Brain, Sparkle, CheckCircle, Warning, ArrowRight, ClockCounterClockwise } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface StudyPlannerProps {
  userProfile: any
  onNavigate?: (view: string) => void
}

interface StudySession {
  id: string
  subject: string
  topic: string
  duration: number
  startTime: string
  endTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'review' | 'new' | 'practice'
  confidence: number
  completed?: boolean
  rolledOver?: boolean
}

interface StudyPlan {
  date: string
  sessions: StudySession[]
  totalHours: number
  focusAreas: string[]
}

export function StudyPlanner({ userProfile, onNavigate }: StudyPlannerProps) {
  const [studyPlans, setStudyPlans] = useKV<StudyPlan[]>('study-plans', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [lastRolloverCheck, setLastRolloverCheck] = useKV<string>('last-rollover-check', '')

  // Auto rollover effect
  useEffect(() => {
    const checkAndRolloverSessions = () => {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      if (lastRolloverCheck === today || !studyPlans) return
      
      const yesterdayPlan = studyPlans.find(p => p.date === yesterday)
      if (!yesterdayPlan) return
      
      const incompleteSessions = yesterdayPlan.sessions.filter(s => !s.completed)
      
      if (incompleteSessions.length > 0) {
        const rolledOverSessions: StudySession[] = incompleteSessions.map((session, index) => ({
          ...session,
          id: `rolled-${Date.now()}-${index}`,
          startTime: adjustTimeForRollover(session.startTime, index),
          endTime: adjustTimeForRollover(session.endTime, index),
          completed: false,
          rolledOver: true
        }))
        
        const todayPlan = studyPlans.find(p => p.date === today)
        
        const updatedPlans = studyPlans.map(plan => {
          if (plan.date === today) {
            const combinedSessions = [...plan.sessions, ...rolledOverSessions]
            return {
              ...plan,
              sessions: combinedSessions,
              totalHours: combinedSessions.reduce((sum, s) => sum + s.duration / 60, 0)
            }
          }
          return plan
        })
        
        if (!todayPlan) {
          const newTodayPlan: StudyPlan = {
            date: today,
            sessions: rolledOverSessions,
            totalHours: rolledOverSessions.reduce((sum, s) => sum + s.duration / 60, 0),
            focusAreas: Array.from(new Set(rolledOverSessions.map(s => s.subject)))
          }
          updatedPlans.push(newTodayPlan)
        }
        
        setStudyPlans(updatedPlans)
        setLastRolloverCheck(today)
        
        toast.success(`${incompleteSessions.length} incomplete sessions moved to today's plan`)
      } else {
        setLastRolloverCheck(today)
      }
    }
    
    checkAndRolloverSessions()
  }, [studyPlans, lastRolloverCheck, setStudyPlans, setLastRolloverCheck])

  const adjustTimeForRollover = (timeString: string, index: number): string => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const adjustedHours = Math.max(9, hours + index)
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const generateStudyPlan = async () => {
    setIsGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const subjects = userProfile?.subjects || ['Mathematics', 'Physics', 'Chemistry']
      const confidence = userProfile?.confidence || {}
      
      const sessions: StudySession[] = []
      let currentTime = 9
      
      subjects.slice(0, 3).forEach((subject, index) => {
        const subjectConfidence = confidence[subject] || 50
        const duration = subjectConfidence < 50 ? 60 : subjectConfidence < 70 ? 45 : 30
        const difficulty = subjectConfidence < 50 ? 'hard' : subjectConfidence < 70 ? 'medium' : 'easy'
        const type = subjectConfidence < 50 ? 'review' : subjectConfidence < 70 ? 'practice' : 'new'
        
        const startHour = Math.floor(currentTime)
        const startMinute = (currentTime % 1) * 60
        const endTime = currentTime + (duration / 60)
        const endHour = Math.floor(endTime)
        const endMinuteCalc = (endTime % 1) * 60
        
        sessions.push({
          id: `session-${Date.now()}-${index}`,
          subject,
          topic: getTopicForSubject(subject, type),
          duration,
          startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
          endTime: `${endHour.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`,
          difficulty,
          type,
          confidence: subjectConfidence
        })
        
        currentTime = endTime + 0.25
      })
      
      const newPlan: StudyPlan = {
        date: selectedDate,
        sessions,
        totalHours: sessions.reduce((sum, s) => sum + s.duration / 60, 0),
        focusAreas: subjects.filter(s => (confidence[s] || 50) < 60)
      }
      
      const updatedPlans = studyPlans ? 
        [...studyPlans.filter(p => p.date !== selectedDate), newPlan] :
        [newPlan]
      
      setStudyPlans(updatedPlans)
      toast.success('AI study plan generated successfully!')
    } finally {
      setIsGenerating(false)
    }
  }

  const getTopicForSubject = (subject: string, type: string): string => {
    const topics: Record<string, Record<string, string[]>> = {
      'Mathematics': {
        'review': ['Algebra basics', 'Geometry formulas', 'Trigonometry'],
        'practice': ['Calculus problems', 'Statistics exercises', 'Complex numbers'],
        'new': ['Advanced calculus', 'Linear algebra', 'Probability theory']
      },
      'Physics': {
        'review': ['Newton\'s laws', 'Energy and momentum', 'Waves'],
        'practice': ['Thermodynamics problems', 'Electricity exercises', 'Magnetism'],
        'new': ['Quantum mechanics', 'Relativity', 'Particle physics']
      },
      'Chemistry': {
        'review': ['Atomic structure', 'Chemical bonding', 'Stoichiometry'],
        'practice': ['Organic reactions', 'Equilibrium problems', 'Acid-base'],
        'new': ['Advanced organic', 'Physical chemistry', 'Biochemistry']
      }
    }
    
    const subjectTopics = topics[subject] || topics['Mathematics']
    const typeTopics = subjectTopics[type] || subjectTopics['review']
    return typeTopics[Math.floor(Math.random() * typeTopics.length)]
  }

  const manualRollover = () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    
    if (!studyPlans) return
    
    const yesterdayPlan = studyPlans.find(p => p.date === yesterday)
    if (!yesterdayPlan) {
      toast.info("No study plan found for yesterday")
      return
    }
    
    const incompleteSessions = yesterdayPlan.sessions.filter(s => !s.completed)
    
    if (incompleteSessions.length === 0) {
      toast.info("All sessions from yesterday were completed!")
      return
    }
    
    // Create rolled over sessions
    const rolledOverSessions: StudySession[] = incompleteSessions.map((session, index) => ({
      ...session,
      id: `manual-rolled-${Date.now()}-${index}`,
      startTime: adjustTimeForRollover(session.startTime, index),
      endTime: adjustTimeForRollover(session.endTime, index),
      completed: false,
      rolledOver: true
    }))
    
    // Update today's plan
    const todayPlan = studyPlans.find(p => p.date === today)
    
    const updatedPlans = studyPlans.map(plan => {
      if (plan.date === today) {
        const combinedSessions = [...plan.sessions, ...rolledOverSessions]
        return {
          ...plan,
          sessions: combinedSessions,
          totalHours: combinedSessions.reduce((sum, s) => sum + s.duration / 60, 0)
        }
      }
      return plan
    })
    
    if (!todayPlan) {
      const newTodayPlan: StudyPlan = {
        date: today,
        sessions: rolledOverSessions,
        totalHours: rolledOverSessions.reduce((sum, s) => sum + s.duration / 60, 0),
        focusAreas: Array.from(new Set(rolledOverSessions.map(s => s.subject)))
      }
      updatedPlans.push(newTodayPlan)
    }
    
    setStudyPlans(updatedPlans)
    toast.success(`${incompleteSessions.length} sessions rolled over to today`)
  }

  const toggleSessionCompletion = (sessionId: string) => {
    if (!studyPlans) return
    
    const updatedPlans = studyPlans.map(plan => {
      if (plan.date === selectedDate) {
        const updatedSessions = plan.sessions.map(session => 
          session.id === sessionId 
            ? { ...session, completed: !session.completed }
            : session
        )
        return { ...plan, sessions: updatedSessions }
      }
      return plan
    })
    
    setStudyPlans(updatedPlans)
  }

  const currentPlan = studyPlans?.find(p => p.date === selectedDate)
  const completedSessions = currentPlan?.sessions.filter(s => s.completed).length || 0
  const totalSessions = currentPlan?.sessions.length || 0
  const rolledOverSessions = currentPlan?.sessions.filter(s => s.rolledOver && !s.completed).length || 0
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="break-words">Grade UP AI Planner</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Personalized study schedules powered by artificial intelligence
        </p>
      </div>

      {/* AI Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
              <Sparkle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">AI-Powered Study Planning</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Grade UP analyzes your confidence levels, learning goals, and available time to create optimized study schedules. 
                Incomplete sessions are automatically moved to the next day to keep you on track.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">Adaptive Scheduling</Badge>
                <Badge variant="secondary" className="text-xs">Auto Rollover</Badge>
                <Badge variant="secondary" className="text-xs">Confidence-Based</Badge>
                <Badge variant="secondary" className="text-xs">Goal-Oriented</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection & Generation */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <label className="text-sm font-medium whitespace-nowrap">Plan Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {onNavigate && (
            <Button 
              onClick={() => onNavigate('history')} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ClockCounterClockwise className="h-4 w-4" />
              View History
            </Button>
          )}
          
          <Button 
            onClick={manualRollover}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowRight className="h-4 w-4" />
            Manual Rollover
          </Button>
          
          <Button 
            onClick={generateStudyPlan} 
            disabled={isGenerating}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Brain className="h-4 w-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Sparkle className="h-4 w-4" />
                Generate Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Plan Overview */}
      {currentPlan && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-lg sm:text-xl font-semibold">{currentPlan.totalHours.toFixed(1)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                  <p className="text-lg sm:text-xl font-semibold">{completedSessions}/{totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Progress value={progressPercentage} className="w-8 h-2" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Progress</p>
                  <p className="text-lg sm:text-xl font-semibold">{Math.round(progressPercentage)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {rolledOverSessions > 0 && (
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Warning className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Rolled Over</p>
                    <p className="text-lg sm:text-xl font-semibold">{rolledOverSessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Study Sessions */}
      {currentPlan ? (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle>Study Sessions for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
            <CardDescription>
              Click sessions to mark as completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
            {currentPlan.sessions.map((session) => (
              <div 
                key={session.id} 
                className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                  session.completed 
                    ? 'bg-secondary/20 border-secondary/30' 
                    : 'bg-muted/50 border-border hover:bg-muted'
                }`}
                onClick={() => toggleSessionCompletion(session.id)}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="text-center flex-shrink-0">
                      <p className="text-sm font-medium">{session.startTime}</p>
                      <p className="text-xs text-muted-foreground">{session.duration}min</p>
                    </div>
                    <div className="min-w-0 flex-1 sm:flex-none">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{session.subject}</p>
                        {session.rolledOver && (
                          <Badge variant="outline" className="text-xs">Rolled Over</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{session.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={session.confidence} className="w-16 sm:w-20 h-2" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {session.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Badge 
                      variant={session.difficulty === 'hard' ? 'destructive' : session.difficulty === 'medium' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {session.type} • {session.difficulty}
                    </Badge>
                    {session.completed && (
                      <CheckCircle className="h-5 w-5 text-secondary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 sm:p-12 text-center">
            <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Study Plan for This Date</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate an AI-powered study plan to get started with your learning journey.
            </p>
            <Button onClick={generateStudyPlan} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Brain className="h-4 w-4 animate-pulse mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle className="h-4 w-4 mr-2" />
                  Generate AI Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}