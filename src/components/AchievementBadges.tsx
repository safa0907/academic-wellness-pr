import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Star, Target, BookOpen, Brain, Heart, Lightning, Crown, Certificate } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface AchievementBadgesProps {
  userProfile: any
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  type: 'bronze' | 'silver' | 'gold' | 'platinum'
  condition: (data: any) => boolean
  progress?: (data: any) => { current: number; target: number }
  category: 'study' | 'quiz' | 'wellness' | 'consistency' | 'improvement'
}

const achievementDefinitions: Achievement[] = [
  // Study Achievements
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first study session',
    icon: <BookOpen className="h-5 w-5" />,
    type: 'bronze',
    condition: (data) => data.totalStudySessions >= 1,
    category: 'study'
  },
  {
    id: 'study-warrior',
    title: 'Study Warrior',
    description: 'Complete 25 study sessions',
    icon: <Target className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.totalStudySessions >= 25,
    progress: (data) => ({ current: Math.min(data.totalStudySessions, 25), target: 25 }),
    category: 'study'
  },
  {
    id: 'study-master',
    title: 'Study Master',
    description: 'Complete 100 study sessions',
    icon: <Crown className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.totalStudySessions >= 100,
    progress: (data) => ({ current: Math.min(data.totalStudySessions, 100), target: 100 }),
    category: 'study'
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Study for 20+ hours total',
    icon: <Trophy className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.totalStudyHours >= 20,
    progress: (data) => ({ current: Math.min(data.totalStudyHours, 20), target: 20 }),
    category: 'study'
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Study for 100+ hours total',
    icon: <Certificate className="h-5 w-5" />,
    type: 'platinum',
    condition: (data) => data.totalStudyHours >= 100,
    progress: (data) => ({ current: Math.min(data.totalStudyHours, 100), target: 100 }),
    category: 'study'
  },

  // Quiz Achievements
  {
    id: 'quiz-starter',
    title: 'Quiz Starter',
    description: 'Complete your first quiz',
    icon: <Brain className="h-5 w-5" />,
    type: 'bronze',
    condition: (data) => data.totalQuizzes >= 1,
    category: 'quiz'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Achieve 80%+ average score',
    icon: <Star className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.averageScore >= 80,
    progress: (data) => ({ current: Math.min(data.averageScore, 80), target: 80 }),
    category: 'quiz'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on any quiz',
    icon: <Medal className="h-5 w-5" />,
    type: 'platinum',
    condition: (data) => data.perfectScores >= 1,
    category: 'quiz'
  },
  {
    id: 'quiz-champion',
    title: 'Quiz Champion',
    description: 'Complete 50 quizzes',
    icon: <Trophy className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.totalQuizzes >= 50,
    progress: (data) => ({ current: Math.min(data.totalQuizzes, 50), target: 50 }),
    category: 'quiz'
  },

  // Wellness Achievements
  {
    id: 'stress-manager',
    title: 'Stress Manager',
    description: 'Maintain stress level below 5 for a week',
    icon: <Heart className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.averageStress <= 5 && data.recentStressEntries >= 7,
    category: 'wellness'
  },
  {
    id: 'zen-master',
    title: 'Zen Master',
    description: 'Complete 20 breathing exercises',
    icon: <Medal className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.breathingSessions >= 20,
    progress: (data) => ({ current: Math.min(data.breathingSessions, 20), target: 20 }),
    category: 'wellness'
  },

  // Consistency Achievements
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Study for 7 consecutive days',
    icon: <Lightning className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.studyStreak >= 7,
    progress: (data) => ({ current: Math.min(data.studyStreak, 7), target: 7 }),
    category: 'consistency'
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Study for 30 consecutive days',
    icon: <Crown className="h-5 w-5" />,
    type: 'platinum',
    condition: (data) => data.studyStreak >= 30,
    progress: (data) => ({ current: Math.min(data.studyStreak, 30), target: 30 }),
    category: 'consistency'
  },

  // Improvement Achievements
  {
    id: 'rising-star',
    title: 'Rising Star',
    description: 'Improve average score by 20+ points',
    icon: <Star className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.maxImprovement >= 20,
    progress: (data) => ({ current: Math.min(data.maxImprovement, 20), target: 20 }),
    category: 'improvement'
  }
]

const getBadgeStyle = (type: string, earned: boolean) => {
  if (!earned) {
    return {
      gradient: 'from-gray-200 to-gray-300',
      border: 'border-gray-300',
      icon: 'text-gray-400',
      bg: 'bg-gray-50'
    }
  }

  switch (type) {
    case 'bronze':
      return {
        gradient: 'from-amber-200 to-amber-400',
        border: 'border-amber-400',
        icon: 'text-amber-700',
        bg: 'bg-amber-50'
      }
    case 'silver':
      return {
        gradient: 'from-slate-200 to-slate-400',
        border: 'border-slate-400',
        icon: 'text-slate-700',
        bg: 'bg-slate-50'
      }
    case 'gold':
      return {
        gradient: 'from-yellow-200 to-yellow-400',
        border: 'border-yellow-400',
        icon: 'text-yellow-700',
        bg: 'bg-yellow-50'
      }
    case 'platinum':
      return {
        gradient: 'from-purple-200 to-purple-400',
        border: 'border-purple-400',
        icon: 'text-purple-700',
        bg: 'bg-purple-50'
      }
    default:
      return {
        gradient: 'from-gray-200 to-gray-300',
        border: 'border-gray-300',
        icon: 'text-gray-400',
        bg: 'bg-gray-50'
      }
  }
}

