import { motion } from 'framer-motion'

interface OptionButtonProps {
  option: string
  index: number
  selected: boolean
  onSelect: (option: string) => void
}

const OptionButton = ({ option, index, selected, onSelect }: OptionButtonProps) => (
  <motion.button
    type="button"
    onClick={() => onSelect(option)}
    whileTap={{ scale: 0.97 }}
    animate={selected ? { scale: [1, 1.03, 1] } : { scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`flex w-full items-center gap-3 border p-4 text-left text-sm font-medium transition-colors duration-200 rounded-xl ${
      selected
        ? 'bg-brand-100 border-brand-600 text-brand-900 dark:border-blurple dark:bg-blurple/15 dark:text-snow'
        : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 dark:border-dim-grey/40 dark:bg-not-quite-black dark:text-snow dark:shadow-none dark:hover:border-blurple/60'
    }`}
  >
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
        selected
          ? 'bg-brand-600 text-white dark:bg-blurple dark:text-snow'
          : 'bg-slate-100 text-slate-700 dark:bg-dark-charcoal dark:text-fog'
      }`}
    >
      {index + 1}
    </span>
    <span>{option}</span>
  </motion.button>
)

export default OptionButton
