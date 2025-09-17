import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Heart, Shuffle, Share } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ConversationStarter {
  id: string
  question: string
  followUp: string
  category: 'stress' | 'expectations' | 'support' | 'understanding'
  difficulty: 'easy' | 'medium' | 'deep'
}

const conversationStarters: ConversationStarter[] = [
  {
    id: '1',
    question: "How are you feeling about school lately?",
    followUp: "What specific things are making you feel that way?",
    category: 'stress',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: "What's the most stressful part of your day?",
    followUp: "How can we work together to make that easier?",
    category: 'stress',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: "What expectations do you feel from us about your grades?",
    followUp: "Are those expectations helpful or adding pressure?",
    category: 'expectations',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: "When you're overwhelmed, what do you need from us?",
    followUp: "How can we better recognize when you're struggling?",
    category: 'support',
    difficulty: 'medium'
  },
  {
    id: '5',
    question: "Do you feel like your worth is tied to your academic performance?",
    followUp: "What are some things about you that have nothing to do with grades that make us proud?",
    category: 'understanding',
    difficulty: 'deep'
  },
  {
    id: '6',
    question: "What's your biggest fear about your future right now?",
    followUp: "How can we work together to address that fear?",
    category: 'stress',
    difficulty: 'deep'
  },
  {
    id: '7',
    question: "How do you think academic pressure has affected our family relationships?",
    followUp: "What changes could we make to prioritize our connection?",
    category: 'understanding',
    difficulty: 'deep'
  },
  {
    id: '8',
    question: "What does success mean to you beyond grades?",
    followUp: "How can we celebrate and work toward that vision together?",
    category: 'support',
    difficulty: 'deep'
  }
]

const categoryColors = {
  stress: 'bg-red-100 text-red-700 border-red-200',
  expectations: 'bg-blue-100 text-blue-700 border-blue-200',
  support: 'bg-green-100 text-green-700 border-green-200',
  understanding: 'bg-purple-100 text-purple-700 border-purple-200'
}

const difficultyColors = {
  easy: 'bg-green-50 text-green-600',
  medium: 'bg-yellow-50 text-yellow-600',
  deep: 'bg-orange-50 text-orange-600'
}

export function FamilyConversation() {
  const [currentStarter, setCurrentStarter] = useState<ConversationStarter>(
    conversationStarters[Math.floor(Math.random() * conversationStarters.length)]
  )
  const [showFollowUp, setShowFollowUp] = useState(false)

  const getRandomStarter = () => {
    const newStarter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)]
    setCurrentStarter(newStarter)
    setShowFollowUp(false)
  }

  const shareStarter = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Conversation Starter - GradeUp',
          text: `"${currentStarter.question}" - A conversation starter to help families discuss stress and expectations around academics.`,
          url: window.location.href
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      const text = `"${currentStarter.question}" - A conversation starter from GradeUp to help families discuss stress and expectations.`
      await navigator.clipboard.writeText(text)
      toast.success('Conversation starter copied to clipboard!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Users className="text-primary" />
          Family Conversation Starters
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Open, honest conversations about academic stress and expectations can strengthen family relationships and support student wellbeing.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center gap-2 mb-2">
            <Badge className={categoryColors[currentStarter.category]}>
              {currentStarter.category}
            </Badge>
            <Badge variant="outline" className={difficultyColors[currentStarter.difficulty]}>
              {currentStarter.difficulty} conversation
            </Badge>
          </div>
          <CardTitle className="text-xl">Conversation Starter</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
            <p className="text-lg font-medium text-foreground mb-4">
              "{currentStarter.question}"
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Take time to listen and share openly
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFollowUp(!showFollowUp)}
              >
                {showFollowUp ? 'Hide' : 'Show'} Follow-up Question
              </Button>
            </div>

            {showFollowUp && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-1">Follow-up:</p>
                <p className="text-sm text-foreground">"{currentStarter.followUp}"</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={getRandomStarter} variant="default">
              <Shuffle className="mr-2" size={16} />
              New Question
            </Button>
            <Button onClick={shareStarter} variant="outline">
              <Share className="mr-2" size={16} />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tips for Meaningful Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                For Parents/Guardians
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Listen without immediately offering solutions
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Validate their feelings before giving advice
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Share your own experiences appropriately
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Create a judgment-free space for honest sharing
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                For Students
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Share your real feelings, not just what you think they want to hear
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Be specific about what kind of support helps you
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  It's okay to take breaks if the conversation gets overwhelming
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Ask for what you need - they want to help but might not know how
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}