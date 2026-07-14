import { motion } from 'framer-motion'
import type { Quiz } from '../../types/quiz.types'

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-spring-green/90 dark:text-not-quite-black',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-ember-orange/90 dark:text-not-quite-black',
  Hard: 'bg-rose-100 text-rose-700 dark:bg-ekko-red/90 dark:text-white',
}

const categoryGradients: Record<string, string> = {
  'General Knowledge': 'dark:from-blurple dark:to-purple-600',
  'Web Dev/Technology': 'dark:from-cerulean dark:to-teal-500',
  'Science': 'dark:from-indigo-600 dark:to-blue-700',
  'Sports': 'dark:from-ember-orange dark:to-ekko-red',
  'Entertainment/Movies': 'dark:from-pink-500 dark:to-fuchsia-600',
}

interface QuizCardProps {
  quiz: Quiz
  index: number
  onPlay: (quiz: Quiz) => void
}

const QuizCard = ({ quiz, index, onPlay }: QuizCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.35 }}
    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:border-none dark:bg-dark-charcoal dark:shadow-none dark:hover:-translate-y-1 dark:hover:shadow-[0_0_24px_rgba(88,101,242,0.35)] dark:duration-200"
  >
    <div className={`h-40 bg-gradient-to-br from-indigo-600 to-violet-600 ${categoryGradients[quiz.category] ?? 'dark:from-blurple dark:to-purple-600'}`}>
      <img
        src={quiz.thumbnail}
        alt={quiz.title}
        className="h-full w-full object-cover opacity-70"
      />
    </div>
    <div className="space-y-4 p-5 dark:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:rounded-pill dark:bg-blurple/20 dark:px-3 dark:font-bold dark:uppercase dark:text-snow">
          {quiz.category}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium dark:rounded-pill dark:px-3 dark:font-bold dark:uppercase ${
            difficultyStyles[quiz.difficulty] ??
            'bg-slate-100 text-slate-700 dark:bg-dim-grey/90 dark:text-snow'
          }`}
        >
          {quiz.difficulty}
        </span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:font-display dark:text-2xl dark:font-extrabold dark:uppercase dark:tracking-tight dark:text-snow">
          {quiz.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:font-body dark:text-sm dark:text-fog">
          {quiz.description}
        </p>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-fog">
        <span>{quiz.totalQuestions} questions</span>
        <span>{quiz.timePerQuestion}s each</span>
      </div>
      <button
        type="button"
        onClick={() => onPlay(quiz)}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:mt-2 dark:bg-blurple dark:px-6 dark:py-4 dark:font-display dark:uppercase dark:tracking-wide dark:hover:scale-105 dark:hover:bg-dark-blurple dark:active:scale-95"
      >
        Play Quiz
      </button>
    </div>
  </motion.article>
)

export default QuizCard
