import { motion } from 'framer-motion'

const Loader = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900/70">
    <motion.div
      className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
    <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
  </div>
)

export default Loader
