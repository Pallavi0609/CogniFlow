'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Users, Target, Zap, ArrowRight, CheckCircle, Star, Trophy, Clock, Calendar, Music, Heart, Focus, TrendingUp } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ActiveRecall from '@/components/ActiveRecall'
import Leaderboard from '@/components/Leaderboard'
import DailyPlanner from '@/components/DailyPlanner'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import WellnessTracker from '@/components/WellnessTracker'
import FocusTracker from '@/components/FocusTracker'

export default function CogniFlowApp() {
const [currentView, setCurrentView] = useState('landing')
const [isSignedIn, setIsSignedIn] = useState(false)

const handleGetStarted = () => {
  setIsSignedIn(true)
  setCurrentView('dashboard')
}

const handleSignOut = () => {
  setIsSignedIn(false)
  setCurrentView('landing')
}

const handleNavigate = (view: string) => {
  if (view === 'signup' || view === 'signin') {
    handleGetStarted()
  } else {
    setCurrentView(view)
  }
}

// Landing Page
if (!isSignedIn && currentView === 'landing') {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        isSignedIn={isSignedIn}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            AI-Powered Learning for Neurodiverse Students
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Every Mind
            <span className="text-blue-600"> Flows </span>
            Differently
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Adaptive learning coach designed for ADHD, dyslexia, and anxiety. 
            Personalized questions, spaced repetition, and gamified progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="flex items-center space-x-2">
              <span>Start Learning Free</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for How You Learn Best
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every feature is designed with neurodiversity in mind, 
            helping you learn more effectively and enjoyably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Active Recall</CardTitle>
              <CardDescription>
                AI generates personalized questions from your study material. 
                Spaced repetition ensures long-term retention.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Social Learning</CardTitle>
              <CardDescription>
                Compete with friends, share achievements, and stay motivated 
                with our gamified leaderboard system.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Adaptive AI</CardTitle>
              <CardDescription>
                Smart algorithms adjust difficulty and pacing based on your 
                learning patterns and preferences.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Focus Tools</CardTitle>
              <CardDescription>
                Distraction blocking, focus music integration, and 
                attention tracking to maximize study sessions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Smart Planning</CardTitle>
              <CardDescription>
                AI-powered daily planner that adapts to your energy levels 
                and optimal learning times.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Detailed analytics on your learning journey with 
                mood tracking and mental health insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proven Results for Neurodiverse Learners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Improvement in retention</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-gray-600">Faster learning speed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-gray-600">Student satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">10k+</div>
              <div className="text-gray-600">Active learners</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of neurodiverse students already learning better with CogniFlow
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleGetStarted}
            className="flex items-center space-x-2 mx-auto"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">CogniFlow</span>
          </div>
          <p className="text-gray-600 text-sm">
            Built with ❤️ for neurodiverse learners
          </p>
        </div>
      </footer>
    </div>
  )
}

// Dashboard
if (currentView === 'dashboard') {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        isSignedIn={isSignedIn}
        onSignOut={handleSignOut}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">7</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,420</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Questions Due</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">#3</div>
              <div className="text-sm text-gray-600">Global Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigate('recall')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Active Recall</span>
              </CardTitle>
              <CardDescription>Practice with AI-generated questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions answered today:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accuracy rate:</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
                <Button className="w-full mt-4">Continue Practice</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigate('leaderboard')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Leaderboard</span>
              </CardTitle>
              <CardDescription>See how you rank against others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your rank:</span>
                  <span className="font-medium">#3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total points:</span>
                  <span className="font-medium text-blue-600">2,420</span>
                </div>
                <Button className="w-full mt-4">View Rankings</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigate('planner')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Daily Planner</span>
              </CardTitle>
              <CardDescription>AI-powered study scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks today:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">2/4</span>
                </div>
                <Button className="w-full mt-4">View Schedule</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigate('spotify')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Music className="h-5 w-5 text-purple-600" />
                <span>Focus Music</span>
              </CardTitle>
              <CardDescription>Spotify integration for focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current playlist:</span>
                  <span className="font-medium">Deep Focus</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Study time:</span>
                  <span className="font-medium text-purple-600">45 min</span>
                </div>
                <Button className="w-full mt-4">Start Session</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigate('mental')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Wellness Tracker</span>
              </CardTitle>
              <CardDescription>Mental health & mood tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's mood:</span>
                  <span className="font-medium">😊 Good</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Anxiety level:</span>
                  <span className="font-medium text-green-600">Low</span>
                </div>
                <Button className="w-full mt-4">Check In</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigate('focus')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Focus className="h-5 w-5 text-indigo-600" />
                <span>Focus Tracker</span>
              </CardTitle>
              <CardDescription>Webcam-based attention monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Focus score:</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sessions today:</span>
                  <span className="font-medium text-indigo-600">3</span>
                </div>
                <Button className="w-full mt-4">Start Tracking</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Completed Biology quiz - 9/10 correct</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Earned "Week Warrior" achievement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Generated 5 new recall questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Moved up 2 ranks in leaderboard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Answer 15 recall questions</span>
                  <Badge variant="default">12/15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study for 60 minutes</span>
                  <Badge variant="default">45/60</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintain study streak</span>
                  <Badge variant="default">✓ Done</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complete mood check-in</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Feature Views
const renderFeatureView = () => {
  const baseLayout = (children: React.ReactNode) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        isSignedIn={isSignedIn}
        onSignOut={handleSignOut}
      />
      {children}
    </div>
  )

  switch (currentView) {
    case 'recall':
      return baseLayout(<ActiveRecall />)
    case 'leaderboard':
      return baseLayout(<Leaderboard />)
    case 'planner':
      return baseLayout(<DailyPlanner />)
    case 'spotify':
      return baseLayout(<SpotifyPlayer />)
    case 'mental':
      return baseLayout(<WellnessTracker />)
    case 'focus':
      return baseLayout(<FocusTracker />)
    default:
      return null
  }
}

return renderFeatureView()
}
