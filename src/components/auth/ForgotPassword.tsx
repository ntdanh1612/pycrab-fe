import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function ForgotPassword() {
  const { forgotPassword, loading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      // Error is handled by the store
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full bg-white border-accent/20 shadow-lg">
        <CardHeader className="space-y-1 border-b border-accent/10 bg-white">
          <CardTitle className="text-2xl font-bold text-primary">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We have sent password reset instructions to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="mb-4 bg-white border-accent/30">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            <AlertDescription className="text-foreground">
              If an account exists with this email, you'll receive instructions to reset your
              password.
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground mb-4">
            If you don't see the email, please check your spam folder or request another reset link.
          </p>

          <Button
            variant="outline"
            className="w-full bg-white border-accent/20 hover:bg-accent/10 hover:border-primary/30 transition-all"
            onClick={() => setIsSubmitted(false)}
          >
            Try another email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white border-accent/20 shadow-lg">
      <CardHeader className="space-y-1 border-b border-accent/10 bg-white">
        <CardTitle className="text-2xl font-bold text-primary">Forgot Password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={handleChange}
              required
              className="bg-white border-accent/20 focus:border-primary/30"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 p-6 pt-0 border-t border-accent/10 mt-2">
        <div className="text-sm text-center text-muted-foreground">
          Remember your password?{' '}
          <Link to="/login" className="text-secondary hover:text-primary transition-colors">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
