'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Plus } from 'lucide-react'

export default function MentalHealthProgress() {
  const moodData = [
    { day: 'Mon', mood: 'Happy', value: 85, color: 'bg-green-500' },
    { day: 'Tue', mood: 'Okay', value: 70, color: 'bg-yellow-500' },
    { day: 'Wed', mood: 'Stressed', value: 45, color: 'bg-red-500' },
    { day: 'Thu', mood: 'Happy', value: 80, color: 'bg-green-500' },
    { day: 'Fri', mood: 'Great', value: 95, color: 'bg-blue-500' },
    { day: 'Sat', mood: 'Okay', value: 65, color: 'bg-yellow-500' },
    { day: 'Sun', mood: 'Happy', value: 88, color: 'bg-green-500' }
  ]

  const currentMood = moodData[moodData.length - 1]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Mental Health Progress</span>
            </CardTitle>
            <CardDescription>Track your daily mood and mental wellbeing</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Log Mood
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Mood */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Mood</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentMood.mood}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl">😊</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentMood.value}%</p>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">This Week</h4>
          <div className="flex items-end justify-between space-x-2 h-32">
            {moodData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div className="relative w-full">
                  <div 
                    className={`${data.color} rounded-t-md transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${data.value}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{data.day}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{data.mood}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Insight</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Your mood has been consistently positive this week! Consider what's working well and maintain those habits.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
