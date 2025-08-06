'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Heart, Brain, Smile, Frown, Meh, TrendingUp, Calendar, Target, AlertTriangle } from 'lucide-react'

interface MoodEntry {
  id: string
  date: string
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy'
  anxiety: number // 1-10 scale
  energy: number // 1-10 scale
  focus: number // 1-10 scale
  notes: string
  triggers?: string[]
}

interface WellnessInsight {
  type: 'positive' | 'warning' | 'info'
  title: string
  description: string
  suggestion: string
}

export default function WellnessTracker() {
  const [currentMood, setCurrentMood] = useState<MoodEntry['mood']>('neutral')
  const [currentAnxiety, setCurrentAnxiety] = useState(5)
  const [currentEnergy, setCurrentEnergy] = useState(5)
  const [currentFocus, setCurrentFocus] = useState(5)
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [showJournal, setShowJournal] = useState(false)

  // Mock data for the past week
  const mockEntries: MoodEntry[] = [
    {
      id: '1',
      date: '2024-01-14',
      mood: 'happy',
      anxiety: 3,
      energy: 7,
      focus: 8,
      notes: 'Great study session today! Felt really focused.',
      triggers: ['good sleep', 'morning exercise']
    },
    {
      id: '2',
      date: '2024-01-13',
      mood: 'neutral',
      anxiety: 6,
      energy: 5,
      focus: 6,
      notes: 'Average day, a bit distracted during math.',
      triggers: ['social media', 'noise']
    },
    {
      id: '3',
      date: '2024-01-12',
      mood: 'sad',
      anxiety: 8,
      energy: 3,
      focus: 4,
      notes: 'Feeling overwhelmed with upcoming exams.',
      triggers: ['exam stress', 'poor sleep']
    },
    {
      id: '4',
      date: '2024-01-11',
      mood: 'very-happy',
      anxiety: 2,
      energy: 9,
      focus: 9,
      notes: 'Aced my biology quiz! Feeling confident.',
      triggers: ['achievement', 'good preparation']
    },
    {
      id: '5',
      date: '2024-01-10',
      mood: 'happy',
      anxiety: 4,
      energy: 7,
      focus: 7,
      notes: 'Productive day with active recall practice.',
      triggers: ['structured study', 'breaks']
    }
  ]

  useEffect(() => {
    setEntries(mockEntries)
  }, [])

  const moodEmojis = {
    'very-sad': '😢',
    'sad': '😔',
    'neutral': '😐',
    'happy': '😊',
    'very-happy': '😄'
  }

  const moodColors = {
    'very-sad': 'bg-red-100 text-red-800',
    'sad': 'bg-orange-100 text-orange-800',
    'neutral': 'bg-gray-100 text-gray-800',
    'happy': 'bg-green-100 text-green-800',
    'very-happy': 'bg-blue-100 text-blue-800'
  }

  const logMood = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      anxiety: currentAnxiety,
      energy: currentEnergy,
      focus: currentFocus,
      notes: notes
    }

    setEntries(prev => [newEntry, ...prev])
    setNotes('')
    setShowJournal(false)
  }

  const getAverageScore = (metric: 'anxiety' | 'energy' | 'focus') => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry[metric], 0)
    return Math.round(sum / entries.length)
  }

  const getMoodTrend = () => {
    if (entries.length < 2) return 'stable'
    const recent = entries.slice(0, 3)
    const older = entries.slice(3, 6)
    
    const recentScore = recent.reduce((acc, entry) => {
      const moodScore = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 }[entry.mood]
      return acc + moodScore
    }, 0) / recent.length

    const olderScore = older.reduce((acc, entry) => {
      const moodScore = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 }[entry.mood]
      return acc + moodScore
    }, 0) / (older.length || 1)

    if (recentScore > olderScore + 0.5) return 'improving'
    if (recentScore < olderScore - 0.5) return 'declining'
    return 'stable'
  }

  const generateInsights = (): WellnessInsight[] => {
    const insights: WellnessInsight[] = []
    const avgAnxiety = getAverageScore('anxiety')
    const avgEnergy = getAverageScore('energy')
    const trend = getMoodTrend()

    if (avgAnxiety > 7) {
      insights.push({
        type: 'warning',
        title: 'High Anxiety Levels',
        description: 'Your anxiety levels have been consistently high this week.',
        suggestion: 'Consider practicing breathing exercises or taking short breaks between study sessions.'
      })
    }

    if (avgEnergy < 4) {
      insights.push({
        type: 'warning',
        title: 'Low Energy Patterns',
        description: 'You\'ve been reporting low energy levels recently.',
        suggestion: 'Try adjusting your sleep schedule or incorporating light exercise into your routine.'
      })
    }

    if (trend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Mood Improving',
        description: 'Your mood has been trending upward this week!',
        suggestion: 'Keep up whatever you\'re doing - it\'s working well for you.'
      })
    }

    if (trend === 'declining') {
      insights.push({
        type: 'warning',
        title: 'Mood Declining',
        description: 'Your mood has been trending downward recently.',
        suggestion: 'Consider reaching out to a counselor or trusted friend for support.'
      })
    }

    return insights
  }

  const insights = generateInsights()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Heart className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Wellness Tracker</h1>
        </div>
        <p className="text-gray-600">Monitor your mental health and emotional well-being</p>
      </div>

      {/* Quick Check-in */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Check-in</CardTitle>
          <CardDescription>How are you feeling today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Current Mood</label>
              <div className="flex space-x-2">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    onClick={() => setCurrentMood(mood as MoodEntry['mood'])}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      currentMood === mood 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">{emoji}</div>
                    <div className="text-xs mt-1 capitalize">{mood.replace('-', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Anxiety Level: {currentAnxiety}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentAnxiety}
                  onChange={(e) => setCurrentAnxiety(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Calm</span>
                  <span>Very Anxious</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Energy Level: {currentEnergy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEnergy}
                  onChange={(e) => setCurrentEnergy(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Focus Level: {currentFocus}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentFocus}
                  onChange={(e) => setCurrentFocus(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Scattered</span>
                  <span>Laser Focus</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {showJournal && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (Optional)
                </label>
                <Textarea
                  placeholder="How was your day? Any specific triggers or positive moments?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={logMood}>Log Entry</Button>
              <Button 
                variant="outline" 
                onClick={() => setShowJournal(!showJournal)}
              >
                {showJournal ? 'Hide' : 'Add'} Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      insight.type === 'positive' 
                        ? 'bg-green-50 border border-green-200'
                        : insight.type === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {insight.type === 'positive' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mt-1" />
                      ) : insight.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-1" />
                      ) : (
                        <Brain className="h-4 w-4 text-blue-600 mt-1" />
                      )}
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <p className="text-sm font-medium mt-2">{insight.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Log more entries to get personalized insights</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">{getAverageScore('anxiety')}/10</div>
                  <div className="text-sm text-gray-600">Avg Anxiety</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{getAverageScore('energy')}/10</div>
                  <div className="text-sm text-gray-600">Avg Energy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{getAverageScore('focus')}/10</div>
                  <div className="text-sm text-gray-600">Avg Focus</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Anxiety Management:</span>
                  <span className="font-medium">
                    {getAverageScore('anxiety') <= 5 ? 'Good' : 'Needs Attention'}
                  </span>
                </div>
                <Progress value={Math.max(0, 100 - (getAverageScore('anxiety') * 10))} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energy Levels:</span>
                  <span className="font-medium">
                    {getAverageScore('energy') >= 6 ? 'Good' : 'Low'}
                  </span>
                </div>
                <Progress value={getAverageScore('energy') * 10} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Focus Quality:</span>
                  <span className="font-medium">
                    {getAverageScore('focus') >= 6 ? 'Good' : 'Needs Work'}
                  </span>
                </div>
                <Progress value={getAverageScore('focus') * 10} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <Badge className={moodColors[entry.mood]}>
                        {entry.mood.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>Anxiety: {entry.anxiety}/10</span>
                    <span>Energy: {entry.energy}/10</span>
                    <span>Focus: {entry.focus}/10</span>
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-700 mt-2">{entry.notes}</p>
                )}
                {entry.triggers && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.triggers.map((trigger, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
