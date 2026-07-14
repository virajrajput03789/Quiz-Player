import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import QuizCard from '../components/quiz-list/QuizCard'
import { useQuizContext } from '../context/QuizContext'
import { useQuiz } from '../hooks/useQuiz'
import type { Quiz } from '../types/quiz.types'

const HomePage = () => {
  const { quizzes, isLoading, error } = useQuiz()
  const { startQuiz } = useQuizContext()
  const navigate = useNavigate()

  const handlePlayQuiz = (quiz: Quiz) => {
    startQuiz(quiz)
    navigate(`/quiz/${quiz.id}`)
  }

  return (
    <main className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white shadow-soft dark:bg-none dark:p-4 dark:px-2 dark:text-snow dark:shadow-none"
      >
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl dark:font-display dark:text-5xl dark:font-extrabold dark:uppercase">Choose your quiz</h2>
        <p className="mt-2 text-sm text-indigo-100 dark:font-body dark:text-lg dark:text-fog">
          Challenge yourself with timed questions and save your best scores.
        </p>
      </motion.section>

      {isLoading ? (
        <Loader label="Loading quizzes..." />
      ) : error ? (
        <EmptyState title="Could not load quizzes" description={error} />
      ) : quizzes.length === 0 ? (
        <EmptyState title="No quizzes available" description="Please add quizzes to quiz.json." />
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              index={index}
              onPlay={handlePlayQuiz}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default HomePage
