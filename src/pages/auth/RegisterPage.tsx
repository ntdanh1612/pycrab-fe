import { Register } from '@/components/auth/Register'
import { AuthLayout } from '@/layouts/AuthLayout'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        <Register />
      </div>
    </AuthLayout>
  )
}
