interface TimerProps {
  timeLeft: number
  totalTime: number
}

const Timer = ({ timeLeft, totalTime }: TimerProps) => {
  const percentage = Math.max((timeLeft / totalTime) * 100, 0)
  const isLow = timeLeft <= 5
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-36 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-none dark:bg-dim-grey/40">
        <div
          className={`h-full transition-all duration-500 ${isLow ? 'bg-rose-500 dark:bg-ember-orange' : 'bg-gradient-to-r from-brand-600 to-brand-500 dark:from-dim-grey dark:to-dim-grey dark:bg-dim-grey'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`w-10 text-right text-sm font-semibold ${isLow ? 'text-rose-600 dark:animate-pulse dark:text-ember-orange' : 'text-slate-700 dark:text-fog'}`}>
        {timeLeft}s
      </span>
    </div>
  )
}

export default Timer
