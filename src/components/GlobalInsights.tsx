import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Heart, TrendUp, Users, CaretLeft, CaretRight } from '@phosphor-icons/react'

interface GlobalStat {
  id: string
  percentage: number
  category: 'stress' | 'wellness' | 'achievement' | 'support'
  description: string
}

const globalStats: GlobalStat[] = [
  {
    id: '1',
    percentage: 66,
    category: 'stress',
    description: 'of students worldwide feel stressed about grades'
  },
  {
    id: '2', 
    percentage: 78,
    category: 'wellness',
    description: 'report improved focus with mindfulness practices'
  },
  {
    id: '3',
    percentage: 84,
    category: 'achievement',
    description: 'perform better with structured study plans'
  },
  {
    id: '4',
    percentage: 71,
    category: 'support',
    description: 'find peer support helps reduce anxiety'
  },
  {
    id: '5',
    percentage: 92,
    category: 'wellness',
    description: 'feel more confident after completing practice tests'
  }
]

const getCategoryIcon = (category: GlobalStat['category']) => {
  switch (category) {
    case 'stress': return <TrendUp className="h-5 w-5" />
    case 'achievement': return <Users className="h-5 w-5" />
    case 'wellness': return <Heart className="h-5 w-5" />
    case 'support': return <Globe className="h-5 w-5" />
  }
}

const getCategoryColor = (category: GlobalStat['category']) => {
  switch (category) {
    case 'stress': return 'text-destructive'
    case 'achievement': return 'text-primary'
    case 'wellness': return 'text-secondary'
    case 'support': return 'text-accent'
  }
}

export function GlobalInsights() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % globalStats.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % globalStats.length)
  }

  const prevStat = () => {
    setCurrentStatIndex((prev) => (prev - 1 + globalStats.length) % globalStats.length)
  }

  const currentStat = globalStats[currentStatIndex]

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5 text-primary" />
          You're Not Alone
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Global insights from students worldwide
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStat}
            className="h-8 w-8 p-0"
          >
            <CaretLeft className="h-4 w-4" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className={`flex items-center justify-center gap-2 mb-2 ${getCategoryColor(currentStat.category)}`}>
                {getCategoryIcon(currentStat.category)}
                <span className="text-3xl font-bold">
                  {currentStat.percentage}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-48">
                {currentStat.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextStat}
            className="h-8 w-8 p-0"
          >
            <CaretRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          {globalStats.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentStatIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}