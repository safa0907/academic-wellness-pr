import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, CheckCircle, XCircle, Clock, Target } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface QuizProps {
  userProfile: any
}

interface QuizQuestion {
  id: string
  subject: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
}

interface QuizSession {
  date: string
  subject: string
  score: number
  totalQuestions: number
  timeSpent: number
  difficulty: string
}

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    subject: 'Mathematics',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', '2x²', 'x²'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x'
  },
  {
    id: '2',
    subject: 'Physics',
    question: 'What is the unit of force in the SI system?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Newton (N) is the SI unit of force, named after Isaac Newton.'
  },
  {
    id: '3',
    subject: 'Chemistry',
    question: 'What is the chemical formula for water?',
    options: ['H₂O', 'H₂O₂', 'HO', 'H₃O'],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Water consists of two hydrogen atoms and one oxygen atom: H₂O'
  },
  {
    id: '4',
    subject: 'Mathematics',
    question: 'What is the integral of 2x?',
    options: ['x²', 'x² + C', '2', '2x² + C'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The integral of 2x is x² + C, where C is the constant of integration.'
  }
]

export function Quiz({ userProfile }: QuizProps) {
  const [quizHistory, setQuizHistory] = useKV<QuizSession[]>('quiz-history', [])
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [score, setScore] = useState(0)
  const [isQuizActive, setIsQuizActive] = useState(false)

  const startQuiz = (subject?: string) => {
    let questions = SAMPLE_QUESTIONS
    
    if (subject) {
      questions = SAMPLE_QUESTIONS.filter(q => q.subject === subject)
    }
    
    // Shuffle questions and take 5
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5)
    
    setCurrentQuiz(shuffled)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsQuizActive(true)
    setQuizStartTime(Date.now())
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const nextQuestion = () => {
    if (selectedAnswer === currentQuiz[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      completeQuiz()
    }
  }

  const showAnswer = () => {
    setShowResult(true)
  }

  const completeQuiz = () => {
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000)
    const finalScore = selectedAnswer === currentQuiz[currentQuestionIndex].correctAnswer ? score + 1 : score
    
    const session: QuizSession = {
      date: new Date().toISOString(),
      subject: currentQuiz.length > 0 ? currentQuiz[0].subject : 'Mixed',
      score: finalScore,
      totalQuestions: currentQuiz.length,
      timeSpent,
      difficulty: 'medium'
    }

    if (quizHistory) {
      setQuizHistory([...quizHistory, session])
    }

    setIsQuizActive(false)
    setShowResult(true)
    setScore(finalScore)
  }

  const resetQuiz = () => {
    setIsQuizActive(false)
    setCurrentQuiz([])
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
  }

  const currentQuestion = currentQuiz[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / currentQuiz.length) * 100

  const recentSessions = quizHistory?.slice(-5) || []
  const averageScore = quizHistory?.length ? 
    Math.round((quizHistory.reduce((sum, session) => sum + (session.score / session.totalQuestions), 0) / quizHistory.length) * 100) : 0

  if (!isQuizActive) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Practice Quiz
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge with adaptive questions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-xl font-semibold">{averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                  <p className="text-xl font-semibold">{quizHistory?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-xl font-semibold">
                    {Math.round((quizHistory?.reduce((sum, s) => sum + s.timeSpent, 0) || 0) / 60)}m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>Start a Quiz</CardTitle>
            <CardDescription>
              Choose a subject or take a mixed quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button onClick={() => startQuiz()} className="h-20 flex flex-col gap-2">
                <Brain className="h-6 w-6" />
                <span>Mixed Quiz</span>
                <span className="text-xs opacity-75">All subjects</span>
              </Button>
              
              {userProfile?.subjects?.slice(0, 5).map((subject: string) => (
                <Button
                  key={subject}
                  variant="outline"
                  onClick={() => startQuiz(subject)}
                  className="h-20 flex flex-col gap-2"
                >
                  <Target className="h-6 w-6" />
                  <span>{subject}</span>
                  <span className="text-xs opacity-75">Focused practice</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{session.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={session.score / session.totalQuestions >= 0.8 ? 'default' : 'secondary'}>
                        {session.score}/{session.totalQuestions}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(session.timeSpent / 60)}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  // Quiz completion screen
  if (!isQuizActive && showResult) {
    const finalScore = score
    const percentage = Math.round((finalScore / currentQuiz.length) * 100)
    
    return (
      <div className="space-y-6 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {percentage >= 80 ? (
                <CheckCircle className="h-16 w-16 text-secondary" />
              ) : percentage >= 60 ? (
                <Target className="h-16 w-16 text-accent" />
              ) : (
                <XCircle className="h-16 w-16 text-destructive" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </CardTitle>
            <CardDescription>
              You scored {finalScore} out of {currentQuiz.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
              <Progress value={percentage} className="w-full h-3" />
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={resetQuiz} variant="outline">
                Back to Menu
              </Button>
              <Button onClick={() => startQuiz()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active quiz
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h1>
            <p className="text-sm text-muted-foreground">{currentQuestion.subject}</p>
          </div>
        </div>
        <Button variant="outline" onClick={resetQuiz}>
          Exit Quiz
        </Button>
      </div>

      <Progress value={progressPercentage} className="w-full h-2" />

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            <Badge variant="secondary">{currentQuestion.subject}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonVariant: "default" | "outline" | "destructive" | "secondary" = "outline"
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonVariant = "default"
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonVariant = "destructive"
                }
              } else if (selectedAnswer === index) {
                buttonVariant = "secondary"
              }

              return (
                <Button
                  key={index}
                  variant={buttonVariant}
                  onClick={() => selectAnswer(index)}
                  disabled={showResult}
                  className="w-full text-left justify-start p-4 h-auto"
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
            </div>
            
            <div className="flex gap-2">
              {!showResult && selectedAnswer !== null && (
                <Button onClick={showAnswer} variant="outline">
                  Show Answer
                </Button>
              )}
              
              {showResult && (
                <Button onClick={nextQuestion}>
                  {currentQuestionIndex < currentQuiz.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}