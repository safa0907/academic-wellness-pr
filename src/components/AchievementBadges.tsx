import React from 'react'
import { Card, CardContent, CardHeader, CardT
import { Trophy, Target, Crown, Star, Lightning, BookOpen, Brain, Heart } from 
interface AchievementBadgesProps {
import { Trophy, Target, Crown, Star, Zap, BookOpen, Brain, Heart } from '@phosphor-icons/react'

interface AchievementBadgesProps {
  userProfile: any
 


  // Study A
    id: 'first-
    description: 'Com
    type: 'bronze',
    progress: (data) => ({ current: Math.min(data
  condition: (data: any) => boolean
  progress?: (data: any) => { current: number; target: number }
  category: 'study' | 'quiz' | 'wellness' | 'consistency' | 'improvement'
}

const achievements: Achievement[] = [
  // Study Achievements
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first study session',
    icon: <Target className="h-5 w-5" />,
  },
    condition: (data) => data.totalStudySessions >= 1,
    progress: (data) => ({ current: Math.min(data.totalStudySessions, 1), target: 1 }),
    category: 'study'
    
   
    type: 'gold',
    progress: (data) => ({ 
  },
  // Quiz Achievements
    id: 'quiz-start
    description: 'Complete your first quiz',
    type: 'bronze',
    progress: (data) 
  },
   
    description: 'Get a
    type: 'gold',
    progress: (data) => ({ current: Math.min(da
  },
    id: 'high-ach
    description: 'Maintain 80%+ average score',
    type: 'silver',
    category: 'quiz'

  {
    title: 'Mindful Moment',
    icon: <Heart className="h-5
    condition: (data) => data.breathingSessio
    category: 'wellness'
  {
    title: 'Stress Manager',
    icon: <Heart className="h-5 w-5" />,
    condition: (data)
    
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Study for 100+ hours total',
    icon: <Crown className="h-5 w-5" />,
    type: 'gold',
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
    progress: (data) => ({ current: Math.min(data.totalQuizzes, 1), target: 1 }),
    category: 'quiz'
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get a 100% on any quiz',
    icon: <Star className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.perfectScores >= 1,
    progress: (data) => ({ current: Math.min(data.perfectScores, 1), target: 1 }),
    category: 'quiz'
  },
  {
    id: 'high-achiever',
    title: 'High Achiever',
    description: 'Maintain 80%+ average score',
    icon: <Trophy className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.averageScore >= 80,
    category: 'quiz'
  },

  // Wellness Achievements
  {
    id: 'mindful-moment',
    title: 'Mindful Moment',
    description: 'Complete your first breathing exercise',
    icon: <Heart className="h-5 w-5" />,
    type: 'bronze',
    condition: (data) => data.breathingSessions >= 1,
    progress: (data) => ({ current: Math.min(data.breathingSessions, 1), target: 1 }),

  },
   
    id: 'stress-manager',
    title: 'Stress Manager',
    description: 'Track stress for 7 days',
    icon: <Heart className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.recentStressEntries >= 7,
    progress: (data) => ({ current: Math.min(data.recentStressEntries, 7), target: 7 }),
    category: 'wellness'
  },
  {
    id: 'zen-master',
    title: 'Zen Master',
    description: 'Complete 20 breathing sessions',
    icon: <Crown className="h-5 w-5" />,
    type: 'gold',
    condition: (data) => data.breathingSessions >= 20,
    progress: (data) => ({ current: Math.min(data.breathingSessions, 20), target: 20 }),
    category: 'wellness'
  },

  // Consistency Achievements
  {
    id: 'consistent-learner',
      }
    description: 'Study for 7 consecutive days',
    icon: <Zap className="h-5 w-5" />,
    type: 'silver',
    condition: (data) => data.studyStreak >= 7,
    progress: (data) => ({ current: Math.min(data.studyStreak, 7), target: 7 }),
    category: 'consistency'
  },
  c
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Study for 30 consecutive days',
    icon: <Crown className="h-5 w-5" />,
    type: 'platinum',
    condition: (data) => data.studyStreak >= 30,
    progress: (data) => ({ current: Math.min(data.studyStreak, 30), target: 30 }),
  const recentStressLevels 
  },

  // Improvement Achievements

    id: 'rising-star',

    description: 'Improve average score by 20+ points',
      sessionSum + (session.duration / 
    type: 'gold',
    condition: (data) => data.maxImprovement >= 20,
    progress: (data) => ({ current: Math.min(data.maxImprovement, 20), target: 20 }),
    category: 'improvement'
  }
 

const getBadgeStyle = (type: string, earned: boolean) => {
  if (!earned) {
  }, 0) || 0
      gradient: 'from-gray-200 to-gray-300',
    totalQuizzes,
      icon: 'text-gray-400',
    averageStress,
    }
   

    maxImprovemen
    case 'bronze':
  // Group ach
        gradient: 'from-amber-200 to-amber-400',
        border: 'border-amber-400',
        icon: 'text-amber-700',
        bg: 'bg-amber-50'
    wel
    case 'silver':
  }
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
              {categoryNam
      }
          <CardConte
      return {
        gradient: 'from-purple-200 to-purple-400',
        border: 'border-purple-400',
        icon: 'text-purple-700',
        bg: 'bg-purple-50'
       
    default:
      return {
        gradient: 'from-gray-200 to-gray-300',
        border: 'border-gray-300',
        icon: 'text-gray-400',
                      </
      }
   
}

export function AchievementBadges({ userProfile }: AchievementBadgesProps) {
  const [quizHistory] = useKV<any[]>('quiz-history', [])
  const [wellnessData] = useKV<any>('wellness-data', { stressLevels: [], breathingSessions: [] })
  const [studyPlans] = useKV<any[]>('study-plans', [])

                      <h3 className={`font-semibo
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
                  </div>

  // Calculate study streak (simplified)
  const studyStreak = Math.min(totalStudySessions, 30) // Simplified for demo

  // Calculate maximum improvement across subjects
  const maxImprovement = userProfile?.subjects?.reduce((max: number, subject: string) => {
    const subjectQuizzes = quizHistory?.filter((q: any) => q.subject === subject) || []
    if (subjectQuizzes.length === 0) return max
    
    const avgScore = Math.round((subjectQuizzes.reduce((sum: number, q: any) => sum + (q.score / q.totalQuestions), 0) / subjectQuizzes.length) * 100)
    const initialConfidence = userProfile?.confidence?.[subject] || 50
    const improvement = avgScore - initialConfidence
    
            <div className="w-full bg
  }, 0) || 0

  const data = {
          </div>
    averageScore,
    </div>
    averageStress,

    breathingSessions,
    totalStudySessions,
    totalStudyHours,
    studyStreak,
    maxImprovement


  // Group achievements by category
  const groupedAchievements = achievements.reduce((groups: any, achievement) => {
    const category = achievement.category
    if (!groups[category]) groups[category] = []
    groups[category].push(achievement)
    return groups



    study: 'Study Achievements',
    quiz: 'Quiz Achievements',
    wellness: 'Wellness Achievements',

    improvement: 'Improvement Achievements'



    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]: [string, any]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {category === 'study' && <BookOpen className="h-5 w-5 text-primary" />}
              {category === 'quiz' && <Brain className="h-5 w-5 text-accent" />}
              {category === 'wellness' && <Heart className="h-5 w-5 text-secondary" />}
              {category === 'consistency' && <Zap className="h-5 w-5 text-purple-500" />}
              {category === 'improvement' && <Star className="h-5 w-5 text-yellow-500" />}
              {categoryNames[category as keyof typeof categoryNames]}

          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement: Achievement) => {
                const earned = achievement.condition(data)

                const style = getBadgeStyle(achievement.type, earned)

                return (
                  <div
                    key={achievement.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${style.border} ${style.bg} ${
                      earned ? 'shadow-md hover:shadow-lg' : 'opacity-60'

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

                        {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}

                    </div>

                    {/* Achievement Info */}
                    <div className="text-center space-y-1">
                      <h3 className={`font-semibold text-sm ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-xs ${earned ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                        {achievement.description}

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

              })}

          </CardContent>

      ))}

      {/* Achievement Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Trophy className="h-12 w-12 text-accent" />
            </div>

              <h3 className="text-xl font-bold text-foreground">Achievement Progress</h3>
              <p className="text-muted-foreground mt-2">
                You've earned {achievements.filter(a => a.condition(data)).length} out of {achievements.length} achievements!

            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(achievements.filter(a => a.condition(data)).length / achievements.length) * 100}%` }}

            </div>
          </div>
        </CardContent>

    </div>

}