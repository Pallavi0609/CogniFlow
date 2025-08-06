'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Plus, MessageCircle } from 'lucide-react'

export default function StudyGroups() {
  const studyGroups = [
    {
      name: 'Physics Study Group',
      members: 8,
      subject: 'Physics',
      nextSession: 'Tomorrow 3:00 PM',
      status: 'active',
      avatars: ['JD', 'SM', 'AL', 'KR']
    },
    {
      name: 'Math Problem Solvers',
      members: 12,
      subject: 'Mathematics',
      nextSession: 'Friday 2:00 PM',
      status: 'active',
      avatars: ['MJ', 'TS', 'LK', 'NP']
    },
    {
      name: 'CS Project Team',
      members: 6,
      subject: 'Computer Science',
      nextSession: 'Next Week',
      status: 'planning',
      avatars: ['RB', 'EW', 'DL']
    }
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span>Study Groups</span>
            </CardTitle>
            <CardDescription>Collaborate and learn together with peers</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Join/Create Group
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyGroups.map((group, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                  {group.status}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">{group.members} members</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{group.subject}</p>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex -space-x-2">
                  {group.avatars.map((avatar, i) => (
                    <Avatar key={i} className="w-6 h-6 border-2 border-white dark:border-gray-800">
                      <AvatarFallback className="text-xs">{avatar}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">+{group.members - group.avatars.length} more</span>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Next session: {group.nextSession}
              </p>
              
              <Button variant="outline" size="sm" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discussion
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
