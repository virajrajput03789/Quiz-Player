import { motion } from 'framer-motion'
import type { Question } from '../../types/quiz.types'
import OptionButton from './OptionButton'

interface QuestionCardProps {
  question: Question
  selectedOption: string | null
  onSelectOption: (option: string) => void
}

const QuestionCard = ({
  question,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) => (
  <motion.div
    key={question.id}
    initial={{ opacity: 0, x: 48 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -48 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-none dark:bg-dark-charcoal dark:p-8 dark:shadow-none"
  >
    <h2 className="text-xl font-semibold leading-tight text-slate-900 md:dark:text-4xl dark:font-display dark:text-3xl dark:font-extrabold dark:text-snow">
      {question.question}
    </h2>
    <div className="mt-6 space-y-3 dark:mt-8">
      {question.options.map((option, index) => (
        <OptionButton
          key={option}
          option={option}
          index={index}
          selected={selectedOption === option}
          onSelect={onSelectOption}
        />
      ))}
    </div>
  </motion.div>
)

export default QuestionCard
