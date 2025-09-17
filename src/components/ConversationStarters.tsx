import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, ArrowClockwise, ChatCircle, Heart } from '@phosphor-icons/react'

interface ConversationStartersProps {
  userProfile: any
}

const conversationTopics = [
  {
    category: "Academic Pressure",
    starters: [
      "What does success mean to you, and how is that different from what others expect?",
      "When do you feel most confident about your studies, and when do you feel most worried?",
      "How can we work together to make studying feel less overwhelming?",
      "What would help you feel more supported during exam season?",
      "How do you want us to react when you're struggling with schoolwork?"
    ]
  },
  {
    category: "Stress & Emotions",
    starters: [
      "How do you know when you're feeling stressed, and what helps you feel calmer?",
      "What are some signs that we should watch for to know when you need extra support?",
      "How can we create a home environment that feels peaceful during study time?",
      "What kind of encouragement helps you most when things get difficult?",
      "How do you want to handle disappointment if results aren't what we hoped?"
    ]
  },
  {
    category: "Communication & Support",
    starters: [
      "How do you prefer to talk about school - regularly or only when something's wrong?",
      "What questions can we ask that feel supportive rather than stressful?",
      "How can we show we're proud of your effort, not just your grades?",
      "What's one thing we could do differently to help you feel more understood?",
      "How can we be your biggest cheerleaders while still being realistic?"
    ]
  },
  {
    category: "Future & Expectations",
    starters: [
      "What are your own dreams and goals, separate from what others expect?",
      "How do you want to handle it if your interests change or evolve?",
      "What does 'doing your best' mean to you personally?",
      "How can we support your goals while keeping life balanced and enjoyable?",
      "What would you want us to remember about this time in your life years from now?"
    ]
  },
  {
    category: "Balance & Well-being",
    starters: [
      "What activities or hobbies help you feel most like yourself?",
      "How can we make sure studying doesn't take over everything else in your life?",
      "What would an ideal study day look like for you?",
      "How can we help you maintain friendships and fun while working toward your goals?",
      "What are some ways we can celebrate progress, not just final results?"
    ]
  }
]

export function ConversationStarters({ userProfile }: ConversationStartersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStarter, setCurrentStarter] = useState<string>("")

  const getRandomStarter = (category?: string) => {
    let availableStarters: string[] = []
    
    if (category) {
      const topic = conversationTopics.find(t => t.category === category)
      availableStarters = topic?.starters || []
    } else {
      availableStarters = conversationTopics.flatMap(topic => topic.starters)
    }
    
    if (availableStarters.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableStarters.length)
      setCurrentStarter(availableStarters[randomIndex])
    }
  }

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      setCurrentStarter("")
    } else {
      setSelectedCategory(category)
      getRandomStarter(category)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-200/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Family Conversation Starters
        </CardTitle>
        <CardDescription>
          Thoughtful questions to help families discuss stress, expectations, and support in a caring way
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground">Choose a topic:</h4>
          <div className="flex flex-wrap gap-2">
            {conversationTopics.map((topic) => (
              <Badge
                key={topic.category}
                variant={selectedCategory === topic.category ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-primary/10"
                onClick={() => handleCategorySelect(topic.category)}
              >
                {topic.category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Conversation Starter */}
        {currentStarter && (
          <div className="bg-white/70 border border-blue-200/50 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <ChatCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900">Conversation Starter:</p>
                <p className="text-foreground leading-relaxed">{currentStarter}</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => getRandomStarter(selectedCategory || undefined)}
                className="flex items-center gap-1"
              >
                <ArrowClockwise className="h-3 w-3" />
                New Question
              </Button>
            </div>
          </div>
        )}

        {/* Get Started */}
        {!currentStarter && (
          <div className="text-center py-6">
            <Button 
              onClick={() => getRandomStarter()}
              className="flex items-center gap-2"
            >
              <ChatCircle className="h-4 w-4" />
              Get a Random Starter
            </Button>
          </div>
        )}

        {/* Tips for Conversations */}
        <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-900">Tips for Meaningful Conversations</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Choose a relaxed time when everyone can focus</li>
                <li>• Listen without immediately offering solutions</li>
                <li>• Share your own feelings and experiences too</li>
                <li>• Focus on understanding rather than being right</li>
                <li>• Remember that these conversations build trust over time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why These Conversations Matter */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Why Family Conversations Help:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900">For Students:</p>
              <p className="text-muted-foreground">Reduces isolation, builds confidence, and provides emotional support during challenging times.</p>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium text-purple-900">For Families:</p>
              <p className="text-muted-foreground">Creates understanding, strengthens relationships, and helps everyone work together effectively.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}