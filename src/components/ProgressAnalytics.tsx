import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChartBar, TrendUp, Clock, Target, Calendar, BookOpen } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { AchievementBadges } from './AchievementBadges'

interface ProgressAnalyticsProps {
  userProfile: any
}

export function ProgressAnalytics({ userProfile }: ProgressAnalyticsProps) {
  const [quizHistory] = useKV<any[]>('quiz-history', [])
  const [wellnessData] = useKV<any>('wellness-data', { stressLevels: [], breathingSessions: [] })
  const [studyPlans] = useKV<any[]>('study-plans', [])

  // Calculate metrics
  const totalQuizzes = quizHistory?.length || 0
  const averageScore = quizHistory?.length ? 
    Math.round((quizHistory.reduce((sum: number, quiz: any) => sum + (quiz.score / quiz.totalQuestions), 0) / quizHistory.length) * 100) : 0

  const recentStressLevels = wellnessData?.stressLevels?.slice(-7) || []
  const averageStress = recentStressLevels.length ? 
    Math.round(recentStressLevels.reduce((sum: number, stress: any) => sum + stress.level, 0) / recentStressLevels.length * 10) / 10 : 5

  const totalStudySessions = studyPlans?.reduce((sum: number, plan: any) => 
    sum + (plan.sessions?.filter((s: any) => s.completed).length || 0), 0) || 0

  const totalStudyHours = studyPlans?.reduce((sum: number, plan: any) => 
    sum + (plan.sessions?.filter((s: any) => s.completed).reduce((sessionSum: number, session: any) => 
      sessionSum + (session.duration / 60), 0) || 0), 0) || 0

  // Subject progress
  const subjectProgress = userProfile?.subjects?.map((subject: string) => {
    const subjectQuizzes = quizHistory?.filter((q: any) => q.subject === subject) || []
    const avgScore = subjectQuizzes.length ? 
      Math.round((subjectQuizzes.reduce((sum: number, q: any) => sum + (q.score / q.totalQuestions), 0) / subjectQuizzes.length) * 100) : 0
    const initialConfidence = userProfile?.confidence?.[subject] || 50
    const improvement = avgScore - initialConfidence

    return {
      subject,
      initialConfidence,
      currentScore: avgScore,
      improvement,
      quizzesTaken: subjectQuizzes.length
    }
  }) || []

  // Weekly trends (mock data for demonstration)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      studyHours: Math.random() * 3 + 1,
      wellnessScore: Math.random() * 3 + 7,
      quizScore: Math.random() * 20 + 70
    }
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ChartBar className="h-8 w-8 text-accent" />
          Progress Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-xl font-semibold">{totalStudyHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Quiz Score</p>
                <p className="text-xl font-semibold">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-xl font-semibold">{totalStudySessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Stress</p>
                <p className="text-xl font-semibold">{averageStress}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>
            Track your improvement across different subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectProgress.map((subject: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{subject.subject}</h4>
                  <Badge variant={subject.improvement > 0 ? 'default' : 'secondary'}>
                    {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {subject.quizzesTaken} quizzes taken
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Initial confidence: {subject.initialConfidence}%</span>
                  <span>Current average: {subject.currentScore}%</span>
                </div>
                <Progress 
                  value={subject.currentScore} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
          
          {subjectProgress.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Take some quizzes to see your subject progress!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
          <CardDescription>
            Your activity and performance over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Study Hours Chart */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Daily Study Hours
              </h4>
              <div className="flex items-end gap-2 h-20">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-muted rounded-sm relative overflow-hidden">
                      <div 
                        className="bg-primary rounded-sm transition-all duration-500"
                        style={{ 
                          height: `${(day.studyHours / 4) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-white">
                          {day.studyHours.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wellness Score Chart */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-secondary" />
                Wellness Score
              </h4>
              <div className="flex items-end gap-2 h-20">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-muted rounded-sm relative overflow-hidden">
                      <div 
                        className="bg-secondary rounded-sm transition-all duration-500"
                        style={{ 
                          height: `${(day.wellnessScore / 10) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-white">
                          {day.wellnessScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Performance Chart */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendUp className="h-4 w-4 text-accent" />
                Quiz Performance
              </h4>
              <div className="flex items-end gap-2 h-20">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-muted rounded-sm relative overflow-hidden">
                      <div 
                        className="bg-accent rounded-sm transition-all duration-500"
                        style={{ 
                          height: `${day.quizScore}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-medium text-black">
                          {Math.round(day.quizScore)}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <AchievementBadges userProfile={userProfile} />
    </div>
  )
}