export function AchievementBadges({ userProfile }: AchievementBadgesProps) {
  const [quizHistory] = useKV<any[]>('quiz-history', [])
  const [wellnessData] = useKV<any>('wellness-data', { stressLevels: [], breathingSessions: [] })
  const [studyPlans] = useKV<any[]>('study-plans', [])
  const [earnedAchievements] = useKV<string[]>('earned-achievements', [])

  // Calculate metrics for achievement conditions
  const totalQuizzes = quizHistory?.length || 0
  const averageScore = quizHistory?.length ? 
    Math.round((quizHistory.reduce((sum: number, quiz: any) => sum + (quiz.score / quiz.totalQuestions), 0) / quizHistory.length) * 100) : 0

  const perfectScores = quizHistory?.filter((quiz: any) => 
    (quiz.score / quiz.totalQuestions) === 1).length || 0

  const recentStressLevels = wellnessData?.stressLevels?.slice(-7) || []
  const averageStress = recentStressLevels.length ? 
    Math.round(recentStressLevels.reduce((sum: number, stress: any) => sum + stress.level, 0) / recentStressLevels.length * 10) / 10 : 10
  const recentStressEntries = recentStressLevels.length

  const breathingSessions = wellnessData?.breathingSessions?.length || 0

  const totalStudySessions = studyPlans?.reduce((sum: number, plan: any) => 
    sum + (plan.sessions?.filter((s: any) => s.completed).length || 0), 0) || 0

  const totalStudyHours = studyPlans?.reduce((sum: number, plan: any) => 
    sum + (plan.sessions?.filter((s: any) => s.completed).reduce((sessionSum: number, session: any) => 
      sessionSum + (session.duration / 60), 0) || 0), 0) || 0

  // Calculate study streak (simplified)
  const studyStreak = Math.min(totalStudySessions, 30) // Simplified for demo

  // Calculate maximum improvement across subjects
  const maxImprovement = userProfile?.subjects?.reduce((max: number, subject: string) => {
    const subjectQuizzes = quizHistory?.filter((q: any) => q.subject === subject) || []
    if (subjectQuizzes.length === 0) return max
    
    const avgScore = Math.round((subjectQuizzes.reduce((sum: number, q: any) => sum + (q.score / q.totalQuestions), 0) / subjectQuizzes.length) * 100)
    const initialConfidence = userProfile?.confidence?.[subject] || 50
    const improvement = avgScore - initialConfidence
    
    return Math.max(max, improvement)
  }, 0) || 0

  const data = {
    totalQuizzes,
    averageScore,
    perfectScores,
    averageStress,
    recentStressEntries,
    breathingSessions,
    totalStudySessions,
    totalStudyHours,
    studyStreak,
    maxImprovement
  }

  // Group achievements by category
  const groupedAchievements = achievementDefinitions.reduce((groups: any, achievement) => {
    const category = achievement.category
    if (!groups[category]) groups[category] = []
    groups[category].push(achievement)
    return groups
  }, {})

  const categoryNames = {
    study: 'Study Achievements',
    quiz: 'Quiz Achievements', 
    wellness: 'Wellness Achievements',
    consistency: 'Consistency Achievements',
    improvement: 'Improvement Achievements'
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]: [string, any]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category === 'study' && <BookOpen className="h-5 w-5 text-primary" />}
              {category === 'quiz' && <Brain className="h-5 w-5 text-accent" />}
              {category === 'wellness' && <Heart className="h-5 w-5 text-secondary" />}
              {category === 'consistency' && <Lightning className="h-5 w-5 text-purple-500" />}
              {category === 'improvement' && <Star className="h-5 w-5 text-yellow-500" />}
              {categoryNames[category as keyof typeof categoryNames]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement: Achievement) => {
                const earned = achievement.condition(data)
                const progress = achievement.progress?.(data)
                const style = getBadgeStyle(achievement.type, earned)

                return (
                  <div
                    key={achievement.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${style.border} ${style.bg} ${
                      earned ? 'shadow-md hover:shadow-lg' : 'opacity-60'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-3 mx-auto`}>
                      <div className={style.icon}>
                        {achievement.icon}
                      </div>
                    </div>

                    {/* Badge Type */}
                    <div className="text-center mb-2">
                      <Badge 
                        variant={earned ? "default" : "secondary"}
                        className={`text-xs font-medium ${earned ? '' : 'opacity-50'}`}
                      >
                        {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                      </Badge>
                    </div>

                    {/* Achievement Info */}
                    <div className="text-center space-y-1">
                      <h3 className={`font-semibold text-sm ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-xs ${earned ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                        {achievement.description}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    {progress && !earned && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress.current}</span>
                          <span>{progress.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Earned Indicator */}
                    {earned && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Achievement Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Trophy className="h-12 w-12 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Achievement Progress</h3>
              <p className="text-muted-foreground">
                You've earned {achievementDefinitions.filter(a => a.condition(data)).length} out of {achievementDefinitions.length} achievements
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {(['bronze', 'silver', 'gold', 'platinum'] as const).map(type => {
                const earned = achievementDefinitions.filter(a => a.type === type && a.condition(data)).length
                const total = achievementDefinitions.filter(a => a.type === type).length
                const style = getBadgeStyle(type, true)
                
                return (
                  <div key={type} className="text-center">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${style.gradient} mx-auto mb-1`} />
                    <p className="text-sm font-medium">{earned}/{total}</p>
                    <p className="text-xs text-muted-foreground capitalize">{type}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}