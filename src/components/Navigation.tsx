import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { House, Calendar, Brain, Heart, ChartBar, User } from '@phosphor-icons/react'
import logoSvg from '@/assets/images/GradeUp.svg'

interface NavigationProps {
  currentView: string
  onNavigate: (view: string) => void
  userProfile: any
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'planner', label: 'Grade UP', icon: Calendar },
  { id: 'quiz', label: 'Practice', icon: Brain },
  { id: 'wellness', label: 'Wellness', icon: Heart },
  { id: 'progress', label: 'Progress', icon: ChartBar },
  { id: 'profile', label: 'Profile', icon: User }
]

export function Navigation({ currentView, onNavigate, userProfile }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={logoSvg} 
            alt="GradeUp Logo" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="font-bold text-lg">GradeUp</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.id === 'planner' && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    AI
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{userProfile?.name || 'Student'}</p>
            <p className="text-xs text-muted-foreground">
              {userProfile?.subjects?.length || 0} subjects
            </p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {(userProfile?.name || 'S').charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}