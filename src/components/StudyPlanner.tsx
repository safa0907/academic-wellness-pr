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
  rolledOver?: boolean // New field to track rolled over sessions
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

  // Check for incomplete sessions and rollover to next day
  useEffect(() => {
    const checkAndRolloverSessions = () => {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      // Only run rollover once per day
      if (lastRolloverCheck === today) return
      
      if (!studyPlans) return
      
      const yesterdayPlan = studyPlans.find(p => p.date === yesterday)
      if (!yesterdayPlan) return
      
      const incompleteSessions = yesterdayPlan.sessions.filter(s => !s.completed)
      
      if (incompleteSessions.length > 0) {
        // Create new sessions for today with updated times
        const rolledOverSessions: StudySession[] = incompleteSessions.map((session, index) => ({
          ...session,
          id: `rolled-${Date.now()}-${index}`,
          startTime: adjustTimeForRollover(session.startTime, index),
          endTime: adjustTimeForRollover(session.endTime, index),
          completed: false,
          rolledOver: true // Mark as rolled over
        }))
        
        // Find or create today's plan
        const todayPlan = studyPlans.find(p => p.date === today)
        
        const updatedPlans = studyPlans.map(plan => {
          if (plan.date === today) {
            // Add rolled over sessions to existing plan
            const combinedSessions = [...plan.sessions, ...rolledOverSessions]
            return {
              ...plan,
              sessions: combinedSessions,
              totalHours: combinedSessions.reduce((sum, s) => sum + s.duration / 60, 0)
            }
          }
          return plan
        })
        
        // If no plan exists for today, create one with rolled over sessions
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
        
        toast.success(
          `${incompleteSessions.length} incomplete session${incompleteSessions.length > 1 ? 's' : ''} moved to today's plan`,
          {
            description: "Sessions from yesterday have been automatically rescheduled"
          }
        )
      } else {
        setLastRolloverCheck(today)
      }
    }
    
    // Run check on component mount and when studyPlans change
    checkAndRolloverSessions()
  }, [studyPlans, lastRolloverCheck, setStudyPlans, setLastRolloverCheck])

  const adjustTimeForRollover = (timeString: string, index: number): string => {
    const [hours, minutes] = timeString.split(':').map(Number)
    // Start rolled over sessions a bit later to avoid conflicts
    const adjustedHours = Math.max(9, hours + index)
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const generateAIPlan = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI generation with realistic study plan
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const subjects = userProfile?.subjects || ['Mathematics', 'Physics', 'Chemistry']
      const confidence = userProfile?.confidence || {}
      
      // Create sessions based on confidence levels
      const sessions: StudySession[] = []
      let currentTime = 9 // 9 AM start
      
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
        
        currentTime = endTime + 0.25 // 15 min break
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
    } finally {
      setIsGenerating(false)
    }
  }

  const getTopicForSubject = (subject: string, type: string): string => {
    const topics: Record<string, Record<string, string[]>> = {
      'Mathematics': {
        'review': ['Algebra basics', 'Quadratic equations', 'Functions'],
        'practice': ['Calculus problems', 'Integration exercises', 'Derivatives'],
        'new': ['Advanced integration', 'Differential equations', 'Linear algebra']
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
    
    // Update or create today's plan
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
    
    // Navigate to today's plan if we were looking at a different date
    setSelectedDate(today)
    
    toast.success(
      `${incompleteSessions.length} session${incompleteSessions.length > 1 ? 's' : ''} rolled over to today`,
      {
        description: "Incomplete sessions have been rescheduled"
      }
    )
  }

  const markSessionComplete = (sessionId: string) => {
    if (!studyPlans) return
    
    const updatedPlans = studyPlans.map(plan => {
      if (plan.date === selectedDate) {
        return {
          ...plan,
          sessions: plan.sessions.map(session => 
            session.id === sessionId ? { ...session, completed: true } : session
          )
        }
      }
      return plan
    })
    
    setStudyPlans(updatedPlans)
  }

  const currentPlan = studyPlans?.find(p => p.date === selectedDate)
  const todayPlan = studyPlans?.find(p => p.date === new Date().toISOString().split('T')[0])
  
  const completedSessions = currentPlan?.sessions.filter(s => s.completed).length || 0
  const totalSessions = currentPlan?.sessions.length || 0
  const rolledOverSessions = currentPlan?.sessions.filter(s => s.rolledOver && !s.completed).length || 0
  const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Grade UP AI Planner
        </h1>
        <p className="text-muted-foreground">
          Personalized study schedules powered by artificial intelligence
        </p>
      </div>

      {/* AI Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sparkle className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">AI-Powered Study Planning</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Grade UP analyzes your confidence levels, learning goals, and available time to create optimized study schedules. 
                Incomplete sessions are automatically moved to the next day to keep you on track.
              </p>
              <div className="flex gap-2">
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Plan Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="flex gap-2">
          {onNavigate && (
            <Button 
              onClick={() => onNavigate('history')} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ClockCounterClockwise className="h-4 w-4" />
              View History
            </Button>
          )}
          
          <Button 
            onClick={manualRollover} 
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Rollover Yesterday
          </Button>
          
          <Button 
            onClick={generateAIPlan} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Generate AI Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Plan Overview */}
      {currentPlan && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Study Time</p>
                  <p className="text-lg font-semibold">{currentPlan.totalHours.toFixed(1)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-lg font-semibold">{completedSessions}/{totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Rolled Over</p>
                  <p className="text-lg font-semibold">{rolledOverSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-lg font-semibold">{Math.round(progressPercentage)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rollover Info */}
      {currentPlan && rolledOverSessions > 0 && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowRight className="h-5 w-5 text-accent" />
              <div>
                <h4 className="font-medium text-accent-foreground">Sessions Moved Forward</h4>
                <p className="text-sm text-muted-foreground">
                  {rolledOverSessions} session{rolledOverSessions > 1 ? 's' : ''} from previous days have been automatically added to keep you on track.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {currentPlan && totalSessions > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Progress</span>
              <span className="text-sm text-muted-foreground">{completedSessions}/{totalSessions} sessions</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Study Sessions */}
      {currentPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Study Sessions</CardTitle>
            <CardDescription>
              AI-optimized schedule for {new Date(selectedDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPlan.sessions.map((session, index) => (
              <div 
                key={session.id} 
                className={`p-4 rounded-lg border transition-all ${
                  session.completed 
                    ? 'bg-secondary/10 border-secondary/20' 
                    : session.rolledOver
                    ? 'bg-accent/10 border-accent/20'
                    : 'bg-muted/50 hover:bg-muted/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-medium">{session.startTime}</p>
                      <p className="text-xs text-muted-foreground">{session.duration}min</p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{session.subject}</h4>
                        {session.rolledOver && (
                          <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Rolled Over
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {session.type}
                        </Badge>
                        <Badge 
                          variant={
                            session.difficulty === 'hard' ? 'destructive' :
                            session.difficulty === 'medium' ? 'secondary' : 'default'
                          }
                          className="text-xs"
                        >
                          {session.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{session.topic}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={session.confidence} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">{session.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {session.completed ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Complete
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => markSessionComplete(session.id)}
                        variant="outline"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Study Plan Yet</h3>
            <p className="text-muted-foreground mb-6">
              Generate an AI-powered study plan for {new Date(selectedDate).toLocaleDateString()}
            </p>
            <Button onClick={generateAIPlan} disabled={isGenerating}>
              <Brain className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Focus Areas */}
      {currentPlan && currentPlan.focusAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning className="h-5 w-5 text-accent" />
              Recommended Focus Areas
            </CardTitle>
            <CardDescription>
              Subjects identified as needing extra attention based on your confidence levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentPlan.focusAreas.map((subject, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}