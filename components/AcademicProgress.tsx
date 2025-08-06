'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, TrendingUp, Plus } from 'lucide-react'

export default function AcademicProgress() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Midterm_Results.pdf', grade: 'A-', date: '2024-01-10' },
    { name: 'Assignment_3.pdf', grade: 'B+', date: '2024-01-05' }
  ])

  const subjects = [
    { name: 'Mathematics', progress: 85, grade: 'A-', color: 'blue' },
    { name: 'Physics', progress: 78, grade: 'B+', color: 'green' },
    { name: 'Chemistry', progress: 92, grade: 'A', color: 'purple' },
    { name: 'Computer Science', progress: 88, grade: 'A-', color: 'orange' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // Handle file upload logic here
      console.log('Files uploaded:', files)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Academic Progress</span>
            </CardTitle>
            <CardDescription>Track your academic performance and upload results</CardDescription>
          </div>
          <div className="flex space-x-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Results
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall GPA */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall GPA</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.2</span>
          </div>
          <Progress value={84} className="h-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Excellent performance! You're in the top 15% of your class.
          </p>
        </div>

        {/* Subject Progress */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Subject Performance</h4>
          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {subject.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {subject.grade}
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Uploads</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{file.date}</p>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {file.grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
