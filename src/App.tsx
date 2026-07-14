import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import QuizPlayerPage from './pages/QuizPlayerPage'
import ResultPage from './pages/ResultPage'

const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const getPreferredTheme = () => {
  const saved = localStorage.getItem('quiz-player-theme')
  if (saved === 'dark' || saved === 'light') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:quizId" element={<QuizPlayerPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getPreferredTheme())

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('quiz-player-theme', theme)
  }, [theme])

  const toggleThemeIcon = useMemo(
    () =>
      theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-300" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600" />
      ),
    [theme],
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-cosmic-page dark:text-snow">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight text-indigo-700 font-display uppercase dark:text-snow">
            Quiz Player
          </h1>
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="inline-flex items-center gap-2 rounded-pill border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow dark:border-dim-grey/20 dark:bg-not-quite-black dark:text-greyple dark:shadow-none dark:hover:text-snow"
            aria-label="Toggle dark mode"
          >
            {toggleThemeIcon}
            <span className="hidden sm:inline">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </header>
        <AnimatedRoutes />
      </div>
    </div>
  )
}

export default App
