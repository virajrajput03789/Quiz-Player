import { useCallback, useEffect, useState } from 'react'

interface TimerControls {
  timeLeft: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: (nextDuration?: number, autoStart?: boolean) => void
}

export const useTimer = (
  initialSeconds: number,
  onComplete: () => void,
): TimerControls => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return
    if (timeLeft <= 0) return

    const id = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => window.clearInterval(id)
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return
    setIsRunning(false)
    onComplete()
  }, [timeLeft, isRunning, onComplete])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback((nextDuration?: number, autoStart = true) => {
    setTimeLeft(nextDuration ?? initialSeconds)
    setIsRunning(autoStart)
  }, [initialSeconds])

  return { timeLeft, isRunning, start, pause, reset }
}
