'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, Plus, CheckCircle, Circle, Brain, Target, Zap, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  subject: string
  estimatedMinutes: number
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  scheduledTime: string
  aiSuggested: boolean
}

interface TimeBlock {
  time: string
  task?: Task
  energyLevel: 'low' | 'medium' | 'high'
  available: boolean
}

export default function DailyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', subject: '', estimatedMinutes: 30 })
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])
  const [showAddTask, setShowAddTask] = useState(false)

  // Mock AI-suggested tasks
  const aiSuggestedTasks: Task[] = [
    {
      id: 'ai-1',
      title: 'Review Biology Chapter 5',
      description: 'Focus on photosynthesis and cellular respiration',
      subject: 'Biology',
      estimatedMinutes: 45,
      priority: 'high',
      completed: false,
      scheduledTime: '09:00',
      aiSuggested: true
    },
    {
      id: 'ai-2',
      title: 'Practice Math Problems',
      description: 'Quadratic equations - problems 15-25',
      subject: 'Mathematics',
      estimatedMinutes: 30,
      priority: 'medium',
      completed: false,
      scheduledTime: '14:00',
      aiSuggested: true
    },
    {
      id: 'ai-3',
      title: 'Active Recall Session',
      description: 'Review yesterday\'s generated questions',
      subject: 'General',
      estimatedMinutes: 20,
      priority: 'high',
      completed: false,
      scheduledTime: '16:00',
      aiSuggested: true
    }
  ]

  // Generate time blocks for the day
  useEffect(() => {
    const blocks: TimeBlock[] = []
    for (let hour = 8; hour < 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      const energyLevel = hour < 12 ? 'high' : hour < 17 ? 'medium' : 'low'
      blocks.push({
        time,
        energyLevel,
        available: true
      })
    }
    setTimeBlocks(blocks)
    setTasks(aiSuggestedTasks)
  }, [])

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      subject: newTask.subject || 'General',
      estimatedMinutes: newTask.estimatedMinutes,
      priority: 'medium',
      completed: false,
      scheduledTime: '',
      aiSuggested: false
    }

    setTasks(prev => [...prev, task])
    setNewTask({ title: '', description: '', subject: '', estimatedMinutes: 30 })
    setShowAddTask(false)
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const scheduleTask = (taskId: string, time: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, scheduledTime: time } : task
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEnergyIcon = (level: string) => {
    switch (level) {
      case 'high': return <Zap className="h-4 w-4 text-green-600" />
      case 'medium': return <Target className="h-4 w-4 text-yellow-600" />
      case 'low': return <Clock className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Daily Planner</h1>
        </div>
        <p className="text-gray-600">AI-powered study scheduling optimized for your learning patterns</p>
      </div>

      {/* Date Selector & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>{selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Tasks completed:</span>
                <span className="font-medium">{completedTasks}/{totalTasks}</span>
              </div>
              <Progress value={completionRate} className="w-full" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{totalTasks}</div>
                  <div className="text-xs text-gray-600">Total Tasks</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{completedTasks}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {tasks.reduce((acc, task) => acc + task.estimatedMinutes, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Total Minutes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Brain className="h-4 w-4 text-blue-600 mt-1" />
                <div className="text-sm">
                  <div className="font-medium">Peak Focus Time</div>
                  <div className="text-gray-600">9:00 AM - 11:00 AM based on your patterns</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-green-600 mt-1" />
                <div className="text-sm">
                  <div className="font-medium">Optimal Break</div>
                  <div className="text-gray-600">Take a 15-min break after Biology review</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-1" />
                <div className="text-sm">
                  <div className="font-medium">Energy Alert</div>
                  <div className="text-gray-600">Schedule lighter tasks after 5 PM</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Tasks</CardTitle>
              <Button size="sm" onClick={() => setShowAddTask(!showAddTask)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddTask && (
              <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Subject"
                    value={newTask.subject}
                    onChange={(e) => setNewTask(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={newTask.estimatedMinutes}
                    onChange={(e) => setNewTask(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 30 }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={addTask} size="sm">Add Task</Button>
                  <Button variant="outline" onClick={() => setShowAddTask(false)} size="sm">Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    task.completed ? 'bg-green-50 border-green-200' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        {task.aiSuggested && (
                          <Badge variant="secondary" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{task.subject}</span>
                        <span>{task.estimatedMinutes} min</span>
                        {task.scheduledTime && (
                          <span className="text-blue-600 font-medium">
                            Scheduled: {task.scheduledTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
            <CardDescription>Drag tasks to time slots or click to schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {timeBlocks.map((block) => {
                const scheduledTask = tasks.find(t => t.scheduledTime === block.time)
                return (
                  <div
                    key={block.time}
                    className={`p-3 rounded-lg border transition-colors ${
                      scheduledTask 
                        ? scheduledTask.completed 
                          ? 'bg-green-100 border-green-300'
                          : 'bg-blue-100 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{block.time}</span>
                        {getEnergyIcon(block.energyLevel)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {block.energyLevel} energy
                      </div>
                    </div>
                    {scheduledTask ? (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-sm">{scheduledTask.title}</div>
                          <Badge variant="outline" className="text-xs">
                            {scheduledTask.estimatedMinutes}m
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {scheduledTask.subject}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-gray-400">
                        Available slot
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Optimize</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Focus Session</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Time Block</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>View Week</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
