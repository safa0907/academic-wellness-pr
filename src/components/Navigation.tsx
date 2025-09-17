import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { House, Calendar, Brain, Heart, ChartBar, User, ClockCounterClockwise } from '@phosphor-icons/react'
import logoSvg from '@/assets/images/GradeUp.svg'

interface NavigationProps {
  currentView: string
  onNavigate: (view: string) => void
  userProfile: any
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'planner', label: 'Grade UP', icon: Calendar },
  { id: 'history', label: 'History', icon: ClockCounterClockwise },
  { id: 'quiz', label: 'Practice', icon: Brain },
  { id: 'wellness', label: 'Wellness', icon: Heart },
  { id: 'progress', label: 'Progress', icon: ChartBar },
  { id: 'profile', label: 'Profile', icon: User }
]

export function Navigation({ currentView, onNavigate, userProfile }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border px-3 sm:px-4 py-2 sm:py-3">
      <div className="max-w-7xl mx-auto">
        {/* Top row: Logo and User on mobile, all items on desktop */}
        <div className="flex items-center justify-between mb-2 sm:mb-0">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={logoSvg} 
              alt="GradeUp Logo" 
              className="h-8 sm:h-12 w-auto"
            />
            <div className="hidden xs:block">
              <h1 className="font-bold text-sm sm:text-lg">GradeUp</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Learning</p>
            </div>
          </div>

          {/* User Info - Always visible */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{userProfile?.name || 'Student'}</p>
              <p className="text-xs text-muted-foreground">
                {userProfile?.subjects?.length || 0} subjects
              </p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-semibold text-white">
                {(userProfile?.name || 'S').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items - Always horizontal scroll on mobile */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 sm:justify-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-fit px-2 sm:px-3"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{item.label}</span>
                {item.id === 'planner' && (
                  <Badge variant="secondary" className="ml-0.5 sm:ml-1 px-1 sm:px-1.5 py-0.5 text-xs">
                    AI
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}