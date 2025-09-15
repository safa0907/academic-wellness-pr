import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ArrowRight, ArrowLeft, Sparkle, GraduationCap, Target } from '@phosphor-icons/react'

interface OnboardingProps {
  onComplete: (profile: any) => void
}

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
  'Geography', 'Computer Science', 'Economics', 'Psychology', 'Art', 'Music'
]

const STUDY_GOALS = [
  { id: 'exam', label: 'Prepare for exams', icon: '📚' },
  { id: 'improve', label: 'Improve grades', icon: '📈' },
  { id: 'understand', label: 'Better understanding', icon: '💡' },
  { id: 'confidence', label: 'Build confidence', icon: '💪' },
  { id: 'habits', label: 'Develop study habits', icon: '⏰' },
  { id: 'stress', label: 'Reduce study stress', icon: '😌' }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    name: '',
    subjects: [] as string[],
    confidence: {} as Record<string, number>,
    goals: [] as string[],
    studyTime: 2,
    stressLevel: 5
  })

  const handleSubjectToggle = (subject: string) => {
    setProfile(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleConfidenceChange = (subject: string, value: number[]) => {
    setProfile(prev => ({
      ...prev,
      confidence: { ...prev.confidence, [subject]: value[0] }
    }))
  }

  const handleGoalToggle = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(profile)
    }
  }

  const prevStep = () => {
    setStep(Math.max(0, step - 1))
  }

  const canProceed = () => {
    switch (step) {
      case 0: return profile.name.trim().length > 0
      case 1: return profile.subjects.length > 0
      case 2: return profile.subjects.every(s => profile.confidence[s] !== undefined)
      case 3: return profile.goals.length > 0
      case 4: return true
      default: return false
    }
  }

  const stepTitles = [
    "Let's get started!",
    "Choose your subjects",
    "Rate your confidence",
    "Set your goals",
    "Customize your experience"
  ]

  const stepDescriptions = [
    "Tell us a bit about yourself",
    "Select the subjects you're studying",
    "How confident do you feel in each subject?",
    "What would you like to achieve?",
    "Help us personalize your experience"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">GradeUp</h1>
          </div>
          <CardTitle className="text-xl">{stepTitles[step]}</CardTitle>
          <CardDescription>{stepDescriptions[step]}</CardDescription>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Sparkle className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Welcome to your personalized learning journey!
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Select all subjects you're currently studying or want to focus on
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUBJECTS.map((subject) => (
                  <Badge
                    key={subject}
                    variant={profile.subjects.includes(subject) ? "default" : "outline"}
                    className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground text-center">
                Rate your current confidence level in each subject (0-100%)
              </p>
              <div className="space-y-4">
                {profile.subjects.map((subject) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between">
                      <Label>{subject}</Label>
                      <span className="text-sm text-muted-foreground">
                        {profile.confidence[subject] || 50}%
                      </span>
                    </div>
                    <Slider
                      value={[profile.confidence[subject] || 50]}
                      onValueChange={(value) => handleConfidenceChange(subject, value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                What are your main study goals? (Select all that apply)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {STUDY_GOALS.map((goal) => (
                  <Card
                    key={goal.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      profile.goals.includes(goal.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-medium">{goal.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>How many hours per day would you like to study?</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[profile.studyTime]}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, studyTime: value[0] }))}
                      max={8}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium min-w-[3rem]">
                      {profile.studyTime}h
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current stress level about studying (1-10)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[profile.stressLevel]}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, stressLevel: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium min-w-[2rem]">
                      {profile.stressLevel}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Ready to start!</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll create your personalized study plan and wellness toolkit based on your preferences.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {step === 4 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}