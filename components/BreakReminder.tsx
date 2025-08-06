'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, Play, Pause, Square, Coffee } from 'lucide-react'

interface BreakReminderProps {
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void
}

export default function BreakReminder({ showConfirmation }: BreakReminderProps) {
  const [isStudying, setIsStudying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [totalTime, setTotalTime] = useState(25 * 60)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isStudying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isStudying) {
      // Time's up - switch to break or study
      if (isBreak) {
        setIsBreak(false)
        setTimeLeft(25 * 60)
        setTotalTime(25 * 60)
      } else {
        setIsBreak(true)
        setTimeLeft(5 * 60) // 5 minute break
        setTotalTime(5 * 60)
      }
    }

    return () => clearInterval(interval)
  }, [isStudying, timeLeft, isBreak])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = () => {
    setIsStudying(true)
  }

  const pauseSession = () => {
    setIsStudying(false)
  }

  const stopSession = () => {
    showConfirmation(
      'End Study Session',
      'Are you sure you want to end your current study session? Your progress will be saved.',
      () => {
        setIsStudying(false)
        setTimeLeft(25 * 60)
        setTotalTime(25 * 60)
        setIsBreak(false)
      }
    )
  }

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <Card className={`${isBreak ? 'bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isBreak ? <Coffee className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-blue-500" />}
          <span>{isBreak ? 'Break Time' : 'Study Session'}</span>
        </CardTitle>
        <CardDescription>
          {isBreak ? 'Take a well-deserved break!' : 'Focus time with automatic break reminders'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isBreak ? 'Break time remaining' : 'Study time remaining'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          {!isStudying ? (
            <Button onClick={startSession} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              <Button onClick={pauseSession} variant="outline" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stopSession} variant="outline" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Session Stats */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sessions Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">75</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Minutes Studied</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
