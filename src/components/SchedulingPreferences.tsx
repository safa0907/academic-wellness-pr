import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  Clock, 
  Gear, 
  Brain
} from '@phosphor-icons/react'

interface SchedulingPreferences {
  startTime: string
  endTime: string
  breakDuration: number
  preferredDifficulty: 'easy' | 'medium' | 'hard'
  studyBursts: boolean
  notifications: boolean
  autoDistribute: boolean
  rolloverRules: {
    enabled: boolean
    priority: 'high' | 'medium' | 'low'
    maxRolloverDays: number
    skipWeekends: boolean
  }
}

const defaultPreferences: SchedulingPreferences = {
  startTime: '09:00',
  endTime: '17:00',
  breakDuration: 15,
  preferredDifficulty: 'medium',
  studyBursts: false,
  notifications: true,
  autoDistribute: true,
  rolloverRules: {
    enabled: true,
    priority: 'medium',
    maxRolloverDays: 3,
    skipWeekends: false
  }
}

interface Props {
  userProfile: any
}

export function SchedulingPreferences({ userProfile }: Props) {
  const [preferences, setPreferences] = useKV<SchedulingPreferences>('scheduling-preferences', defaultPreferences)
  const [currentPrefs, setCurrentPrefs] = useState(preferences || defaultPreferences)

  // Update currentPrefs when preferences from useKV changes
  useEffect(() => {
    if (preferences) {
      setCurrentPrefs(preferences)
    }
  }, [preferences])

  const updatePreference = (key: string, value: any) => {
    const updated = { ...currentPrefs, [key]: value } as SchedulingPreferences
    setPreferences(updated)
    setCurrentPrefs(updated)
  }

  const updateRolloverRule = (key: string, value: any) => {
    const updated = { 
      ...currentPrefs, 
      rolloverRules: { ...currentPrefs.rolloverRules, [key]: value }
    } as SchedulingPreferences
    setPreferences(updated)
    setCurrentPrefs(updated)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Scheduling Preferences</h2>
        <p className="text-muted-foreground">
          Customize your study schedule to match your learning style and availability
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Study Schedule
          </CardTitle>
          <CardDescription>
            Set your preferred study hours and break duration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={currentPrefs.startTime}
                onChange={(e) => updatePreference('startTime', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={currentPrefs.endTime}
                onChange={(e) => updatePreference('endTime', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Break Duration (minutes)</Label>
            <Input
              type="number"
              min="5"
              max="60"
              value={currentPrefs.breakDuration}
              onChange={(e) => updatePreference('breakDuration', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred Difficulty</Label>
            <Select 
              value={currentPrefs.preferredDifficulty} 
              onValueChange={(value) => updatePreference('preferredDifficulty', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Study Bursts</Label>
                <p className="text-xs text-muted-foreground">
                  Break sessions into 25-minute focused bursts
                </p>
              </div>
              <Switch
                checked={currentPrefs.studyBursts}
                onCheckedChange={(checked) => updatePreference('studyBursts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Study Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  Get notifications when it's time to study
                </p>
              </div>
              <Switch
                checked={currentPrefs.notifications}
                onCheckedChange={(checked) => updatePreference('notifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gear className="h-5 w-5 text-primary" />
            Session Rollover Rules
          </CardTitle>
          <CardDescription className="text-sm">
            Control how incomplete sessions are handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Rollover</Label>
              <p className="text-xs text-muted-foreground">
                Automatically move incomplete sessions to the next day
              </p>
            </div>
            <Switch
              checked={currentPrefs.rolloverRules.enabled}
              onCheckedChange={(checked) => updateRolloverRule('enabled', checked)}
            />
          </div>
          
          {currentPrefs.rolloverRules.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>Rollover Priority</Label>
                <Select 
                  value={currentPrefs.rolloverRules.priority} 
                  onValueChange={(value) => updateRolloverRule('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Rollover Days</Label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={currentPrefs.rolloverRules.maxRolloverDays}
                  onChange={(e) => updateRolloverRule('maxRolloverDays', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Skip Weekends</Label>
                  <p className="text-xs text-muted-foreground">
                    Don't schedule rollover sessions on weekends
                  </p>
                </div>
                <Switch
                  checked={currentPrefs.rolloverRules.skipWeekends}
                  onCheckedChange={(checked) => updateRolloverRule('skipWeekends', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Current Settings
          </CardTitle>
          <CardDescription>
            Overview of your active preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Study Hours</Label>
              <Badge variant="secondary" className="text-sm">
                {currentPrefs.startTime} - {currentPrefs.endTime}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Session Length</Label>
              <Badge variant="secondary" className="text-sm">
                {currentPrefs.studyBursts ? '25 min bursts' : 'Flexible'}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Break Duration</Label>
              <Badge variant="secondary" className="text-sm">
                {currentPrefs.breakDuration} minutes
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Difficulty</Label>
              <Badge variant="secondary" className="text-sm capitalize">
                {currentPrefs.preferredDifficulty}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Rollover</Label>
              <Badge variant={currentPrefs.rolloverRules.enabled ? "default" : "secondary"} className="text-sm">
                {currentPrefs.rolloverRules.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-primary mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-2">
                AI-Powered Optimization
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Your preferences will be used to create personalized study plans that adapt to your performance and availability.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  Adaptive Scheduling
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Performance Tracking
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Smart Rollover
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}