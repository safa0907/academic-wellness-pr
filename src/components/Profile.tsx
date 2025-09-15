import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { User, Pencil, Check, X, GraduationCap, Target, Clock } from '@phosphor-icons/react'

interface ProfileProps {
  userProfile: any
  onUpdateProfile: (profile: any) => void
}

const AVAILABLE_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
  'Geography', 'Computer Science', 'Economics', 'Psychology', 'Art', 'Music',
  'Philosophy', 'Literature', 'Statistics', 'Calculus'
]

const STUDY_GOALS = [
  { id: 'exam', label: 'Prepare for exams', icon: '📚' },
  { id: 'improve', label: 'Improve grades', icon: '📈' },
  { id: 'understand', label: 'Better understanding', icon: '💡' },
  { id: 'confidence', label: 'Build confidence', icon: '💪' },
  { id: 'habits', label: 'Develop study habits', icon: '⏰' },
  { id: 'stress', label: 'Reduce study stress', icon: '😌' }
]

export function Profile({ userProfile, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)

  const handleSave = () => {
    onUpdateProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(userProfile)
    setIsEditing(false)
  }

  const handleSubjectToggle = (subject: string) => {
    setEditedProfile((prev: any) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s: string) => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleConfidenceChange = (subject: string, value: number[]) => {
    setEditedProfile((prev: any) => ({
      ...prev,
      confidence: { ...prev.confidence, [subject]: value[0] }
    }))
  }

  const handleGoalToggle = (goalId: string) => {
    setEditedProfile((prev: any) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g: string) => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const averageConfidence = userProfile?.subjects?.length ? 
    Math.round(userProfile.subjects.reduce((sum: number, subject: string) => 
      sum + (userProfile.confidence?.[subject] || 50), 0) / userProfile.subjects.length) : 50

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your learning preferences and track your progress
        </p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {(userProfile?.name || 'S').charAt(0).toUpperCase()}
                  </span>
                </div>
                {userProfile?.name || 'Student'}
              </CardTitle>
              <CardDescription>
                {userProfile?.subjects?.length || 0} subjects • {userProfile?.goals?.length || 0} goals
              </CardDescription>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="font-semibold">{averageConfidence}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="font-semibold">{userProfile?.studyTime || 2}h/day</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Stress Level</p>
                <p className="font-semibold">{userProfile?.stressLevel || 5}/10</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedProfile?.name || ''}
                onChange={(e) => setEditedProfile((prev: any) => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <p className="text-sm p-2 bg-muted/50 rounded">{userProfile?.name || 'Not set'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Daily Study Time</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Slider
                    value={[editedProfile?.studyTime || 2]}
                    onValueChange={(value) => setEditedProfile((prev: any) => ({ ...prev, studyTime: value[0] }))}
                    max={8}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">{editedProfile?.studyTime || 2} hours per day</p>
                </div>
              ) : (
                <p className="text-sm p-2 bg-muted/50 rounded">{userProfile?.studyTime || 2} hours per day</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Current Stress Level</Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Slider
                    value={[editedProfile?.stressLevel || 5]}
                    onValueChange={(value) => setEditedProfile((prev: any) => ({ ...prev, stressLevel: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">{editedProfile?.stressLevel || 5}/10</p>
                </div>
              ) : (
                <p className="text-sm p-2 bg-muted/50 rounded">{userProfile?.stressLevel || 5}/10</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Study Subjects</CardTitle>
          <CardDescription>
            Select the subjects you're currently studying
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AVAILABLE_SUBJECTS.map((subject) => (
                <Badge
                  key={subject}
                  variant={editedProfile?.subjects?.includes(subject) ? "default" : "outline"}
                  className="cursor-pointer p-3 text-center justify-center hover:scale-105 transition-transform"
                  onClick={() => handleSubjectToggle(subject)}
                >
                  {subject}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userProfile?.subjects?.map((subject: string, index: number) => (
                <Badge key={index} variant="default">
                  {subject}
                </Badge>
              )) || <p className="text-muted-foreground">No subjects selected</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confidence Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Confidence</CardTitle>
          <CardDescription>
            Rate your confidence level in each subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(isEditing ? editedProfile?.subjects : userProfile?.subjects)?.length > 0 ? (
            <div className="space-y-4">
              {(isEditing ? editedProfile?.subjects : userProfile?.subjects)?.map((subject: string) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{subject}</Label>
                    <span className="text-sm text-muted-foreground">
                      {(isEditing ? editedProfile : userProfile)?.confidence?.[subject] || 50}%
                    </span>
                  </div>
                  {isEditing ? (
                    <Slider
                      value={[editedProfile?.confidence?.[subject] || 50]}
                      onValueChange={(value) => handleConfidenceChange(subject, value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  ) : (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${userProfile?.confidence?.[subject] || 50}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Add subjects to set confidence levels
            </p>
          )}
        </CardContent>
      </Card>

      {/* Study Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Study Goals</CardTitle>
          <CardDescription>
            What do you want to achieve with your studies?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STUDY_GOALS.map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    editedProfile?.goals?.includes(goal.id) 
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
          ) : (
            <div className="space-y-2">
              {userProfile?.goals?.length > 0 ? (
                userProfile.goals.map((goalId: string, index: number) => {
                  const goal = STUDY_GOALS.find(g => g.id === goalId)
                  return goal ? (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <span className="text-xl">{goal.icon}</span>
                      <span>{goal.label}</span>
                    </div>
                  ) : null
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No study goals set
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Manage your study data and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">Export Study Data</h4>
                <p className="text-sm text-muted-foreground">Download your progress and quiz history</p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div>
                <h4 className="font-medium text-destructive">Reset All Data</h4>
                <p className="text-sm text-muted-foreground">This will permanently delete all your study data</p>
              </div>
              <Button variant="destructive" size="sm">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}