'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Focus, Camera, Play, Pause, Square, Eye, EyeOff, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

interface FocusSession {
  id: string
  startTime: string
  duration: number
  focusScore: number
  distractions: number
  lookAwayCount: number
  phonePickups: number
  status: 'active' | 'completed' | 'paused'
}

interface FocusMetric {
  timestamp: string
  focusLevel: number
  eyeContact: boolean
  distraction: string | null
}

export default function FocusTracker() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false)
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  const [focusMetrics, setFocusMetrics] = useState<FocusMetric[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [currentFocusScore, setCurrentFocusScore] = useState(85)
  const [recentSessions, setRecentSessions] = useState<FocusSession[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  // Mock recent sessions
  const mockSessions: FocusSession[] = [
    {
      id: '1',
      startTime: '2024-01-15T09:00:00Z',
      duration: 25 * 60, // 25 minutes
      focusScore: 87,
      distractions: 3,
      lookAwayCount: 12,
      phonePickups: 1,
      status: 'completed'
    },
    {
      id: '2',
      startTime: '2024-01-15T14:30:00Z',
      duration: 45 * 60, // 45 minutes
      focusScore: 92,
      distractions: 2,
      lookAwayCount: 8,
      phonePickups: 0,
      status: 'completed'
    },
    {
      id: '3',
      startTime: '2024-01-14T16:00:00Z',
      duration: 30 * 60, // 30 minutes
      focusScore: 78,
      distractions: 5,
      lookAwayCount: 18,
      phonePickups: 2,
      status: 'completed'
    }
  ]

  useEffect(() => {
    setRecentSessions(mockSessions)
  }, [])

  // Mock focus tracking simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && currentSession) {
      interval = setInterval(() => {
        // Simulate focus score fluctuation
        const newScore = Math.max(60, Math.min(100, currentFocusScore + (Math.random() - 0.5) * 10))
        setCurrentFocusScore(newScore)

        // Add mock metric
        const newMetric: FocusMetric = {
          timestamp: new Date().toISOString(),
          focusLevel: newScore,
          eyeContact: newScore > 75,
          distraction: newScore < 70 ? ['phone', 'looking away', 'noise'][Math.floor(Math.random() * 3)] : null
        }
        setFocusMetrics(prev => [...prev.slice(-50), newMetric])

        // Update session
        setCurrentSession(prev => prev ? {
          ...prev,
          duration: prev.duration + 1,
          focusScore: Math.round((prev.focusScore + newScore) / 2),
          distractions: prev.distractions + (newMetric.distraction ? 1 : 0),
          lookAwayCount: prev.lookAwayCount + (!newMetric.eyeContact ? 1 : 0)
        } : null)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, currentSession, currentFocusScore])

  const requestCameraPermission = async () => {
    try {
      // Mock camera permission request
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsPermissionGranted(true)
      
      // In a real implementation, you would:
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // if (videoRef.current) {
      //   videoRef.current.srcObject = stream
      // }
    } catch (error) {
      console.error('Camera permission denied:', error)
    }
  }

  const startSession = () => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      duration: 0,
      focusScore: 85,
      distractions: 0,
      lookAwayCount: 0,
      phonePickups: 0,
      status: 'active'
    }
    setCurrentSession(newSession)
    setIsTracking(true)
    setFocusMetrics([])
  }

  const pauseSession = () => {
    setIsTracking(false)
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: 'paused' })
    }
  }

  const resumeSession = () => {
    setIsTracking(true)
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: 'active' })
    }
  }

  const endSession = () => {
    if (currentSession) {
      const completedSession = { ...currentSession, status: 'completed' as const }
      setRecentSessions(prev => [completedSession, ...prev])
      setCurrentSession(null)
    }
    setIsTracking(false)
    setFocusMetrics([])
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFocusScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFocusScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (!isPermissionGranted) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Focus className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Focus Tracker</h1>
          </div>
          <p className="text-gray-600">AI-powered attention monitoring to help you stay focused</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-10 w-10 text-white" />
            </div>
            <CardTitle>Camera Permission Required</CardTitle>
            <CardDescription>
              We need access to your camera to track your attention and focus levels during study sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Privacy & Security:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Video processing happens locally on your device</li>
                  <li>• No video data is stored or transmitted</li>
                  <li>• Only focus metrics and scores are saved</li>
                  <li>• You can disable tracking at any time</li>
                </ul>
              </div>
              <Button onClick={requestCameraPermission} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Grant Camera Access
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Click "Allow" when your browser asks for camera permission
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Focus className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Focus Tracker</h1>
        </div>
        <p className="text-gray-600">AI-powered attention monitoring to maximize your study effectiveness</p>
      </div>

      {/* Current Session */}
      {currentSession ? (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Focus Session</span>
              <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                {currentSession.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Session Stats */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatDuration(currentSession.duration)}
                    </div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getFocusScoreColor(currentFocusScore)}`}>
                      {Math.round(currentFocusScore)}%
                    </div>
                    <div className="text-sm text-gray-600">Focus Score</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Focus Level:</span>
                    <span className="font-medium">{Math.round(currentFocusScore)}%</span>
                  </div>
                  <Progress value={currentFocusScore} className="w-full" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-red-600">{currentSession.distractions}</div>
                    <div className="text-gray-600">Distractions</div>
                  </div>
                  <div>
                    <div className="font-bold text-yellow-600">{currentSession.lookAwayCount}</div>
                    <div className="text-gray-600">Look Aways</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{currentSession.phonePickups}</div>
                    <div className="text-gray-600">Phone Checks</div>
                  </div>
                </div>
              </div>

              {/* Camera Feed Mock */}
              <div className="space-y-4">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    style={{ display: 'none' }}
                  />
                  <div className="text-center text-white">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Camera Feed</p>
                    <p className="text-xs opacity-50">(Mock for demo)</p>
                  </div>
                  
                  {/* Focus indicator overlay */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    currentFocusScore >= 85 
                      ? 'bg-green-500 text-white' 
                      : currentFocusScore >= 70 
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {currentFocusScore >= 85 ? (
                      <><Eye className="h-3 w-3 inline mr-1" />Focused</>
                    ) : currentFocusScore >= 70 ? (
                      <><EyeOff className="h-3 w-3 inline mr-1" />Distracted</>
                    ) : (
                      <><AlertTriangle className="h-3 w-3 inline mr-1" />Unfocused</>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {currentSession.status === 'active' ? (
                    <Button onClick={pauseSession} variant="outline" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeSession} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={endSession} variant="destructive" className="flex-1">
                    <Square className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Start Session */
        <Card>
          <CardHeader>
            <CardTitle>Start Focus Session</CardTitle>
            <CardDescription>Begin tracking your attention and focus levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={startSession} className="h-20 flex flex-col items-center justify-center">
                <Play className="h-6 w-6 mb-2" />
                <span>25 min</span>
                <span className="text-xs opacity-75">Pomodoro</span>
              </Button>
              <Button onClick={startSession} variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Play className="h-6 w-6 mb-2" />
                <span>45 min</span>
                <span className="text-xs opacity-75">Deep Focus</span>
              </Button>
              <Button onClick={startSession} variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Play className="h-6 w-6 mb-2" />
                <span>15 min</span>
                <span className="text-xs opacity-75">Quick Study</span>
              </Button>
              <Button onClick={startSession} variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Play className="h-6 w-6 mb-2" />
                <span>Custom</span>
                <span className="text-xs opacity-75">Set Duration</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Your focus tracking history and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">
                        {formatDuration(session.duration)} session
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(session.startTime).toLocaleDateString()} at{' '}
                        {new Date(session.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <Badge className={getFocusScoreBg(session.focusScore)}>
                    {session.focusScore}% Focus
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>{session.distractions} distractions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <EyeOff className="h-4 w-4 text-yellow-500" />
                    <span>{session.lookAwayCount} look aways</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📱</span>
                    <span>{session.phonePickups} phone checks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(recentSessions.reduce((acc, s) => acc + s.focusScore, 0) / recentSessions.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Focus Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(recentSessions.reduce((acc, s) => acc + s.duration, 0) / 60)}
            </div>
            <div className="text-sm text-gray-600">Total Minutes Tracked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {recentSessions.length}
            </div>
            <div className="text-sm text-gray-600">Sessions This Week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
