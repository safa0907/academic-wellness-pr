import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, ArrowClockwise, ChatCircle, Heart } from '@phosphor-icons/react'

interface ConversationStartersProps {
  className?: string
}

const conversationTopics = [
  {
    category: "Academic Pressure",
    starters: [
      "What does success mean to you in your studies?",
      "How can we work together to make studying feel less overwhelming?",
      "What would help you feel more supported during exam season?",
      "How do you want us to react when you're struggling with schoolwork?",
      "What are your biggest worries about the Leaving Certificate?"
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
    category: "Balance & Wellbeing",
    starters: [
      "What activities help you recharge after studying?",
      "How can we make sure you're getting enough rest and fun time?",
      "What does a good balance between study and relaxation look like for you?",
      "How can we help you maintain friendships during busy study periods?",
      "What are your non-academic goals and interests right now?"
    ]
  }
]

export function ConversationStarters({ className }: ConversationStartersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStarter, setCurrentStarter] = useState<string>("")

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      setCurrentStarter("")
    } else {
      setSelectedCategory(category)
      // Get a random starter from the selected category
      const topic = conversationTopics.find(t => t.category === category)
      if (topic && topic.starters.length > 0) {
        const randomStarter = topic.starters[Math.floor(Math.random() * topic.starters.length)]
        setCurrentStarter(randomStarter)
      }
    }
  }

  const generateNewStarter = () => {
    let availableStarters: string[] = []
    
    if (selectedCategory) {
      const topic = conversationTopics.find(t => t.category === selectedCategory)
      availableStarters = topic?.starters || []
    } else {
      availableStarters = conversationTopics.flatMap(topic => topic.starters)
    }
    
    if (availableStarters.length > 0) {
      const randomStarter = availableStarters[Math.floor(Math.random() * availableStarters.length)]
      setCurrentStarter(randomStarter)
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-200/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Family Conversation Starters
        </CardTitle>
        <CardDescription>
          Start meaningful conversations with your family about stress, school, and wellbeing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {conversationTopics.map((topic) => (
              <Badge
                key={topic.category}
                variant={selectedCategory === topic.category ? "default" : "secondary"}
                className="cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => handleCategorySelect(topic.category)}
              >
                {topic.category}
              </Badge>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <ChatCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-blue-900">Conversation Starter:</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={generateNewStarter}
              className="ml-auto"
            >
              <ArrowClockwise className="h-4 w-4" />
            </Button>
          </div>

          {!currentStarter && (
            <Button 
              onClick={generateNewStarter}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ChatCircle className="h-4 w-4 mr-2" />
              Generate Conversation Starter
            </Button>
          )}

          {currentStarter && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 font-medium mb-3">"{currentStarter}"</p>
              
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Tips for a good conversation:</span>
                </div>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Listen without immediately trying to solve problems</li>
                  <li>• Focus on understanding their perspective</li>
                  <li>• Ask follow-up questions to show you care</li>
                  <li>• Share your own feelings and experiences when appropriate</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-blue-100">
          <p className="text-xs text-muted-foreground">
            Regular family conversations about mental health help normalize these topics and create a supportive environment for academic success.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}