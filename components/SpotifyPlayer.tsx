'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Heart, Clock, Headphones } from 'lucide-react'

interface Playlist {
  id: string
  name: string
  description: string
  trackCount: number
  duration: string
  image: string
  focusType: 'deep' | 'light' | 'creative' | 'review'
}

interface Track {
  id: string
  name: string
  artist: string
  duration: string
  isPlaying: boolean
}

export default function SpotifyPlayer() {
  const [isConnected, setIsConnected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState(0)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [studySession, setStudySession] = useState({ active: false, duration: 0, target: 25 })

  // Mock playlists
  const focusPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Deep Focus',
      description: 'Instrumental tracks for intense concentration',
      trackCount: 50,
      duration: '3h 20m',
      image: '/placeholder.svg?height=200&width=200&text=Deep+Focus',
      focusType: 'deep'
    },
    {
      id: '2',
      name: 'Light Study',
      description: 'Gentle background music for reading',
      trackCount: 35,
      duration: '2h 15m',
      image: '/placeholder.svg?height=200&width=200&text=Light+Study',
      focusType: 'light'
    },
    {
      id: '3',
      name: 'Creative Flow',
      description: 'Inspiring beats for creative work',
      trackCount: 42,
      duration: '2h 45m',
      image: '/placeholder.svg?height=200&width=200&text=Creative+Flow',
      focusType: 'creative'
    },
    {
      id: '4',
      name: 'Review & Recall',
      description: 'Calm music for memory consolidation',
      trackCount: 28,
      duration: '1h 50m',
      image: '/placeholder.svg?height=200&width=200&text=Review+Recall',
      focusType: 'review'
    }
  ]

  const mockTrack: Track = {
    id: '1',
    name: 'Peaceful Piano',
    artist: 'Focus Sounds',
    duration: '4:32',
    isPlaying: false
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (studySession.active) {
      interval = setInterval(() => {
        setStudySession(prev => ({
          ...prev,
          duration: prev.duration + 1
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [studySession.active])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev + 1) % 100)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const connectSpotify = () => {
    // Mock OAuth flow
    setIsConnected(true)
    setCurrentTrack(mockTrack)
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (currentTrack) {
      setCurrentTrack({ ...currentTrack, isPlaying: !isPlaying })
    }
  }

  const startStudySession = (minutes: number) => {
    setStudySession({
      active: true,
      duration: 0,
      target: minutes * 60
    })
    if (!isPlaying) {
      togglePlayback()
    }
  }

  const endStudySession = () => {
    setStudySession({
      active: false,
      duration: 0,
      target: 25 * 60
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFocusTypeColor = (type: string) => {
    switch (type) {
      case 'deep': return 'bg-blue-100 text-blue-800'
      case 'light': return 'bg-green-100 text-green-800'
      case 'creative': return 'bg-purple-100 text-purple-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Focus Music</h1>
          </div>
          <p className="text-gray-600">Connect your Spotify account to access curated focus playlists</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="h-10 w-10 text-white" />
            </div>
            <CardTitle>Connect to Spotify</CardTitle>
            <CardDescription>
              Access your playlists and discover focus music curated for studying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Curated focus playlists for different study modes</li>
                  <li>• Study session tracking with music</li>
                  <li>• Personalized recommendations based on your habits</li>
                  <li>• Seamless integration with your learning schedule</li>
                </ul>
              </div>
              <Button onClick={connectSpotify} className="w-full bg-green-600 hover:bg-green-700">
                <Music className="h-4 w-4 mr-2" />
                Connect Spotify Account
              </Button>
              <p className="text-xs text-gray-500 text-center">
                We'll redirect you to Spotify to authorize access to your account
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
          <Music className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Focus Music</h1>
          <Badge variant="default" className="bg-green-600">Connected</Badge>
        </div>
        <p className="text-gray-600">Enhance your focus with curated study playlists</p>
      </div>

      {/* Study Session Timer */}
      {studySession.active && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Study Session Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(studySession.duration)}
                </div>
                <div className="text-sm text-gray-600">
                  Target: {formatTime(studySession.target)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Pause Session
                </Button>
                <Button onClick={endStudySession} size="sm">
                  End Session
                </Button>
              </div>
            </div>
            <Progress 
              value={(studySession.duration / studySession.target) * 100} 
              className="mt-4" 
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Player */}
        <Card>
          <CardHeader>
            <CardTitle>Now Playing</CardTitle>
          </CardHeader>
          <CardContent>
            {currentTrack ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentTrack.name}</h3>
                    <p className="text-gray-600">{currentTrack.artist}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(Math.floor(progress * 2.72))}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={togglePlayback} size="sm" className="w-12 h-12 rounded-full">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-8">{volume[0]}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a playlist to start listening</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Session Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Sessions</CardTitle>
            <CardDescription>Start a timed study session with music</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => startStudySession(25)} 
                variant="outline"
                disabled={studySession.active}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>25 min</span>
                <span className="text-xs text-gray-500">Pomodoro</span>
              </Button>
              <Button 
                onClick={() => startStudySession(45)} 
                variant="outline"
                disabled={studySession.active}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>45 min</span>
                <span className="text-xs text-gray-500">Deep Focus</span>
              </Button>
              <Button 
                onClick={() => startStudySession(15)} 
                variant="outline"
                disabled={studySession.active}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>15 min</span>
                <span className="text-xs text-gray-500">Quick Review</span>
              </Button>
              <Button 
                onClick={() => startStudySession(90)} 
                variant="outline"
                disabled={studySession.active}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>90 min</span>
                <span className="text-xs text-gray-500">Extended</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Focus Playlists */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Playlists</CardTitle>
          <CardDescription>Curated playlists for different types of study sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {focusPlaylists.map((playlist) => (
              <Card 
                key={playlist.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedPlaylist?.id === playlist.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-3 flex items-center justify-center">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{playlist.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{playlist.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{playlist.trackCount} tracks</span>
                    <span>{playlist.duration}</span>
                  </div>
                  <Badge className={`${getFocusTypeColor(playlist.focusType)} mt-2`}>
                    {playlist.focusType}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">2h 45m</div>
            <div className="text-sm text-gray-600">Music Study Time Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Focus Sessions This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">Deep Focus</div>
            <div className="text-sm text-gray-600">Most Used Playlist</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
