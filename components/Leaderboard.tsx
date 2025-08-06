'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Medal, Award, Users, Globe, TrendingUp } from 'lucide-react'

interface LeaderboardUser {
  id: string
  displayName: string
  avatar?: string
  totalPoints: number
  studyMinutes: number
  quizCorrect: number
  streakDays: number
  lastActivity: string
  rank: number
}

export default function Leaderboard() {
  const [scope, setScope] = useState<'global' | 'friends'>('global')
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null)

  // Mock data for demo
  const mockGlobalUsers: LeaderboardUser[] = [
    {
      id: '1',
      displayName: 'Alex Chen',
      avatar: '/diverse-student-studying.png',
      totalPoints: 2850,
      studyMinutes: 420,
      quizCorrect: 156,
      streakDays: 12,
      lastActivity: '2024-01-15T10:30:00Z',
      rank: 1
    },
    {
      id: '2',
      displayName: 'Sarah Johnson',
      avatar: '/diverse-students-studying.png',
      totalPoints: 2640,
      studyMinutes: 380,
      quizCorrect: 142,
      streakDays: 8,
      lastActivity: '2024-01-15T09:15:00Z',
      rank: 2
    },
    {
      id: '3',
      displayName: 'You',
      avatar: '/current-user-profile.png',
      totalPoints: 2420,
      studyMinutes: 350,
      quizCorrect: 128,
      streakDays: 7,
      lastActivity: '2024-01-15T11:00:00Z',
      rank: 3
    },
    {
      id: '4',
      displayName: 'Mike Rodriguez',
      avatar: '/diverse-students-studying.png',
      totalPoints: 2180,
      studyMinutes: 310,
      quizCorrect: 118,
      streakDays: 5,
      lastActivity: '2024-01-15T08:45:00Z',
      rank: 4
    },
    {
      id: '5',
      displayName: 'Emma Wilson',
      avatar: '/diverse-group-studying.png',
      totalPoints: 1950,
      studyMinutes: 280,
      quizCorrect: 105,
      streakDays: 4,
      lastActivity: '2024-01-15T07:30:00Z',
      rank: 5
    },
    {
      id: '6',
      displayName: 'David Kim',
      avatar: '/student5-artwork.png',
      totalPoints: 1720,
      studyMinutes: 245,
      quizCorrect: 92,
      streakDays: 3,
      lastActivity: '2024-01-14T22:15:00Z',
      rank: 6
    },
    {
      id: '7',
      displayName: 'Lisa Zhang',
      avatar: '/student6-artwork.png',
      totalPoints: 1580,
      studyMinutes: 220,
      quizCorrect: 85,
      streakDays: 6,
      lastActivity: '2024-01-14T20:30:00Z',
      rank: 7
    },
    {
      id: '8',
      displayName: 'James Brown',
      avatar: '/student7-artwork.png',
      totalPoints: 1420,
      studyMinutes: 195,
      quizCorrect: 78,
      streakDays: 2,
      lastActivity: '2024-01-14T19:45:00Z',
      rank: 8
    }
  ]

  const mockFriendsUsers: LeaderboardUser[] = [
    {
      id: '3',
      displayName: 'You',
      avatar: '/current-user-profile.png',
      totalPoints: 2420,
      studyMinutes: 350,
      quizCorrect: 128,
      streakDays: 7,
      lastActivity: '2024-01-15T11:00:00Z',
      rank: 1
    },
    {
      id: '9',
      displayName: 'Best Friend',
      avatar: '/diverse-group-friends.png',
      totalPoints: 2180,
      studyMinutes: 310,
      quizCorrect: 118,
      streakDays: 5,
      lastActivity: '2024-01-15T08:45:00Z',
      rank: 2
    },
    {
      id: '10',
      displayName: 'Study Buddy',
      avatar: '/two-friends-laughing.png',
      totalPoints: 1850,
      studyMinutes: 265,
      quizCorrect: 98,
      streakDays: 4,
      lastActivity: '2024-01-14T21:30:00Z',
      rank: 3
    }
  ]

  useEffect(() => {
    const data = scope === 'global' ? mockGlobalUsers : mockFriendsUsers
    setUsers(data)
    setCurrentUser(data.find(u => u.displayName === 'You') || null)
  }, [scope])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const calculatePoints = (user: LeaderboardUser) => {
    const studyPoints = user.studyMinutes * 1
    const quizPoints = user.quizCorrect * 10
    const streakBonus = user.streakDays * 5
    return { studyPoints, quizPoints, streakBonus }
  }

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600">Compete with friends and track your progress</p>
      </div>

      {/* Scope Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={scope === 'global' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setScope('global')}
            className="flex items-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>Global</span>
          </Button>
          <Button
            variant={scope === 'friends' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setScope('friends')}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Friends</span>
          </Button>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Your Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">#{currentUser.rank}</div>
                <div className="text-sm text-gray-600">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{currentUser.totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{currentUser.studyMinutes}</div>
                <div className="text-sm text-gray-600">Study Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{currentUser.streakDays}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
            
            {/* Points Breakdown */}
            <div className="mt-4 p-3 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Points Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Study Time ({currentUser.studyMinutes} min × 1)</span>
                  <span className="font-medium">{calculatePoints(currentUser).studyPoints} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Quiz Correct ({currentUser.quizCorrect} × 10)</span>
                  <span className="font-medium">{calculatePoints(currentUser).quizPoints} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak Bonus ({currentUser.streakDays} days × 5)</span>
                  <span className="font-medium">{calculatePoints(currentUser).streakBonus} pts</span>
                </div>
                <div className="border-t pt-1 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{currentUser.totalPoints} pts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{scope === 'global' ? 'Global' : 'Friends'} Leaderboard</span>
            <Badge variant="outline">{users.length} users</Badge>
          </CardTitle>
          <CardDescription>
            Points = Study Minutes + (Quiz Correct × 10) + (Streak Days × 5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                  user.displayName === 'You' 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
                    {user.displayName === 'You' && (
                      <Badge variant="secondary">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{user.studyMinutes} min studied</span>
                    <span>{user.quizCorrect} correct</span>
                    <span>{user.streakDays} day streak</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {user.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                  <div className="text-xs text-gray-500">
                    {formatLastActivity(user.lastActivity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-medium text-sm">Top 3</div>
              <div className="text-xs text-gray-600">Global Rank</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium text-sm">Week Warrior</div>
              <div className="text-xs text-gray-600">7 Day Streak</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Medal className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="font-medium text-sm">Quiz Master</div>
              <div className="text-xs text-gray-600">100+ Correct</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="font-medium text-sm">Study Hero</div>
              <div className="text-xs text-gray-600">300+ Minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
