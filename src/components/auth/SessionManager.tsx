import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { Toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

// Session idle timeout in milliseconds (30 minutes)
const IDLE_TIMEOUT = 30 * 60 * 1000

// Warning before session expires in milliseconds (5 minutes before timeout)
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000

export function SessionManager() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore()
  const [showWarning, setShowWarning] = useState(false)
  const [idleTime, setIdleTime] = useState(0)
  const [warningInterval, setWarningInterval] = useState<NodeJS.Timeout | null>(null)

  // Reset the idle timer when user activity is detected
  const resetIdleTimer = () => {
    setIdleTime(0)
    setShowWarning(false)

    if (warningInterval) {
      clearInterval(warningInterval)
      setWarningInterval(null)
    }
  }

  // Set up event listeners for user activity
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'keypress', 'scroll', 'touchstart']

    // Add event listeners to reset the idle timer
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    // Set up the idle timer
    const idleInterval = setInterval(() => {
      setIdleTime((prevIdleTime) => {
        const newIdleTime = prevIdleTime + 1000

        // Show warning when approaching timeout
        if (newIdleTime >= IDLE_TIMEOUT - WARNING_BEFORE_TIMEOUT && !showWarning) {
          setShowWarning(true)

          // Start a countdown for the remaining time
          const countdownInterval = setInterval(() => {
            const remainingTime = IDLE_TIMEOUT - (idleTime + 1000)

            if (remainingTime <= 0) {
              clearInterval(countdownInterval)
              handleSessionTimeout()
            }
          }, 1000)

          setWarningInterval(countdownInterval)
        }

        // If idle time exceeds timeout, log the user out
        if (newIdleTime >= IDLE_TIMEOUT) {
          handleSessionTimeout()
          return 0
        }

        return newIdleTime
      })
    }, 1000)

    // Clean up event listeners and intervals
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer)
      })

      clearInterval(idleInterval)

      if (warningInterval) {
        clearInterval(warningInterval)
      }
    }
  }, [isAuthenticated, showWarning, idleTime, warningInterval])

  // Handle session timeout
  const handleSessionTimeout = async () => {
    await logout()
    navigate('/login', {
      state: { message: 'Your session has expired. Please sign in again.' },
    })
  }

  // Continue the session
  const continueSession = () => {
    resetIdleTimer()
  }

  if (!isAuthenticated || !showWarning) {
    return null
  }

  // Calculate minutes and seconds remaining
  const remainingTime = IDLE_TIMEOUT - idleTime
  const minutes = Math.floor(remainingTime / 60000)
  const seconds = Math.floor((remainingTime % 60000) / 1000)

  return (
    <Toast
      open={showWarning}
      onOpenChange={setShowWarning}
      title="Session Expiring Soon"
      description={`Your session will expire in ${minutes}:${seconds < 10 ? '0' : ''}${seconds} minutes due to inactivity.`}
      action={
        <Button size="sm" onClick={continueSession}>
          Continue Session
        </Button>
      }
    />
  )
}
