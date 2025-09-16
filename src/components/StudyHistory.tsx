import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, CheckCircle, ArrowRight, TrendingUp, TrendingDown, Eye, RotateCcw } from '@phosphor-icons/react'
interface StudyHistoryProps {
import { toast } from 'sonner'

interface StudyHistoryProps {
  subject: string
}

interface StudySession {
  type: 'rev
  subject: string
  topic: string
  duration: number
  const [selectedPl

  const sortedPlans = studyPlans?.slice(
      return new Date(b.date).getTime
      const aComplet
      return bComplet
  }) || []
 

  }
  const format
    const today = new Date
    
      return 'Today'
 

        month: 'short', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : unde
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
     


      id: `history-rolled-${Date.now()}-${index}`,
      endTime: adjustTimeForRollover(session
      rolledOver: true

   

        const combinedSessions = [...planItem.sessions
          ...planItem,
          totalHours: combin
      }
    
    // If no plan exists for today, create one
      const newToday
        sessions: rolledOverSessions,
        focusAreas: Arra
      update

    
      `${incompleteSessi
        description: `S
    )

    c
   

    if (!studyPlans || studyPlans.length < 2) return 'neutr
    const recentPlans = studyPlans
      .sort((a, b) => new Da
    
    
    
    if (recent > previous + 5) return 
    return 'neutral'

    if (!studyPlans || studyPlans.length === 0) {
    }
   

    const avgCompletion = totalSessions > 0 ? (completedSes
    return { totalSessions, completedSessions, totalHour

  co
  return (
      <div className="flex flex-col gap-2">
          <C
     

      </div>
      {/* Overall Statistics */}
        <Card>
            <div className="flex items-center gap-
              <div>
                <p className="text-lg font-semibold">{stats.t
            </div>
        </Card>
       

              <div>
                <p className="text-lg font-semibold">{stats.c
    
        </Card>
        <Card>
            <div className="flex items-center gap-3">
                
                ) : tr
                ) : (
                )}
         
       
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
                  
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary" />
                   
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-lg font-semibold">{stats.completedSessions}/{stats.totalSessions}</p>
              </div>
                  
          </CardContent>
               

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                {trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-secondary" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-5 w-5 text-destructive" />
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
                  Subjects that needed extra attention
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Sort by:</label>
          <select
                    <Badge
            onChange={(e) => setSortBy(e.target.value as 'date' | 'completion')}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="date">Date (Recent First)</option>
            <option value="completion">Completion Rate</option>
      ) : (
        </div>
        
        {selectedPlan && (
              Cli
            onClick={() => setSelectedPlan(null)}
          <CardContent>
            size="sm"
          >
            Back to List
                  G
        )}
      </div>

      {/* Plan List or Detail View */}
      {selectedPlan ? (
        // Detail View
        <div className="space-y-6">
          <Card>
            <CardHeader>
                      <div className="flex items-center justify-b
                <div>







































































































































































































