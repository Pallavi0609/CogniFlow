'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Plus, Eye } from 'lucide-react'

export default function MindmapWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span>Recent Mindmap</span>
            </CardTitle>
            <CardDescription>Visual learning and concept mapping</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mindmap Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-2 border-dashed border-purple-200 dark:border-purple-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              "Quantum Physics Concepts"
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Created 2 days ago • 15 nodes • 8 connections
            </p>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Mindmap
            </Button>
          </div>
        </div>

        {/* Recent Mindmaps */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Mindmaps</h4>
          <div className="space-y-2">
            {[
              { title: 'Organic Chemistry Reactions', nodes: 12, date: '3 days ago' },
              { title: 'Data Structures Overview', nodes: 8, date: '1 week ago' },
              { title: 'History Timeline', nodes: 20, date: '2 weeks ago' }
            ].map((mindmap, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{mindmap.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {mindmap.nodes} nodes • {mindmap.date}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
