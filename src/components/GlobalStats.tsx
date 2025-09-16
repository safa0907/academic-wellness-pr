import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendUp, Users, Brain, Heart } from '@phosphor-icons/react'

interface Stat {
  id: string
  value: string
  description: string
  category: 'stress' | 'study' | 'wellness' | 'achievement'
  icon: React.ReactNode
}

const globalStats: Stat[] = [
  {
    id: '1',
    value: '66%',
    description: 'of students worldwide feel stressed about grades',
    category: 'stress',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: '2',
    value: '78%',
    description: 'of high-achieving students use study planners',
    category: 'study',
    icon: <TrendUp className="w-5 h-5" />
  },
  {
    id: '3',
    value: '84%',
    description: 'of students report better focus after mindfulness practice',
    category: 'wellness',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: '4',
    value: '92%',
    description: 'of students improve when they track their progress',
    category: 'achievement',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '5',
    value: '45%',
    description: 'of students struggle with time management',
    category: 'study',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: '6',
    value: '71%',
    description: 'of students feel more confident with regular practice',
    category: 'achievement',
    icon: <TrendUp className="w-5 h-5" />
  },
  {
    id: '7',
    value: '56%',
    description: 'of students report sleep issues during exam periods',
    category: 'wellness',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: '8',
    value: '89%',
    description: 'of successful students break study into smaller sessions',
    category: 'study',
    icon: <Users className="w-5 h-5" />
  }
]

const categoryColors = {
  stress: 'bg-orange-100 text-orange-700',
  study: 'bg-blue-100 text-blue-700',
  wellness: 'bg-green-100 text-green-700',
  achievement: 'bg-purple-100 text-purple-700'
}

const categoryLabels = {
  stress: 'Student Wellbeing',
  study: 'Study Habits',
  wellness: 'Mental Health',
  achievement: 'Academic Success'
}

export function GlobalStats() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [displayedStats, setDisplayedStats] = useState<Stat[]>([])

  useEffect(() => {
    // Shuffle and select 3 random stats
    const shuffled = [...globalStats].sort(() => Math.random() - 0.5)
    setDisplayedStats(shuffled.slice(0, 3))
  }, [])

  useEffect(() => {
    if (displayedStats.length === 0) return

    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % displayedStats.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [displayedStats.length])

  if (displayedStats.length === 0) return null

  const currentStat = displayedStats[currentStatIndex]

  return (
    <div className="w-full">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Global Student Insights</span>
            </div>
            <Badge 
              variant="secondary" 
              className={categoryColors[currentStat.category]}
            >
              {categoryLabels[currentStat.category]}
            </Badge>
          </div>
          
          <div
            key={currentStat.id}
            className="flex items-center gap-4 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
              {currentStat.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {currentStat.value}
                </span>
                <span className="text-foreground">
                  {currentStat.description}
                </span>
              </div>
            </div>
          </div>

          {/* Indicator dots */}
          <div className="flex justify-center gap-2 mt-4">
            {displayedStats.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStatIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentStatIndex 
                    ? 'bg-primary' 
                    : 'bg-primary/20 hover:bg-primary/40'
                }`}
              />
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              You're not alone in your academic journey • Data anonymized from global student surveys
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}