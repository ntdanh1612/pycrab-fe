import { AccountVerification } from '@/components/auth/AccountVerification'
import { AuthLayout } from '@/layouts/AuthLayout'

export default function VerifyAccountPage() {
  return (
    <AuthLayout>
      <AccountVerification />
    </AuthLayout>
  )
}
