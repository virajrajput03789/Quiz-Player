import { useEffect, useMemo, useState } from 'react'
import type { Quiz } from '../types/quiz.types'
import type { QuizData } from '../types/quiz.types'

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadQuizzes = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))
        const module = await import('../data/quiz.json')
        const data = module.default as QuizData
        if (!active) return
        setQuizzes(data.quizzes ?? [])
      } catch {
        if (!active) return
        setError('Unable to load quizzes right now.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadQuizzes()
    return () => {
      active = false
    }
  }, [])

  const byId = useMemo(
    () => new Map(quizzes.map((quiz) => [quiz.id, quiz])),
    [quizzes],
  )

  const getQuizById = (quizId: string) => byId.get(quizId)

  return { quizzes, isLoading, error, getQuizById }
}
