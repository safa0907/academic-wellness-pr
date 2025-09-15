import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { Onboarding } from '@/components/Onboarding'
import { Navigation } from '@/components/Navigation'
import { Dashboard } from '@/components/Dashboard'
import { StudyPlanner } from '@/components/StudyPlanner'
import { Quiz } from '@/components/Quiz'
import { Wellness } from '@/components/Wellness'
import { ProgressAnalytics } from '@/components/ProgressAnalytics'
import { Profile } from '@/components/Profile'

function App() {
  const [userProfile, setUserProfile] = useKV<any>('user-profile', null)
  const [currentView, setCurrentView] = useState('dashboard')

  const handleOnboardingComplete = (profile: any) => {
    setUserProfile(profile)
  }

  const handleUpdateProfile = (profile: any) => {
    setUserProfile(profile)
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  // Show onboarding if no user profile exists
  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} onNavigate={handleNavigate} />
      case 'planner':
        return <StudyPlanner userProfile={userProfile} />
      case 'quiz':
        return <Quiz userProfile={userProfile} />
      case 'wellness':
        return <Wellness userProfile={userProfile} />
      case 'progress':
        return <ProgressAnalytics userProfile={userProfile} />
      case 'profile':
        return <Profile userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
      default:
        return <Dashboard userProfile={userProfile} onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView}
        onNavigate={handleNavigate}
        userProfile={userProfile}
      />
      
      <main className="min-h-[calc(100vh-80px)]">
        {renderCurrentView()}
      </main>

      <Toaster />
    </div>
  )
}

export default App