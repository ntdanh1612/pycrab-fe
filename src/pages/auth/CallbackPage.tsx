import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Loader2 } from 'lucide-react'

export function CallbackPage() {
  const navigate = useNavigate()
  const { handleAuthCallback, error } = useAuthStore()
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const processAuth = async () => {
      try {
        const success = await handleAuthCallback()
        if (success) {
          setStatus('Authentication successful! Redirecting...')
          setTimeout(() => {
            navigate('/dashboard')
          }, 1000)
        } else {
          setStatus('Authentication failed. Redirecting to login...')
          setTimeout(() => {
            navigate('/login')
          }, 2000)
        }
      } catch (err) {
        console.error('Error in auth callback:', err)
        setStatus('Authentication error. Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    }

    processAuth()
  }, [handleAuthCallback, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-lg border border-accent/20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold text-center text-primary mb-2">Completing Sign In</h1>
        <p className="text-center text-muted-foreground">{status}</p>
        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded">{error}</div>
        )}
      </div>
    </div>
  )
}
