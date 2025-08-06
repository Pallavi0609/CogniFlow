'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, CheckCircle, XCircle, Clock, Target } from 'lucide-react'

interface Question {
  id: string
  question: string
  type: 'short_answer' | 'multiple_choice'
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  nextReviewAt: string
  repetitions: number
  easiness: number
}

export default function ActiveRecall() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [studyText, setStudyText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mock questions for demo
  const mockQuestions: Question[] = [
    {
      id: '1',
      question: 'What is the primary function of mitochondria in cells?',
      type: 'short_answer',
      correctAnswer: 'Energy production through cellular respiration',
      explanation: 'Mitochondria are known as the powerhouses of the cell because they produce ATP through cellular respiration.',
      difficulty: 'medium',
      topic: 'Biology',
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      repetitions: 0,
      easiness: 2.5
    },
    {
      id: '2',
      question: 'Explain the concept of photosynthesis in plants.',
      type: 'short_answer',
      correctAnswer: 'Process where plants convert light energy into chemical energy',
      explanation: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
      difficulty: 'easy',
      topic: 'Biology',
      nextReviewAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      repetitions: 1,
      easiness: 2.8
    },
    {
      id: '3',
      question: 'What is the difference between DNA and RNA?',
      type: 'short_answer',
      correctAnswer: 'DNA is double-stranded and stores genetic information, RNA is single-stranded and involved in protein synthesis',
      explanation: 'DNA contains the genetic blueprint, while RNA helps translate that information into proteins.',
      difficulty: 'hard',
      topic: 'Biology',
      nextReviewAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      repetitions: 0,
      easiness: 2.2
    }
  ]

  useEffect(() => {
    setQuestions(mockQuestions)
    setCurrentQuestion(mockQuestions[0])
  }, [])

  const generateQuestions = async () => {
    if (!studyText.trim()) return

    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock generated questions based on study text
    const newQuestions: Question[] = [
      {
        id: Date.now().toString(),
        question: `Based on your study material: "${studyText.slice(0, 50)}...", what are the key concepts?`,
        type: 'short_answer',
        correctAnswer: 'Key concepts from the provided material',
        explanation: 'This question tests your understanding of the main ideas in your study material.',
        difficulty: 'medium',
        topic: 'Custom',
        nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        repetitions: 0,
        easiness: 2.5
      }
    ]
    
    setQuestions(prev => [...prev, ...newQuestions])
    setIsGenerating(false)
    setStudyText('')
  }

  const submitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return

    // Simple similarity check for demo
    const similarity = calculateSimilarity(userAnswer.toLowerCase(), currentQuestion.correctAnswer.toLowerCase())
    const correct = similarity > 0.3

    setIsCorrect(correct)
    setShowResult(true)

    // Update spaced repetition schedule (SM-2 algorithm simulation)
    if (correct) {
      currentQuestion.repetitions += 1
      currentQuestion.easiness = Math.max(1.3, currentQuestion.easiness + 0.1)
    } else {
      currentQuestion.repetitions = 0
      currentQuestion.easiness = Math.max(1.3, currentQuestion.easiness - 0.2)
    }

    // Calculate next review time
    const interval = calculateInterval(currentQuestion.repetitions, currentQuestion.easiness)
    currentQuestion.nextReviewAt = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString()
  }

  const nextQuestion = () => {
    setShowResult(false)
    setUserAnswer('')
    
    const nextIndex = (currentIndex + 1) % questions.length
    setCurrentIndex(nextIndex)
    setCurrentQuestion(questions[nextIndex])
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ')
    const words2 = str2.split(' ')
    const commonWords = words1.filter(word => words2.includes(word))
    return commonWords.length / Math.max(words1.length, words2.length)
  }

  const calculateInterval = (repetitions: number, easiness: number): number => {
    if (repetitions === 0) return 1
    if (repetitions === 1) return 6
    return Math.round(calculateInterval(repetitions - 1, easiness) * easiness)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Active Recall</h1>
        </div>
        <p className="text-gray-600">Strengthen your memory with AI-powered spaced repetition</p>
      </div>

      {/* Generate Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Questions</CardTitle>
          <CardDescription>
            Paste your study material and we'll create personalized questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your study material here (notes, textbook excerpts, etc.)..."
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={generateQuestions} 
              disabled={!studyText.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>Question {currentIndex + 1} of {questions.length}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.topic}</Badge>
              </div>
            </div>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  {currentQuestion.question}
                </p>
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={submitAnswer} 
                    disabled={!userAnswer.trim()}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Your answer:</strong> {userAnswer}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Correct answer:</strong> {currentQuestion.correctAnswer}
                    </p>
                    <p className="text-gray-600">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      Next review: {new Date(currentQuestion.nextReviewAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Button onClick={nextQuestion} className="w-full">
                    Next Question
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {questions.filter(q => q.repetitions > 0).length}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {questions.filter(q => new Date(q.nextReviewAt) <= new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Due for Review</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
