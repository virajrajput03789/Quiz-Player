import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import ProgressBar from '../components/quiz-player/ProgressBar'
import QuestionCard from '../components/quiz-player/QuestionCard'
import Timer from '../components/quiz-player/Timer'
import { useQuizContext } from '../context/QuizContext'
import { useQuiz } from '../hooks/useQuiz'
import { useTimer } from '../hooks/useTimer'

const QuizPlayerPage = () => {
  const navigate = useNavigate()
  const { quizId } = useParams<{ quizId: string }>()
  const { isLoading, error, getQuizById } = useQuiz()
  const {
    activeQuiz,
    currentQuestionIndex,
    startQuiz,
    answerCurrentQuestion,
    goToNextQuestion,
    finishQuiz,
  } = useQuizContext()

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const isSubmitting = useRef(false)
  const timeLeftRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!quizId) {
      navigate('/', { replace: true })
      return
    }

    if (!activeQuiz || activeQuiz.id !== quizId) {
      const sourceQuiz = getQuizById(quizId)
      if (!sourceQuiz) {
        setReady(true)
        return
      }
      startQuiz(sourceQuiz)
    }
    setReady(true)
  }, [activeQuiz, getQuizById, isLoading, navigate, quizId, startQuiz])

  const currentQuestion = activeQuiz?.questions[currentQuestionIndex] ?? null

  const handleAdvance = useCallback(
    (fromTimeout: boolean) => {
      if (!activeQuiz || !currentQuestion || isSubmitting.current) return
      if (!fromTimeout && !selectedOption) return

      isSubmitting.current = true
      const timeTaken = activeQuiz.timePerQuestion - timeLeftRef.current
      answerCurrentQuestion(currentQuestion, selectedOption, Math.max(timeTaken, 0))
      const isLastQuestion = currentQuestionIndex >= activeQuiz.questions.length - 1

      if (isLastQuestion) {
        finishQuiz()
        navigate('/result', { replace: true })
      } else {
        goToNextQuestion()
        setSelectedOption(null)
      }

      window.setTimeout(() => {
        isSubmitting.current = false
      }, 0)
    },
    [
      activeQuiz,
      answerCurrentQuestion,
      currentQuestion,
      currentQuestionIndex,
      finishQuiz,
      goToNextQuestion,
      navigate,
      selectedOption,
    ],
  )

  const { timeLeft, reset } = useTimer(
    activeQuiz?.timePerQuestion ?? 0,
    () => handleAdvance(true),
  )

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  useEffect(() => {
    if (!activeQuiz || !currentQuestion) return
    reset(activeQuiz.timePerQuestion, true)
    setSelectedOption(null)
  }, [activeQuiz, currentQuestion, reset])

  useEffect(() => {
    if (!currentQuestion) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '1' && event.key <= '4') {
        const index = Number(event.key) - 1
        const option = currentQuestion.options[index]
        if (option) setSelectedOption(option)
      }
      if (event.key === 'Enter' && selectedOption) {
        handleAdvance(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentQuestion, handleAdvance, selectedOption])

  const progress = useMemo(() => {
    if (!activeQuiz) return 0
    return ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100
  }, [activeQuiz, currentQuestionIndex])

  if (isLoading || !ready) return <Loader label="Preparing quiz..." />
  if (error) return <EmptyState title="Unable to open quiz" description={error} />
  if (!activeQuiz || !currentQuestion) {
    return (
      <EmptyState
        title="Quiz not found"
        description="This quiz does not exist. Please return to the home page."
      />
    )
  }

  return (
    <main className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-none dark:bg-dark-charcoal dark:p-6 dark:shadow-none">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700 dark:font-bold dark:text-fog">
            {currentQuestionIndex + 1} / {activeQuiz.questions.length}
          </p>
          <Timer timeLeft={timeLeft} totalTime={activeQuiz.timePerQuestion} />
        </div>
        <ProgressBar progress={progress} />
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleAdvance(false)}
          disabled={!selectedOption}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-45 dark:rounded-pill dark:bg-blurple dark:py-3.5 dark:font-display dark:uppercase dark:tracking-wide dark:hover:scale-105 dark:hover:bg-dark-blurple dark:active:scale-95 dark:disabled:scale-100 dark:disabled:bg-dim-grey/30 dark:disabled:text-greyple dark:disabled:opacity-100"
        >
          {currentQuestionIndex >= activeQuiz.questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </main>
  )
}

export default QuizPlayerPage
