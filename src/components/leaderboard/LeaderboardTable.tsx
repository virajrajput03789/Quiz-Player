import type { LeaderboardEntry } from '../../types/quiz.types'
import EmptyState from '../common/EmptyState'
import Loader from '../common/Loader'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  loading: boolean
  error: string | null
}

const LeaderboardTable = ({ entries, loading, error }: LeaderboardTableProps) => {
  if (loading) return <Loader label="Loading leaderboard..." />
  if (error) {
    return (
      <EmptyState
        title="Leaderboard unavailable"
        description={error}
      />
    )
  }
  if (!entries.length) {
    return (
      <EmptyState
        title="No scores yet"
        description="Be the first player to add a score to the leaderboard."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-none dark:bg-transparent dark:shadow-none">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600 dark:border-b dark:border-dim-grey/20 dark:bg-transparent dark:font-body dark:text-fog">
          <tr>
            <th className="px-4 py-3 font-semibold dark:font-bold dark:uppercase">#</th>
            <th className="px-4 py-3 font-semibold dark:font-bold dark:uppercase">Name</th>
            <th className="px-4 py-3 font-semibold dark:font-bold dark:uppercase">Score</th>
            <th className="px-4 py-3 font-semibold dark:font-bold dark:uppercase">Percent</th>
            <th className="px-4 py-3 font-semibold dark:font-bold dark:uppercase">Completed</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const isFirst = index === 0
            const isSecond = index === 1
            const isThird = index === 2
            let rankColor = 'dark:text-fog'
            if (isFirst) rankColor = 'dark:text-ember-orange dark:font-extrabold'
            if (isSecond) rankColor = 'dark:text-fog dark:font-bold'
            if (isThird) rankColor = 'dark:text-[#cd7f32] dark:font-bold' // bronze

            return (
              <tr
                key={entry.id}
                className="border-t border-slate-200 text-slate-700 dark:border-b dark:border-t-0 dark:border-dim-grey/20 dark:bg-dark-charcoal/40 dark:text-snow dark:last:border-b-0"
              >
                <td className={`px-4 py-3 ${index < 3 ? 'font-bold text-indigo-600' : ''} ${rankColor}`}>{index + 1}</td>
                <td className="px-4 py-3 font-medium dark:font-bold">{entry.name}</td>
                <td className="px-4 py-3">{entry.score}</td>
                <td className="px-4 py-3">{entry.percentage}%</td>
                <td className="px-4 py-3 dark:text-greyple">
                {entry.completedAt
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(entry.completedAt)
                  : '-'}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardTable
