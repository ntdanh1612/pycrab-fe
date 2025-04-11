import { Login } from '@/components/auth/Login'
import { AuthLayout } from '@/layouts/AuthLayout'
import { useLocation } from 'react-router-dom'

export default function LoginPage() {
  const location = useLocation()
  const message = location.state?.message

  return (
    <AuthLayout>
      <div className="space-y-6">
        {message && (
          <div className="bg-white text-foreground p-4 rounded-md text-sm mb-4 border border-accent/30">
            {message}
          </div>
        )}
        <Login />
      </div>
    </AuthLayout>
  )
}
