import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { QuizSummary } from '../../types/quiz.types'

interface ResultScreenProps {
  summary: QuizSummary
  onPlayAgain: () => void
}

const getPerformanceLabel = (percentage: number) => {
  if (percentage >= 80) return { text: 'Excellent!', colorClass: 'dark:text-spring-green text-emerald-600' }
  if (percentage >= 50) return { text: 'Good effort', colorClass: 'dark:text-ember-orange text-amber-600' }
  return { text: 'Keep practicing', colorClass: 'dark:text-fog text-slate-500' }
}

const ResultScreen = ({ summary, onPlayAgain }: ResultScreenProps) => {
  const scoreMotion = useMotionValue(0)
  const [displayScore, setDisplayScore] = useState(0)

  useMotionValueEvent(scoreMotion, 'change', (latest) => {
    setDisplayScore(Math.round(latest))
  })

  useEffect(() => {
    const controls = animate(scoreMotion, summary.score, {
      duration: 1.15,
      ease: 'easeOut',
    })
    return () => controls.stop()
  }, [scoreMotion, summary.score])

  const stats = useMemo(
    () => [
      { label: 'Correct', value: summary.correctCount },
      { label: 'Wrong', value: summary.wrongCount },
      { label: 'Percentage', value: `${summary.percentage}%` },
    ],
    [summary.correctCount, summary.wrongCount, summary.percentage],
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-none dark:bg-transparent dark:shadow-none"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:font-display dark:text-4xl dark:font-extrabold dark:uppercase dark:tracking-tight dark:text-snow">
          {summary.quizTitle}
        </h2>
        <p className={`mt-3 text-sm font-semibold dark:font-body dark:text-lg dark:font-normal ${getPerformanceLabel(summary.percentage).colorClass}`}>
          {getPerformanceLabel(summary.percentage).text}
        </p>
        <p className="mt-5 text-5xl font-bold text-indigo-600 dark:font-display dark:text-7xl dark:font-extrabold dark:text-snow">
          {displayScore}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:font-body dark:text-fog dark:uppercase dark:tracking-widest">Total Score</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-none dark:bg-dark-charcoal dark:p-6 dark:text-center dark:shadow-none"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:font-body dark:text-fog">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:mt-2 dark:font-display dark:text-3xl dark:font-extrabold dark:text-snow">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:rounded-pill dark:bg-blurple dark:px-6 dark:py-4 dark:font-display dark:uppercase dark:tracking-wide dark:hover:scale-105 dark:hover:bg-dark-blurple dark:active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
