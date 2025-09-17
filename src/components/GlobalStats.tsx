import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { TrendUp, Users, Heart, Brain } from '@phosphor-icons/react'

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
    icon: <Heart className="w-5 h-5" />
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
    description: 'of students report better focus with regular breaks',
    category: 'wellness',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: '4',
    value: '92%',
    description: 'of students feel more confident with consistent practice',
    category: 'achievement',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: '5',
    value: '71%',
    description: 'of students experience exam anxiety regularly',
    category: 'stress',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: '6',
    value: '89%',
    description: 'of successful students break study into smaller sessions',
    category: 'study',
    icon: <TrendUp className="w-5 h-5" />
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
  achievement: 'Achievement'
}

export function GlobalStats() {
  const [displayedStats, setDisplayedStats] = useState<Stat[]>([])
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  useEffect(() => {
    // Randomly select 3 stats to display
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-0">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3 sm:gap-0">
              <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary sm:mr-4">
                {currentStat.icon}
              </div>
              <Badge 
                className={categoryColors[currentStat.category]}
                variant="secondary"
              >
                {categoryLabels[currentStat.category]}
              </Badge>
            </div>
            
            <motion.div
              key={currentStat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {currentStat.value}
              </div>
              <p className="text-base sm:text-lg text-foreground leading-relaxed px-2">
                {currentStat.description}
              </p>
            </motion.div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center space-x-2 mt-6">
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
          
          <div className="mt-3 text-center px-2">
            <p className="text-xs text-muted-foreground">
              You're not alone in your academic journey • Data anonymized from global student surveys
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}