import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, CheckCircle, ArrowRight, TrendUp, TrendDown, Eye, ArrowClockwise } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface StudyHistoryProps {
  userProfile: any
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

export function StudyHistory({ userProfile }: StudyHistoryProps) {
  const [studyPlans, setStudyPlans] = useKV<StudyPlan[]>('study-plans', [])
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'completion'>('date')

  // Sort plans based on selection
  const sortedPlans = studyPlans?.slice().sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      const aCompletion = getCompletionRate(a)
      const bCompletion = getCompletionRate(b)
      return bCompletion - aCompletion
    }
  }) || []

  const getCompletionRate = (plan: StudyPlan): number => {
    if (plan.sessions.length === 0) return 0
    const completed = plan.sessions.filter(s => s.completed).length
    return (completed / plan.sessions.length) * 100
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today'
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const getRelativeDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const rolloverIncompleteSessions = (plan: StudyPlan) => {
    const today = new Date().toISOString().split('T')[0]
    const incompleteSessions = plan.sessions.filter(s => !s.completed)
    
    if (incompleteSessions.length === 0) {
      toast.info("All sessions from this plan were already completed!")
      return
    }

    // Create rolled over sessions with adjusted times
    const rolledOverSessions: StudySession[] = incompleteSessions.map((session, index) => ({
      ...session,
      id: `history-rolled-${Date.now()}-${index}`,
      startTime: adjustTimeForRollover(session.startTime, index),
      endTime: adjustTimeForRollover(session.endTime, index),
      completed: false,
      rolledOver: true
    }))

    // Find or create today's plan
    const todayPlan = studyPlans?.find(p => p.date === today)
    
    const updatedPlans = studyPlans?.map(planItem => {
      if (planItem.date === today) {
        const combinedSessions = [...planItem.sessions, ...rolledOverSessions]
        return {
          ...planItem,
          sessions: combinedSessions,
          totalHours: combinedSessions.reduce((sum, s) => sum + s.duration / 60, 0)
        }
      }
      return planItem
    }) || []

    // If no plan exists for today, create one
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
    
    toast.success(
      `${incompleteSessions.length} session${incompleteSessions.length > 1 ? 's' : ''} moved to today's plan`,
      {
        description: `Sessions from ${formatDate(plan.date)} have been rescheduled`
      }
    )
  }

  const adjustTimeForRollover = (timeString: string, index: number): string => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const adjustedHours = Math.max(9, hours + index)
    return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const getCompletionTrend = (): 'up' | 'down' | 'neutral' => {
    if (!studyPlans || studyPlans.length < 2) return 'neutral'
    
    const recentPlans = studyPlans
      .filter(p => p.date !== new Date().toISOString().split('T')[0]) // Exclude today
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5) // Last 5 plans
    
    if (recentPlans.length < 2) return 'neutral'
    
    const recent = getCompletionRate(recentPlans[0])
    const previous = getCompletionRate(recentPlans[1])
    
    if (recent > previous + 5) return 'up'
    if (recent < previous - 5) return 'down'
    return 'neutral'
  }

  const getOverallStats = () => {
    if (!studyPlans || studyPlans.length === 0) {
      return { totalSessions: 0, completedSessions: 0, totalHours: 0, avgCompletion: 0 }
    }

    const totalSessions = studyPlans.reduce((sum, plan) => sum + plan.sessions.length, 0)
    const completedSessions = studyPlans.reduce((sum, plan) => 
      sum + plan.sessions.filter(s => s.completed).length, 0)
    const totalHours = studyPlans.reduce((sum, plan) => sum + plan.totalHours, 0)
    const avgCompletion = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

    return { totalSessions, completedSessions, totalHours, avgCompletion }
  }

  const stats = getOverallStats()
  const trend = getCompletionTrend()

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Study History
        </h1>
        <p className="text-muted-foreground">
          Review your past study plans and track your learning progress
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Study Hours</p>
                <p className="text-lg font-semibold">{stats.totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-lg font-semibold">{stats.completedSessions}/{stats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                {trend === 'up' ? (
                  <TrendUp className="h-5 w-5 text-secondary" />
                ) : trend === 'down' ? (
                  <TrendDown className="h-5 w-5 text-destructive" />
                ) : (
                  <div className="h-2 w-5 bg-muted-foreground rounded" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-lg font-semibold">{Math.round(stats.avgCompletion)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Study Days</p>
                <p className="text-lg font-semibold">{studyPlans?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'completion')}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="date">Date (Recent First)</option>
            <option value="completion">Completion Rate</option>
          </select>
        </div>
        
        {selectedPlan && (
          <Button
            onClick={() => setSelectedPlan(null)}
            variant="outline"
            size="sm"
          >
            Back to List
          </Button>
        )}
      </div>

      {/* Plan List or Detail View */}
      {selectedPlan ? (
        // Detail View
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {formatDate(selectedPlan.date)}
                  </CardTitle>
                  <CardDescription>
                    {getRelativeDate(selectedPlan.date)} • {selectedPlan.sessions.length} sessions • {selectedPlan.totalHours.toFixed(1)} hours
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {Math.round(getCompletionRate(selectedPlan))}% Complete
                  </Badge>
                  {selectedPlan.sessions.some(s => !s.completed) && (
                    <Button
                      onClick={() => rolloverIncompleteSessions(selectedPlan)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowClockwise className="h-4 w-4" />
                      Move Incomplete to Today
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlan.sessions.map((session) => (
                <div 
                  key={session.id} 
                  className={`p-4 rounded-lg border transition-all ${
                    session.completed 
                      ? 'bg-secondary/10 border-secondary/20' 
                      : 'bg-muted/50'
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
                        <Badge variant="outline" className="text-muted-foreground">
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedPlan.focusAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Focus Areas</CardTitle>
                <CardDescription>
                  Subjects that needed extra attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedPlan.focusAreas.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // List View
        <Card>
          <CardHeader>
            <CardTitle>Past Study Plans</CardTitle>
            <CardDescription>
              Click on any plan to view details and manage incomplete sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedPlans.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Study History Yet</h3>
                <p className="text-muted-foreground">
                  Generate your first study plan to start tracking your progress
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedPlans.map((plan) => {
                  const completionRate = getCompletionRate(plan)
                  const incompleteSessions = plan.sessions.filter(s => !s.completed).length
                  
                  return (
                    <div
                      key={plan.date}
                      className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[100px]">
                            <p className="font-medium">{formatDate(plan.date)}</p>
                            <p className="text-xs text-muted-foreground">{getRelativeDate(plan.date)}</p>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">{plan.sessions.length} sessions</span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{plan.totalHours.toFixed(1)}h</span>
                              {incompleteSessions > 0 && (
                                <>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <Badge variant="outline" className="text-xs text-accent">
                                    {incompleteSessions} incomplete
                                  </Badge>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={completionRate} className="w-32 h-2" />
                              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}% complete</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {incompleteSessions > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                rolloverIncompleteSessions(plan)
                              }}
                            >
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Rollover
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}