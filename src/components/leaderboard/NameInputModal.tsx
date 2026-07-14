import { motion } from 'framer-motion'
import { useState } from 'react'

interface NameInputModalProps {
  open: boolean
  onSubmit: (name: string) => Promise<void>
  loading: boolean
  error: string | null
}

const NameInputModal = ({
  open,
  onSubmit,
  loading,
  error,
}: NameInputModalProps) => {
  const [name, setName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  if (!open) return null

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      setLocalError('Please enter your name.')
      return
    }
    setLocalError(null)
    await onSubmit(name.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-none dark:bg-dark-charcoal dark:shadow-2xl dark:shadow-black/50"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:font-display dark:text-2xl dark:font-extrabold dark:uppercase dark:text-snow">
          Enter leaderboard
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:font-body dark:text-fog">
          Add your name to save this attempt.
        </p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-dim-grey/40 dark:bg-not-quite-black dark:text-snow dark:placeholder:text-greyple dark:focus:border-blurple dark:focus:ring-2 dark:focus:ring-blurple/40"
          placeholder="Your name"
          maxLength={32}
          autoFocus
        />
        {(localError || error) && (
          <p className="mt-2 text-sm text-rose-600 dark:font-body dark:text-ekko-red">{localError ?? error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:rounded-pill dark:bg-blurple dark:py-3.5 dark:font-display dark:uppercase dark:tracking-wide dark:hover:scale-105 dark:hover:bg-dark-blurple dark:active:scale-95 dark:disabled:scale-100 dark:disabled:bg-dim-grey/30 dark:disabled:text-greyple dark:disabled:opacity-100"
        >
          {loading ? 'Saving...' : 'Save Score'}
        </button>
      </motion.form>
    </div>
  )
}

export default NameInputModal
