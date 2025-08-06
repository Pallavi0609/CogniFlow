'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Construction, ArrowLeft } from 'lucide-react'

interface ComingSoonProps {
  feature: string
  description: string
  onBack: () => void
}

export default function ComingSoon({ feature, description, onBack }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-16 w-16 text-blue-600" />
            </div>
            <CardTitle className="text-2xl mb-2">
              {feature}
              <Badge className="ml-2" variant="secondary">Coming Soon</Badge>
            </CardTitle>
            <CardDescription className="text-lg">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                This feature is currently in development and will be available soon. 
                We're working hard to bring you the best learning experience!
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Intuitive and accessible design</li>
                  <li>• AI-powered personalization</li>
                  <li>• Seamless integration with other features</li>
                  <li>• Built specifically for neurodiverse learners</li>
                </ul>
              </div>
              <Button onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
