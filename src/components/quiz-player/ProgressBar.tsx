import { motion } from 'framer-motion'

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-dim-grey/40">
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 dark:bg-blurple dark:from-blurple dark:to-blurple dark:shadow-[0_0_8px_rgba(88,101,242,0.6)]"
      animate={{ width: `${progress}%` }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    />
  </div>
)

export default ProgressBar
