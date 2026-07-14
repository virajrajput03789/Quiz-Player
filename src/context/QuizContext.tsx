import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Question, QuestionResult, Quiz, QuizSummary } from '../types/quiz.types'

interface QuizContextValue {
  activeQuiz: Quiz | null
  currentQuestionIndex: number
  answers: Record<string, QuestionResult>
  isCompleted: boolean
  startQuiz: (quiz: Quiz) => void
  answerCurrentQuestion: (
    question: Question,
    selectedOption: string | null,
    timeTaken: number,
  ) => void
  goToNextQuestion: () => void
  finishQuiz: () => void
  resetQuizState: () => void
  getSummary: () => QuizSummary | null
}

const QuizContext = createContext<QuizContextValue | null>(null)

const shuffleArray = <T,>(items: T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const QuizProvider = ({ children }: PropsWithChildren) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, QuestionResult>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const startQuiz = (quiz: Quiz) => {
    const shuffledQuestions = shuffleArray(quiz.questions).map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))

    setActiveQuiz({
      ...quiz,
      questions: shuffledQuestions,
      totalQuestions: shuffledQuestions.length,
    })
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsCompleted(false)
  }

  const answerCurrentQuestion = (
    question: Question,
    selectedOption: string | null,
    timeTaken: number,
  ) => {
    const isCorrect = selectedOption === question.correctAnswer
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        questionId: question.id,
        selectedOption,
        isCorrect,
        timeTaken,
        pointsEarned: isCorrect ? question.points : 0,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      },
    }))
  }

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  const finishQuiz = () => {
    setIsCompleted(true)
  }

  const resetQuizState = () => {
    setActiveQuiz(null)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsCompleted(false)
  }

  const getSummary = (): QuizSummary | null => {
    if (!activeQuiz) return null
    const answerItems = Object.values(answers)
    const totalQuestions = activeQuiz.questions.length
    const totalScore = answerItems.reduce((sum, answer) => sum + answer.pointsEarned, 0)
    const correctCount = answerItems.filter((answer) => answer.isCorrect).length
    const wrongCount = totalQuestions - correctCount
    const totalPoints = activeQuiz.questions.reduce(
      (sum, question) => sum + question.points,
      0,
    )
    const percentage = totalPoints ? Math.round((totalScore / totalPoints) * 100) : 0

    return {
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      score: totalScore,
      correctCount,
      wrongCount,
      percentage,
      totalQuestions,
    }
  }

  const value = useMemo<QuizContextValue>(
    () => ({
      activeQuiz,
      currentQuestionIndex,
      answers,
      isCompleted,
      startQuiz,
      answerCurrentQuestion,
      goToNextQuestion,
      finishQuiz,
      resetQuizState,
      getSummary,
    }),
    [activeQuiz, currentQuestionIndex, answers, isCompleted],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export const useQuizContext = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuizContext must be used inside QuizProvider')
  }
  return context
}
