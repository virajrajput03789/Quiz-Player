export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  points: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  difficulty: string
  timePerQuestion: number
  totalQuestions: number
  questions: Question[]
}

export interface QuizData {
  quizzes: Quiz[]
}

export interface QuestionResult {
  questionId: string
  selectedOption: string | null
  isCorrect: boolean
  timeTaken: number
  pointsEarned: number
  correctAnswer: string
  explanation: string
}

export interface QuizSummary {
  quizId: string
  quizTitle: string
  score: number
  correctCount: number
  wrongCount: number
  percentage: number
  totalQuestions: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  quizId: string
  quizTitle: string
  score: number
  percentage: number
  completedAt: Date | null
}
