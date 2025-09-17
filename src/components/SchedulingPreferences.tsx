import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  Clock, 
  Gear, 
  Brain
} from '@phosphor-icons/react'

interface RolloverRule {
  enabled: boolean
  maxDays: number
  priority: 'low' | 'medium' | 'high'
  timeAdjustment: 'shorter' | 'normal' | 'longer'
  autoDistribute: boolean
  skipWeekends: boolean
}

interface SchedulingPreference {
  startTime: string
  endTime: string
  maxSessionDuration: number
  breakDuration: number
  preferredDifficulty: 'adaptive' | 'easy-first' | 'hard-first'
  studyBursts: boolean
  weekendStudy: boolean
  notifications: boolean
  rolloverRules: RolloverRule
}

const defaultPreferences: SchedulingPreference = {
  startTime: '09:00',
  endTime: '17:00',
  maxSessionDuration: 90,
  breakDuration: 15,
  preferredDifficulty: 'adaptive',
  studyBursts: false,
  weekendStudy: true,
  notifications: true,
  rolloverRules: {
    enabled: true,
    maxDays: 3,
    priority: 'medium',
    timeAdjustment: 'normal',
    autoDistribute: true,
    skipWeekends: false
  }
}

interface SchedulingPreferencesProps {
  userProfile: any
}

export function SchedulingPreferences({ userProfile }: SchedulingPreferencesProps) {
  const [preferences, setPreferences] = useKV<SchedulingPreference>('scheduling-preferences', defaultPreferences)
  const [currentPrefs, setCurrentPrefs] = useState<SchedulingPreference>(preferences || defaultPreferences)

  const updatePreference = (key: keyof SchedulingPreference, value: any) => {
    const updated = { ...currentPrefs, [key]: value }
    setCurrentPrefs(updated)
    setPreferences(updated)
  }

  const updateRolloverRule = (key: keyof RolloverRule, value: any) => {
    const updated = {
      ...currentPrefs,
      rolloverRules: { ...currentPrefs.rolloverRules, [key]: value }
    }
    setCurrentPrefs(updated)
    setPreferences(updated)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Study Preferences</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Customize your study schedule and learning preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Study Time Preferences
          </CardTitle>
          <CardDescription className="text-sm">
            Set your preferred study hours and session structure
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label>Max Session Duration (minutes)</Label>
              <Input
                type="number"
                min="15"
                max="180"
                value={currentPrefs.maxSessionDuration}
                onChange={(e) => updatePreference('maxSessionDuration', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Study Approach</Label>
            <Select 
              value={currentPrefs.preferredDifficulty} 
              onValueChange={(value) => updatePreference('preferredDifficulty', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adaptive">Adaptive (AI decides)</SelectItem>
                <SelectItem value="easy-first">Easy topics first</SelectItem>
                <SelectItem value="hard-first">Hard topics first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

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
                <Label>Weekend Study</Label>
                <p className="text-xs text-muted-foreground">
                  Include weekends in study planning
                </p>
              </div>
              <Switch
                checked={currentPrefs.weekendStudy}
                onCheckedChange={(checked) => updatePreference('weekendStudy', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Study Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  Get notifications for scheduled sessions
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
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Gear className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Session Rollover Rules
          </CardTitle>
          <CardDescription className="text-sm">
            Configure how incomplete sessions are handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Session Rollover</Label>
              <p className="text-xs text-muted-foreground">
                Automatically reschedule incomplete sessions
              </p>
            </div>
            <Switch
              checked={currentPrefs.rolloverRules.enabled}
              onCheckedChange={(checked) => updateRolloverRule('enabled', checked)}
            />
          </div>
          
          {currentPrefs.rolloverRules.enabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Maximum Rollover Days</Label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={currentPrefs.rolloverRules.maxDays}
                  onChange={(e) => updateRolloverRule('maxDays', parseInt(e.target.value))}
                />
              </div>

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
                    <SelectItem value="low">Low - Schedule when convenient</SelectItem>
                    <SelectItem value="medium">Medium - Balance with new content</SelectItem>
                    <SelectItem value="high">High - Prioritize over new sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Adjustment</Label>
                <Select 
                  value={currentPrefs.rolloverRules.timeAdjustment} 
                  onValueChange={(value) => updateRolloverRule('timeAdjustment', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shorter">Shorter (75% of original time)</SelectItem>
                    <SelectItem value="normal">Normal (original time)</SelectItem>
                    <SelectItem value="longer">Longer (125% of original time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-distribute Sessions</Label>
                  <p className="text-xs text-muted-foreground">
                    Spread rolled-over sessions across available days
                  </p>
                </div>
                <Switch
                  checked={currentPrefs.rolloverRules.autoDistribute}
                  onCheckedChange={(checked) => updateRolloverRule('autoDistribute', checked)}
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
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Current Configuration
          </CardTitle>
          <CardDescription className="text-sm">
            Overview of your active study preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                Study Hours
              </Badge>
              <p className="text-sm font-medium">
                {currentPrefs.startTime} - {currentPrefs.endTime}
              </p>
            </div>
            
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                Session Length
              </Badge>
              <p className="text-sm font-medium">
                {currentPrefs.maxSessionDuration} minutes
              </p>
            </div>
            
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                Break Duration
              </Badge>
              <p className="text-sm font-medium">
                {currentPrefs.breakDuration} minutes
              </p>
            </div>
            
            <div className="space-y-1">
              <Badge variant={currentPrefs.studyBursts ? "default" : "outline"} className="text-xs">
                Study Mode
              </Badge>
              <p className="text-sm font-medium">
                {currentPrefs.studyBursts ? 'Bursts' : 'Regular'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-2">AI Learning Assistant</h3>
              <p className="text-sm text-muted-foreground mb-3">
                The system learns from your study patterns and automatically optimizes your schedule for maximum effectiveness.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  Adaptive Scheduling
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Performance Tracking
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Smart Recommendations
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}