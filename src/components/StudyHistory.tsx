import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle, ArrowRight, TrendUp, TrendDown, Eye, ArrowCounterClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface StudyHistoryProps {
  userProfile: any
}

interface StudySession {
  id: string
  type: 'revision' | 'practice' | 'reading' | 'quiz'
  subject: string
  topic: string
  duration: number
  startTime: string
  endTime: string
  completed: boolean
  notes?: string
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }

  const getCompletionRate = (plan: StudyPlan): number => {
    if (plan.sessions.length === 0) return 0
    const completed = plan.sessions.filter(s => s.completed).length
    return (completed / plan.sessions.length) * 100
  }

  const rolloverToToday = (plan: StudyPlan) => {
    const incompleteSessions = plan.sessions.filter(s => !s.completed)
    
    if (incompleteSessions.length === 0) {
      toast.info('No incomplete sessions to roll over')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const currentPlans = studyPlans || []
    
    // Create rolled over sessions with adjusted times
    const rolledOverSessions: StudySession[] = incompleteSessions.map((session, index) => ({
      ...session,
      id: `history-rolled-${Date.now()}-${index}`,
      endTime: adjustTimeForRollover(session.endTime, index),
      rolledOver: true
    }))

    // Find today's plan or create new one
    const updatedPlans = currentPlans.map(planItem => {
      if (planItem.date === today) {
        const combinedSessions = [...planItem.sessions, ...rolledOverSessions]
        return {
          ...planItem,
          sessions: combinedSessions,
          totalHours: combinedSessions.reduce((sum, s) => sum + s.duration / 60, 0),
          focusAreas: Array.from(new Set(combinedSessions.map(s => s.subject)))
        }
      }
      return planItem
    })

    // If no plan exists for today, create one
    const todayPlan = updatedPlans.find(p => p.date === today)
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
      <div className="flex items-center justify-between">
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
            variant="outline"
            size="sm"
            onClick={() => setSelectedPlan(null)}
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
                  <CardTitle>{formatDate(selectedPlan.date)}</CardTitle>
                  <CardDescription>
                    {selectedPlan.sessions.length} sessions planned • {selectedPlan.totalHours.toFixed(1)} hours
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                    <div className="text-lg font-semibold">{Math.round(getCompletionRate(selectedPlan))}%</div>
                  </div>
                  <Progress value={getCompletionRate(selectedPlan)} className="w-24" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => rolloverToToday(selectedPlan)}
                    className="flex items-center gap-2"
                  >
                    <ArrowCounterClockwise className="h-4 w-4" />
                    Roll Over Incomplete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.focusAreas.map((area, idx) => (
                      <Badge key={idx} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Sessions</h4>
                  <div className="space-y-3">
                    {selectedPlan.sessions.map((session, idx) => (
                      <Card key={idx} className={session.completed ? 'bg-muted/50' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {session.completed ? (
                                <CheckCircle className="h-5 w-5 text-secondary" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <div className="font-medium">{session.topic}</div>
                                <div className="text-sm text-muted-foreground">
                                  {session.subject} • {session.duration} min • {session.startTime} - {session.endTime}
                                  {session.rolledOver && (
                                    <Badge variant="outline" className="ml-2">Rolled Over</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge variant={session.type === 'revision' ? 'default' : 
                                           session.type === 'practice' ? 'secondary' : 
                                           session.type === 'quiz' ? 'destructive' : 'outline'}>
                              {session.type}
                            </Badge>
                          </div>
                          {session.notes && (
                            <div className="mt-3 p-3 bg-muted rounded-md">
                              <p className="text-sm">{session.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {sortedPlans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Study History Yet</h3>
                <p className="text-muted-foreground">
                  Your study plans will appear here once you start using the planner
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedPlans.map((plan, idx) => (
              <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{formatDate(plan.date)}</h3>
                        <Badge variant={getCompletionRate(plan) === 100 ? 'default' : 
                                      getCompletionRate(plan) >= 70 ? 'secondary' : 'outline'}>
                          {Math.round(getCompletionRate(plan))}% Complete
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {plan.totalHours.toFixed(1)} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {plan.sessions.filter(s => s.completed).length}/{plan.sessions.length} sessions
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {plan.focusAreas.slice(0, 3).map((area, areaIdx) => (
                          <Badge key={areaIdx} variant="outline" className="text-xs">{area}</Badge>
                        ))}
                        {plan.focusAreas.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{plan.focusAreas.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={getCompletionRate(plan)} className="w-24" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          rolloverToToday(plan)
                        }}
                        className="flex items-center gap-2"
                        disabled={plan.sessions.every(s => s.completed)}
                      >
                        <ArrowCounterClockwise className="h-4 w-4" />
                        Roll Over
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPlan(plan)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}