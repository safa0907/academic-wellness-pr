import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gear, Clock, Bell } from '@phosphor-icons/react'

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
  studyBursts: true,
  notifications: true,
  autoDistribute: true,
  rolloverRules: {
    enabled: true,
    priority: 'medium',
    maxRolloverDays: 3,
    skipWeekends: false
  }
}

export function SchedulingPreferences() {
  const [preferences, setPreferences] = useKV<SchedulingPreferences>('scheduling-preferences', defaultPreferences)
  const [currentPrefs, setCurrentPrefs] = useState<SchedulingPreferences>(preferences || defaultPreferences)

  useEffect(() => {
    if (preferences) {
      setCurrentPrefs(preferences)
    }
  }, [preferences])

  const updatePreference = (key: keyof SchedulingPreferences, value: any) => {
    const updated = { ...currentPrefs, [key]: value }
    setCurrentPrefs(updated)
    setPreferences(updated)
  }

  const updateRolloverRule = (key: keyof SchedulingPreferences['rolloverRules'], value: any) => {
    const updated = { 
      ...currentPrefs, 
      rolloverRules: { ...currentPrefs.rolloverRules, [key]: value }
    }
    setCurrentPrefs(updated)
    setPreferences(updated)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Study Preferences</h2>
        <p className="text-muted-foreground">
          Customize your study schedule and session preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Study Hours
          </CardTitle>
          <CardDescription>
            Set your preferred study time window
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Study Bursts</Label>
              <p className="text-xs text-muted-foreground">
                Break sessions into 25-minute focused intervals
              </p>
            </div>
            <Switch
              checked={currentPrefs.studyBursts}
              onCheckedChange={(checked) => updatePreference('studyBursts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive reminders for study sessions
              </p>
            </div>
            <Switch
              checked={currentPrefs.notifications}
              onCheckedChange={(checked) => updatePreference('notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gear className="w-5 h-5" />
            Rollover Settings
          </CardTitle>
          <CardDescription>
            Control how incomplete sessions are handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Rollover</Label>
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
                <div className="space-y-0.5">
                  <Label>Skip Weekends</Label>
                  <p className="text-xs text-muted-foreground">
                    Don't rollover sessions to weekends
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
            <Bell className="w-5 h-5" />
            Current Settings
          </CardTitle>
          <CardDescription>
            Your active preferences at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Badge variant="outline" className="w-fit">
                {currentPrefs.startTime} - {currentPrefs.endTime}
              </Badge>
              <Label className="text-xs text-muted-foreground block">
                Study Hours
              </Label>
            </div>
            
            <div className="space-y-1">
              <Badge variant="outline" className="w-fit">
                {currentPrefs.preferredDifficulty}
              </Badge>
              <Label className="text-xs text-muted-foreground block">
                Difficulty Level
              </Label>
            </div>
            
            <div className="space-y-1">
              <Badge variant="outline" className="w-fit">
                {currentPrefs.breakDuration}min breaks
              </Badge>
              <Label className="text-xs text-muted-foreground block">
                Break Duration
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Smart Scheduling Features</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your preferences enable these intelligent features
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background/50">
                  Adaptive Difficulty
                </Badge>
                <Badge variant="outline" className="bg-background/50">
                  Performance Tracking
                </Badge>
                <Badge variant="outline" className="bg-background/50">
                  Smart Reminders
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}