import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Brain, 
  Gear, 
  ArrowRight, 
  CheckCircle,
  Shield,
  User
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SchedulingPreferencesProps {
  userProfile: any
}

interface RolloverRule {
  enabled: boolean
  maxDays: number
  priority: 'high' | 'medium' | 'low'
  timeAdjustment: 'early' | 'normal' | 'late'
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

export function SchedulingPreferences({ userProfile }: SchedulingPreferencesProps) {
  const [preferences, setPreferences] = useKV<SchedulingPreference>('scheduling-preferences', defaultPreferences)
  const [hasChanges, setHasChanges] = useState(false)

  // Ensure preferences is never undefined
  const currentPrefs = preferences || defaultPreferences

  const updatePreference = (key: keyof SchedulingPreference, value: any) => {
    setPreferences((current) => {
      const currentPrefs = current || defaultPreferences
      return { ...currentPrefs, [key]: value }
    })
    setHasChanges(true)
  }

  const updateRolloverRule = (key: keyof RolloverRule, value: any) => {
    setPreferences((current) => {
      const currentPrefs = current || defaultPreferences
      return {
        ...currentPrefs,
        rolloverRules: {
          ...currentPrefs.rolloverRules,
          [key]: value
        }
      }
    })
    setHasChanges(true)
  }

  const resetToDefaults = () => {
    setPreferences(defaultPreferences)
    setHasChanges(true)
    toast.success('Preferences reset to defaults')
  }

  const savePreferences = () => {
    // Validate preferences
    if (currentPrefs.startTime >= currentPrefs.endTime) {
      toast.error('Start time must be before end time')
      return
    }

    if (currentPrefs.breakDuration < 5 || currentPrefs.breakDuration > 60) {
      toast.error('Break duration must be between 5 and 60 minutes')
      return
    }

    if (currentPrefs.maxSessionDuration < 15 || currentPrefs.maxSessionDuration > 180) {
      toast.error('Max session duration must be between 15 and 180 minutes')
      return
    }

    setHasChanges(false)
    toast.success('Scheduling preferences saved successfully', {
      description: 'Your AI study planner will now use these settings'
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
          <Gear className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="break-words">Scheduling Preferences</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Customize how your AI study planner creates schedules and handles incomplete sessions
        </p>
      </div>

      {/* Save Controls */}
      {hasChanges && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Unsaved Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    You have unsaved preference changes
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={resetToDefaults} className="flex-1 sm:flex-none">
                  Reset
                </Button>
                <Button size="sm" onClick={savePreferences} className="flex-1 sm:flex-none">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Time Preferences */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Study Time Preferences
          </CardTitle>
          <CardDescription className="text-sm">
            Set your preferred study hours and session structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-time">Study Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={currentPrefs.startTime}
                onChange={(e) => updatePreference('startTime', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">Study End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={currentPrefs.endTime}
                onChange={(e) => updatePreference('endTime', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="break-duration">Break Duration (minutes)</Label>
              <Input
                id="break-duration"
                type="number"
                min="5"
                max="60"
                value={currentPrefs.breakDuration}
                onChange={(e) => updatePreference('breakDuration', parseInt(e.target.value) || 15)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-session">Max Session Duration (minutes)</Label>
              <Input
                id="max-session"
                type="number"
                min="15"
                max="180"
                value={currentPrefs.maxSessionDuration}
                onChange={(e) => updatePreference('maxSessionDuration', parseInt(e.target.value) || 90)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Difficulty Ordering</Label>
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

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 mr-4">
                <Label>Study Bursts</Label>
                <p className="text-sm text-muted-foreground">
                  Short, intense study sessions with longer breaks
                </p>
              </div>
              <Switch
                checked={currentPrefs.studyBursts}
                onCheckedChange={(checked) => updatePreference('studyBursts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 mr-4">
                <Label>Weekend Study</Label>
                <p className="text-sm text-muted-foreground">
                  Include weekends in study planning
                </p>
              </div>
              <Switch
                checked={currentPrefs.weekendStudy}
                onCheckedChange={(checked) => updatePreference('weekendStudy', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 mr-4">
                <Label>Study Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded when study sessions begin
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

      {/* Rollover Rules */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ArrowRight className="h-5 w-5 text-accent" />
            Session Rollover Rules
          </CardTitle>
          <CardDescription className="text-sm">
            Control how incomplete study sessions are handled and rescheduled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label>Enable Automatic Rollover</Label>
              <p className="text-sm text-muted-foreground">
                Automatically move incomplete sessions to the next available day
              </p>
            </div>
            <Switch
              checked={currentPrefs.rolloverRules.enabled}
              onCheckedChange={(checked) => updateRolloverRule('enabled', checked)}
            />
          </div>

          {currentPrefs.rolloverRules.enabled && (
            <div className="space-y-4 sm:space-y-6 pl-4 border-l-2 border-accent/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-rollover-days">Maximum Rollover Days</Label>
                  <Input
                    id="max-rollover-days"
                    type="number"
                    min="1"
                    max="14"
                    value={currentPrefs.rolloverRules.maxDays}
                    onChange={(e) => updateRolloverRule('maxDays', parseInt(e.target.value) || 3)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Sessions older than this will be marked as expired
                  </p>
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
                      <SelectItem value="high">High (schedule first)</SelectItem>
                      <SelectItem value="medium">Medium (normal order)</SelectItem>
                      <SelectItem value="low">Low (schedule last)</SelectItem>
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
                      <SelectItem value="early">Early (morning preference)</SelectItem>
                      <SelectItem value="normal">Normal (original times)</SelectItem>
                      <SelectItem value="late">Late (afternoon preference)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1 mr-4">
                  <Label>Auto-Distribute</Label>
                  <p className="text-sm text-muted-foreground">
                    Spread rolled-over sessions across multiple days if needed
                  </p>
                </div>
                <Switch
                  checked={currentPrefs.rolloverRules.autoDistribute}
                  onCheckedChange={(checked) => updateRolloverRule('autoDistribute', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1 mr-4">
                  <Label>Skip Weekends</Label>
                  <p className="text-sm text-muted-foreground">
                    Don't schedule rolled-over sessions on weekends
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

      {/* Current Settings Summary */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-5 w-5 text-secondary" />
            Current Settings Summary
          </CardTitle>
          <CardDescription className="text-sm">
            Overview of your active scheduling preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Study Hours</p>
              <Badge variant="outline" className="text-xs">
                {currentPrefs.startTime} - {currentPrefs.endTime}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Session Length</p>
              <Badge variant="outline" className="text-xs">
                Max {currentPrefs.maxSessionDuration}min
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Break Duration</p>
              <Badge variant="outline" className="text-xs">
                {currentPrefs.breakDuration}min
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Rollover</p>
              <Badge variant={currentPrefs.rolloverRules.enabled ? "default" : "secondary"} className="text-xs">
                {currentPrefs.rolloverRules.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Difficulty</p>
              <Badge variant="outline" className="text-xs">
                {currentPrefs.preferredDifficulty.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Weekend Study</p>
              <Badge variant={currentPrefs.weekendStudy ? "default" : "secondary"} className="text-xs">
                {currentPrefs.weekendStudy ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Notifications</p>
              <Badge variant={currentPrefs.notifications ? "default" : "secondary"} className="text-xs">
                {currentPrefs.notifications ? 'On' : 'Off'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Study Mode</p>
              <Badge variant="outline" className="text-xs">
                {currentPrefs.studyBursts ? 'Bursts' : 'Regular'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Integration Notice */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">AI-Enhanced Scheduling</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your preferences are used by the Grade UP AI to create personalized study plans. 
                The system learns from your completion patterns and adjusts scheduling over time.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">Personalized</Badge>
                <Badge variant="secondary" className="text-xs">Adaptive</Badge>
                <Badge variant="secondary" className="text-xs">Smart Rollover</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}