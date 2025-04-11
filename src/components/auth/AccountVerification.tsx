import { useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export function AccountVerification() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { verifyAccount, error, loading } = useAuthStore()

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await verifyAccount(token)
          setVerificationStatus('success')
        } catch (error) {
          setVerificationStatus('error')
        }
      }

      verify()
    } else {
      setVerificationStatus('error')
    }
  }, [token, verifyAccount])

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verifying Account</CardTitle>
          <CardDescription>Please wait while we verify your account</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (verificationStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Account Verified</CardTitle>
          <CardDescription>Your account has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Your email has been confirmed and your account is now active.
            </AlertDescription>
          </Alert>

          <Button className="w-full" onClick={() => navigate('/login')}>
            Sign in to your account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
        <CardDescription>We couldn't verify your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'The verification link is invalid or has expired.'}
          </AlertDescription>
        </Alert>

        <p className="text-sm text-muted-foreground mb-4">
          Please contact support or try signing in to request a new verification link.
        </p>

        <Button className="w-full" onClick={() => navigate('/login')}>
          Back to Sign In
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Need help?{' '}
          <Link to="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
