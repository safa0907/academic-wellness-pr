import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Warning, Heart, Clock } from '@phosphor-icons/react'

interface HSESupportProps {
  stressLevel: number
}

export function HSESupport({ stressLevel }: HSESupportProps) {
  const supportServices = [
    {
      name: 'HSE Mental Health Helpline',
      number: '1800 111 888',
      description: 'Free, confidential mental health support',
      hours: '24/7'
    },
    {
      name: 'Samaritans Ireland',
      number: '116 123',
      description: 'Free emotional support for anyone in distress',
      hours: '24/7'
    },
    {
      name: 'Pieta House',
      number: '1800 247 247',
      description: 'Crisis counseling and suicide prevention',
      hours: '24/7'
    },
    {
      name: 'Text About It',
      number: '087 0818 19',
      description: 'Text-based crisis support (text HELLO)',
      hours: '24/7'
    }
  ]

  const handleCall = (number: string, name: string) => {
    // On mobile devices, this will open the phone dialer
    window.location.href = `tel:${number.replace(/\s/g, '')}`
  }

  if (stressLevel < 8) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Warning className="h-5 w-5" />
          Mental Health Support Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-red-100/50 rounded-lg">
          <Heart className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-red-800 mb-1">You're showing high stress levels</p>
            <p className="text-red-700">
              It's important to reach out for support. These services are free and confidential.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {supportServices.map((service, index) => (
            <div key={index} className="p-3 bg-white/70 rounded-lg border border-red-200/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">{service.name}</h4>
                  <p className="text-sm text-red-700 mb-1">{service.description}</p>
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <Clock className="h-3 w-3" />
                    {service.hours}
                  </div>
                </div>
                <Button
                  onClick={() => handleCall(service.number, service.name)}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  size="sm"
                >
                  <Phone className="h-4 w-4" />
                  {service.number}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Remember:</strong> Seeking help is a sign of strength, not weakness. 
            Your mental health is just as important as your academic success.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}