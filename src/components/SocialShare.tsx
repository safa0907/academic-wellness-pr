import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share, TwitterLogo, FacebookLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SocialShareProps {
  score: number
  totalQuestions: number
  subject: string
  percentage: number
}

export function SocialShare({ score, totalQuestions, subject, percentage }: SocialShareProps) {
  const shareText = `Just scored ${score}/${totalQuestions} (${percentage}%) on a ${subject} quiz using GradeUp! 🎯 #GradeUp #StudySuccess #Learning`
  const shareUrl = window.location.origin

  const handleShare = (platform: string) => {
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
        break
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        toast.success('Results copied to clipboard!')
        return
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
      toast.success('Sharing your success!')
    }
  }

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Share className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-accent-foreground">Share Your Success!</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Let others know about your learning achievements
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2"
          >
            <TwitterLogo className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2"
          >
            <FacebookLogo className="h-4 w-4" />
            Facebook
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2"
          >
            <LinkedinLogo className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare('copy')}
            className="flex items-center gap-2"
          >
            <Share className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}