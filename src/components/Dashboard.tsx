import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GlobalStats } from '@/components/GlobalStats'
import { BookOpen, Brain, Heart, TrendUp, Target, Clock, GraduationCap, ArrowSquareOut, Trophy, Medal, Star } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface DashboardProps {
  userProfile: any
  onNavigate: (view: string) => void
}

export function Dashboard({ userProfile, onNavigate }: DashboardProps) {
  const [quizHistory] = useKV<any[]>('quiz-history', [])
  const [studyPlans] = useKV<any[]>('study-plans', [])
  const [wellnessData] = useKV<any>('wellness-data', { stressLevels: [], breathingSessions: [] })

  // Calculate basic achievement metrics
  const totalQuizzes = quizHistory?.length || 0
  const averageScore = quizHistory?.length ? 
    Math.round((quizHistory.reduce((sum: number, quiz: any) => sum + (quiz.score / quiz.totalQuestions), 0) / quizHistory.length) * 100) : 0
  const totalStudySessions = studyPlans?.reduce((sum: number, plan: any) => 
    sum + (plan.sessions?.filter((s: any) => s.completed).length || 0), 0) || 0
  const totalStudyHours = studyPlans?.reduce((sum: number, plan: any) => 
    sum + (plan.sessions?.filter((s: any) => s.completed).reduce((sessionSum: number, session: any) => 
      sessionSum + (session.duration / 60), 0) || 0), 0) || 0

  // Simple achievement checks
  const recentAchievements: Array<{title: string, icon: React.ReactNode, type: string}> = []
  if (totalStudySessions >= 1) recentAchievements.push({ title: 'First Steps', icon: <BookOpen className="h-4 w-4" />, type: 'bronze' })
  if (averageScore >= 80) recentAchievements.push({ title: 'Quiz Master', icon: <Star className="h-4 w-4" />, type: 'gold' })
  if (totalStudyHours >= 20) recentAchievements.push({ title: 'Dedicated Learner', icon: <Trophy className="h-4 w-4" />, type: 'silver' })

  const todaySchedule = [
    { subject: 'Mathematics', time: '9:00 AM', duration: '45 min', confidence: 65 },
    { subject: 'Physics', time: '2:00 PM', duration: '60 min', confidence: 45 },
    { subject: 'Chemistry', time: '4:30 PM', duration: '30 min', confidence: 75 }
  ]

  const weeklyProgress = {
    studyHours: 18,
    goal: 25,
    streakDays: 5,
    wellnessScore: 8.2
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {userProfile?.name || 'Student'}! 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Ready to achieve your learning goals today?
        </p>
      </div>

      {/* Global Student Stats */}
      <GlobalStats />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Today's Focus</p>
                <p className="text-lg sm:text-xl font-semibold">2h 15m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-secondary/10 rounded-lg flex-shrink-0">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Wellness</p>
                <p className="text-lg sm:text-xl font-semibold">{weeklyProgress.wellnessScore}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg flex-shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Study Streak</p>
                <p className="text-lg sm:text-xl font-semibold">{weeklyProgress.streakDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                <TrendUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Weekly Goal</p>
                <p className="text-lg sm:text-xl font-semibold">{Math.round((weeklyProgress.studyHours / weeklyProgress.goal) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Today's Study Plan
              </CardTitle>
              <CardDescription className="mt-1">
                Your personalized schedule generated by Grade UP AI
              </CardDescription>
            </div>
            <Button onClick={() => onNavigate('planner')} variant="outline" size="sm" className="w-full sm:w-auto">
              View Full Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
          {todaySchedule.map((session, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-3">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="text-center flex-shrink-0">
                  <p className="text-sm font-medium">{session.time}</p>
                  <p className="text-xs text-muted-foreground">{session.duration}</p>
                </div>
                <div className="min-w-0 flex-1 sm:flex-none">
                  <p className="font-medium truncate">{session.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={session.confidence} className="w-16 sm:w-20 h-2" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{session.confidence}% confidence</span>
                  </div>
                </div>
              </div>
              <Badge 
                variant={session.confidence < 50 ? 'destructive' : session.confidence < 70 ? 'secondary' : 'default'}
                className="text-xs whitespace-nowrap w-full sm:w-auto text-center"
              >
                {session.confidence < 50 ? 'Focus Needed' : session.confidence < 70 ? 'Review' : 'Confident'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Leaving Certificate Preparation */}
      <Card className="bg-gradient-to-br from-purple-500/5 to-indigo-500/10 border-purple-500/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Leaving Certificate Preparation
          </CardTitle>
          <CardDescription className="mt-1">
            Access comprehensive resources and practice materials for your Leaving Cert exams
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white/50 rounded-lg border border-purple-200/50 gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-purple-800 mb-1">GradeUp Coach</h4>
              <p className="text-sm text-purple-700">
                Chat with your AI coach for personalized study guidance and support
              </p>
            </div>
            <Button
              onClick={() => window.open('https://nice-coast-0da719e03.2.azurestaticapps.net', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowSquareOut className="h-4 w-4" />
              Chat Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('quiz')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quick Quiz</h3>
            <p className="text-sm text-muted-foreground">Test your knowledge with adaptive questions</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('wellness')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Wellness Check</h3>
            <p className="text-sm text-muted-foreground">Take a moment for mental health</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('progress')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <TrendUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2">View Progress</h3>
            <p className="text-sm text-muted-foreground">See your learning analytics</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements Preview */}
      {recentAchievements.length > 0 && (
        <Card className="bg-gradient-to-br from-accent/5 to-secondary/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Congratulations on your learning milestones!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    achievement.type === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                    achievement.type === 'silver' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentAchievements.length > 3 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onNavigate('progress')}
                  className="w-full"
                >
                  View All Achievements
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}