import confetti from 'canvas-confetti'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import EmptyState from '../components/common/EmptyState'
import LeaderboardTable from '../components/leaderboard/LeaderboardTable'
import NameInputModal from '../components/leaderboard/NameInputModal'
import ResultScreen from '../components/result/ResultScreen'
import { useQuizContext } from '../context/QuizContext'
import { useQuiz } from '../hooks/useQuiz'
import { db, firebaseInitError, isFirebaseConfigured } from '../lib/firebase'
import type { LeaderboardEntry } from '../types/quiz.types'

const ResultPage = () => {
  const navigate = useNavigate()
  const { getQuizById } = useQuiz()
  const { activeQuiz, isCompleted, startQuiz, getSummary, resetQuizState } = useQuizContext()
  const summary = getSummary()

  const [modalOpen, setModalOpen] = useState(false)
  const [submittingName, setSubmittingName] = useState(false)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  const quizId = summary?.quizId

  useEffect(() => {
    if (!quizId || !isCompleted) {
      navigate('/', { replace: true })
      return
    }
    setModalOpen(isFirebaseConfigured && !!db)
  }, [isCompleted, navigate, quizId])

  const hasFiredConfetti = useRef(false)

  useEffect(() => {
    if (!summary || summary.percentage < 80) return
    if (!hasFiredConfetti.current) {
      hasFiredConfetti.current = true
      void confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, disableForReducedMotion: true })
    }
  }, [])



  const fetchLeaderboard = useCallback(async () => {
    if (!db || !quizId) return
    setLeaderboardLoading(true)
    setLeaderboardError(null)
    try {
      const leaderboardQuery = query(
        collection(db, 'leaderboard'),
        where('quizId', '==', quizId),
        orderBy('score', 'desc'),
        orderBy('completedAt', 'desc'),
        limit(10),
      )
      const snapshot = await getDocs(leaderboardQuery)
      const nextEntries: LeaderboardEntry[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: String(data.name ?? 'Anonymous'),
          quizId: String(data.quizId ?? ''),
          quizTitle: String(data.quizTitle ?? ''),
          score: Number(data.score ?? 0),
          percentage: Number(data.percentage ?? 0),
          completedAt:
            typeof data.completedAt?.toDate === 'function'
              ? data.completedAt.toDate()
              : null,
        }
      })
      setEntries(nextEntries)
    } catch (err) {
      console.error('Firestore query failed:', err)
      setLeaderboardError('Leaderboard unavailable.')
    } finally {
      setLeaderboardLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    if (!quizId || !isFirebaseConfigured || !db) return
    void fetchLeaderboard()
  }, [fetchLeaderboard, isFirebaseConfigured, quizId])

  const handleNameSubmit = async (name: string) => {
    if (!db || !summary) return
    setSubmittingName(true)
    setNameError(null)
    try {
      await addDoc(collection(db, 'leaderboard'), {
        name,
        quizId: summary.quizId,
        quizTitle: summary.quizTitle,
        score: summary.score,
        percentage: summary.percentage,
        completedAt: serverTimestamp(),
      })
      setModalOpen(false)
      await fetchLeaderboard()
    } catch {
      setNameError('Could not save your score right now.')
    } finally {
      setSubmittingName(false)
    }
  }

  const leaderboardUnavailable = useMemo(
    () => !isFirebaseConfigured || !db,
    [],
  )

  const handlePlayAgain = () => {
    if (!summary) return
    const sourceQuiz = getQuizById(summary.quizId)
    if (!sourceQuiz) {
      resetQuizState()
      navigate('/', { replace: true })
      return
    }
    startQuiz(sourceQuiz)
    navigate(`/quiz/${sourceQuiz.id}`, { replace: true })
  }

  if (!summary || !activeQuiz) return null

  return (
    <main className="space-y-6">
      <ResultScreen summary={summary} onPlayAgain={handlePlayAgain} />

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:font-display dark:text-3xl dark:font-extrabold dark:uppercase dark:tracking-tight dark:text-snow">
          Top 10 Leaderboard
        </h3>
        {leaderboardUnavailable ? (
          <EmptyState
            title="Leaderboard unavailable"
            description={firebaseInitError ?? 'Set Firebase env vars to enable leaderboard.'}
          />
        ) : (
          <LeaderboardTable
            entries={entries}
            loading={leaderboardLoading}
            error={leaderboardError}
          />
        )}
      </section>

      <NameInputModal
        open={modalOpen}
        onSubmit={handleNameSubmit}
        loading={submittingName}
        error={nameError}
      />
    </main>
  )
}

export default ResultPage
