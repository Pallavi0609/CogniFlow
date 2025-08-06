'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Home, Target, Trophy, Calendar, Music, Heart, Focus, Menu, X, User } from 'lucide-react'

interface NavigationProps {
  currentView: string
  onNavigate: (view: string) => void
  isSignedIn: boolean
  onSignOut: () => void
}

export default function Navigation({ currentView, onNavigate, isSignedIn, onSignOut }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'recall', label: 'Recall', icon: Target },
    { id: 'leaderboard', label: 'Rankings', icon: Trophy },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'spotify', label: 'Music', icon: Music },
    { id: 'mental', label: 'Wellness', icon: Heart },
    { id: 'focus', label: 'Focus', icon: Focus },
  ]

  if (!isSignedIn) {
    return (
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CogniFlow
                </span>
                <div className="text-xs text-gray-500 -mt-1">Adaptive Learning</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => onNavigate('signin')} className="text-gray-600 hover:text-gray-900">
                Sign In
              </Button>
              <Button onClick={() => onNavigate('signup')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo - Fixed width */}
          <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CogniFlow
              </span>
              <div className="text-xs text-gray-500 -mt-1">Adaptive Learning</div>
            </div>
          </div>

          {/* Desktop Navigation - Constrained and scrollable */}
          <div className="hidden lg:flex flex-1 min-w-0 max-w-2xl mx-4">
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex space-x-1 min-w-max pb-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentView === item.id
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* User Menu & Mobile Toggle - Fixed width */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* User Info - Compact version */}
            <div className="hidden xl:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">John D.</div>
                <div className="text-xs text-gray-500">#3 • 2.4k pts</div>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Compact user for medium screens */}
            <div className="hidden lg:flex xl:hidden items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Sign Out Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSignOut}
              className="hidden md:flex border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 text-sm px-3"
            >
              Sign Out
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 px-3 py-3 mb-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">John Doe</div>
                <div className="text-sm text-gray-500">Rank #3 • 2,420 points</div>
              </div>
            </div>

            {/* Mobile Navigation Items - Horizontal scroll */}
            <div className="mb-4">
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentView === item.id
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        onNavigate(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`flex flex-col items-center space-y-1 min-w-[80px] h-16 flex-shrink-0 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Mobile Sign Out */}
            <Button 
              variant="outline" 
              onClick={onSignOut}
              className="w-full border-gray-300 text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Ensure smooth scrolling */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
      `}</style>
    </header>
  )
}
