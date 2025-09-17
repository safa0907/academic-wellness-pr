import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Heart, Pause, Play, Sparkle, Moon, Sun } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { HSESupport } from '@/components/HSESupport'
import { GlobalStats } from '@/components/GlobalStats'
import { ConversationStarters } from '@/components/ConversationStarters'

interface WellnessProps {
  userProfile: any
}

interface WellnessData {
  dailyCheckins: any[]
  breathingSessions: Array<{
    date: string
    cycles: number
    duration: number
  }>
  stressLevels: Array<{
    date: string
    level: number
  }>
}

export function Wellness({ userProfile }: WellnessProps) {
  const [wellnessData, setWellnessData] = useKV<WellnessData>('wellness-data', {
    dailyCheckins: [],
    breathingSessions: [],
    stressLevels: []
  })
  
  const [currentStress, setCurrentStress] = useState(5)
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathingCycle, setBreathingCycle] = useState(0)
  const [breathingTimer, setBreathingTimer] = useState(0)

  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 6
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const currentPhaseTime = breathingPattern[breathingPhase]
          
          if (prev >= currentPhaseTime) {
            // Move to next phase
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold')
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale')
            } else {
              setBreathingPhase('inhale')
              setBreathingCycle(c => c + 1)
            }
            return 0
          }
          
          return prev + 0.1
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isBreathing, breathingPhase])

  const startBreathing = () => {
    setIsBreathing(true)
    setBreathingCycle(0)
    setBreathingTimer(0)
    setBreathingPhase('inhale')
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    if (breathingCycle > 0 && wellnessData) {
      setWellnessData({
        ...wellnessData,
        breathingSessions: [...wellnessData.breathingSessions, {
          date: new Date().toISOString(),
          cycles: breathingCycle,
          duration: breathingCycle * 14 // seconds per full cycle
        }]
      })
    }
  }

  const logStressLevel = () => {
    if (!wellnessData) return
    
    const today = new Date().toISOString().split('T')[0]
    setWellnessData({
      ...wellnessData,
      stressLevels: [...wellnessData.stressLevels.filter(s => !s.date.startsWith(today)), {
        date: new Date().toISOString(),
        level: currentStress
      }]
    })
  }

  const getBreathingCircleStyle = () => {
    const progress = breathingTimer / breathingPattern[breathingPhase]
    let scale = 1
    
    if (breathingPhase === 'inhale') {
      scale = 1 + (progress * 0.5)
    } else if (breathingPhase === 'exhale') {
      scale = 1.5 - (progress * 0.5)
    } else {
      scale = 1.5
    }
    
    return {
      transform: `scale(${scale})`,
      transition: 'transform 0.1s ease-in-out'
    }
  }

  const getPhaseInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
    }
  }

  const recentStressLevel = wellnessData?.stressLevels[wellnessData.stressLevels.length - 1]?.level || 5
  const todaySessions = wellnessData?.breathingSessions.filter(s => 
    s.date.startsWith(new Date().toISOString().split('T')[0])
  ).length || 0

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Heart className="h-8 w-8 text-secondary" />
          Wellness Toolkit
        </h1>
        <p className="text-muted-foreground">
          Take care of your mental health while you study
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Stress Level</p>
                <p className="text-xl font-semibold">{recentStressLevel}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkle className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Sessions</p>
                <p className="text-xl font-semibold">{todaySessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Moon className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goal</p>
                <p className="text-xl font-semibold">{Math.min(todaySessions * 7, 21)}/21</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HSE Support - shows when stress is high */}
      <HSESupport stressLevel={Math.max(currentStress, recentStressLevel)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breathing Exercise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkle className="h-5 w-5 text-blue-500" />
              Guided Breathing
            </CardTitle>
            <CardDescription>
              4-4-6 breathing pattern to reduce stress and improve focus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
                  style={getBreathingCircleStyle()}
                />
                {isBreathing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white font-medium text-sm">
                      {getPhaseInstruction()}
                    </p>
                  </div>
                )}
              </div>
              
              {isBreathing && (
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold">{getPhaseInstruction()}</p>
                  <p className="text-sm text-muted-foreground">
                    Cycle {breathingCycle + 1} • {Math.ceil(breathingPattern[breathingPhase] - breathingTimer)}s
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                {!isBreathing ? (
                  <Button onClick={startBreathing} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Exercise
                  </Button>
                ) : (
                  <Button onClick={stopBreathing} variant="outline" className="flex items-center gap-2">
                    <Pause className="h-4 w-4" />
                    Complete Session
                  </Button>
                )}
              </div>
              
              {breathingCycle > 0 && (
                <Badge variant="secondary">
                  {breathingCycle} cycles completed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stress Check-in */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-secondary" />
              Stress Check-in
            </CardTitle>
            <CardDescription>
              How are you feeling right now? (1 = very calm, 10 = very stressed)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm">😌</span>
                <Slider
                  value={[currentStress]}
                  onValueChange={(value) => setCurrentStress(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm">😰</span>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{currentStress}/10</p>
                <p className="text-sm text-muted-foreground">
                  {currentStress <= 3 && 'Feeling calm and relaxed'}
                  {currentStress > 3 && currentStress <= 6 && 'Moderate stress level'}
                  {currentStress > 6 && currentStress <= 8 && 'Feeling quite stressed'}
                  {currentStress > 8 && 'High stress - consider taking a break'}
                </p>
              </div>
              
              <Button onClick={logStressLevel} className="w-full">
                Log Current Level
              </Button>
              
              {currentStress > 6 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">High Stress Detected</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Consider taking a break and trying some wellness activities.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={startBreathing}
                      className="w-full"
                    >
                      Try Breathing Exercise
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Student Insights - Wellness Focus */}
      <GlobalStats />

      {/* Conversation Starters for Families */}
      <ConversationStarters />

      {/* High Stress Level Support */}
      {currentStress >= 8 && <HSESupport stressLevel={currentStress} />}

      {/* Quick Wellness Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-accent" />
            Wellness Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Take Regular Breaks</h4>
              <p className="text-sm text-muted-foreground">
                Follow the 25-5 rule: 25 minutes study, 5 minutes break
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Stay Hydrated</h4>
              <p className="text-sm text-muted-foreground">
                Drink water regularly to maintain focus and energy
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Practice Gratitude</h4>
              <p className="text-sm text-muted-foreground">
                Acknowledge your progress and celebrate small wins
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}