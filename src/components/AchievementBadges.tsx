import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
interface AchievementBadgesProps {
import { useKV } from '@github/spark/hooks'

interface AchievementBadgesProps {
  userProfile: any
 

interface Achievement {
  id: string
  category: 'st
  description: string
  icon: React.ReactNode
  type: 'bronze' | 'silver' | 'gold' | 'platinum'
  {
    title: 'Study Warrior',
    icon: <Target className="h-5 w-5" />,
 

  {
    title: 'Study Maste
  {
    condition: (data) 
    category: 'study'
  {
    title: 'Dedicated Learner',
    icon: <Trophy c
    condition: (data) => data.totalStudyHours >= 20,
    category: 'study'
  {
   
    id: 'study-warrior',
    title: 'Study Warrior',
    description: 'Complete 25 study sessions',
    icon: <Target className="h-5 w-5" />,
    id: 'quiz-start
    condition: (data) => data.totalStudySessions >= 25,
    progress: (data) => ({ current: Math.min(data.totalStudySessions, 25), target: 25 }),
    category: 'study'
    
  {
    id: 'study-master',
    title: 'Study Master',
    description: 'Complete 100 study sessions',
    icon: <Crown className="h-5 w-5" />,
    description: 
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
    type: 'gold',
    progress: (data) => ({ current: Math.min(d
  },
  // Consistency Achi
    id: 'consistent-learner',
    description: 'Study for 7 consecutive days',
    type: 'silver',
    

    id: 'unstoppable',
   
    type: 'platinum',
    progress: (data) => ({
  },
  // Improvement Achievements
    id: 'rising-sta
    description: 'Improve average score by 20+ p
    type: 'gold',
    
  }

  if (!earned) {
      gradient: 'from-gray-200 to-gray-300',
      icon: 'text-gray-400',
    type: 'gold',

    case 'bronze':
        gradient: 'f
    
   
      return {
        border: 'border-sla
        bg: 'bg-slate-50'
    case 'gold':
        gradient: 'fr
        icon: 'text-yellow-700',
      }
    
   
        bg: 'bg-purple-5
    default:
        gradient: 'from-gray-200 to-gra
        icon: 'text-gray-400',
      }
}
export function AchievementBadges({ userProfile }: AchievementBadgesProps) {
  const [wellnessDat
  co

  const averageScore = qui

    (quiz.score / quiz.to
  const recentStressLevels =
    Math.round(recentStressLevels.reduce((sum: number, stres


    sum + (plan.sessions?.filter((s: any) => s.completed).length || 0), 0) || 0
  const totalStudyHours 
    
  /

  const maxImprovement =
    if (subjectQuizzes.length === 0) return max
    const avgScore = Math.round((subject
    const improve
    condition: (data) => data.breathingSessions >= 20,
    progress: (data) => ({ current: Math.min(data.breathingSessions, 20), target: 20 }),
    category: 'wellness'
  },

  // Consistency Achievements
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Study for 7 consecutive days',
    icon: <Zap className="h-5 w-5" />,
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
  const [achievements] = useKV<string[]>('earned-achievements', [])

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
    
            </div>
  }, 0) || 0

  const data = {
                
    averageScore,
    perfectScores,
    averageStress,
    recentStressEntries,
    breathingSessions,
            </div>
    totalStudyHours,
    studyStreak,
    maxImprovement
}

  // Group achievements by category
  const groupedAchievements = achievements.reduce((groups: any, achievement) => {

    if (!groups[category]) groups[category] = []

    return groups



    study: 'Study Achievements',

    wellness: 'Wellness Achievements',
    consistency: 'Consistency Achievements',
    improvement: 'Improvement Achievements'


  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]: [string, any]) => (
        <Card key={category}>

            <CardTitle className="flex items-center gap-2">
              {category === 'study' && <BookOpen className="h-5 w-5 text-primary" />}
              {category === 'quiz' && <Brain className="h-5 w-5 text-accent" />}
              {category === 'wellness' && <Heart className="h-5 w-5 text-secondary" />}
              {category === 'consistency' && <Zap className="h-5 w-5 text-purple-500" />}
              {category === 'improvement' && <Star className="h-5 w-5 text-yellow-500" />}
              {categoryNames[category as keyof typeof categoryNames]}

          </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement: Achievement) => {
                const earned = achievement.condition(data)
                const progress = achievement.progress?.(data)
                const style = getBadgeStyle(achievement.type, earned)

                return (

                    key={achievement.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${style.border} ${style.bg} ${
                      earned ? 'shadow-md hover:shadow-lg' : 'opacity-60'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-3 mx-auto`}>

                        {achievement.icon}

                    </div>

                    {/* Badge Type */}
                    <div className="text-center mb-2">
                      <Badge 

                        className={`text-xs font-medium ${earned ? '' : 'opacity-50'}`}

                        {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                      </Badge>
                    </div>

                    {/* Achievement Info */}
                    <div className="text-center space-y-1">
                      <h3 className={`font-semibold text-sm ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>

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


                    {/* Earned Indicator */}
                    {earned && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

              })}

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

              <h3 className="text-xl font-bold text-foreground">Achievement Progress</h3>
























