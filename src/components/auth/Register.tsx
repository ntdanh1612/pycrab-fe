import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { SocialAuth } from './SocialAuth'

export function Register() {
  const navigate = useNavigate()
  const { register, error, loading, clearError } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    acceptTerms: false,
  })

  const [formErrors, setFormErrors] = useState<{
    password?: string
    passwordConfirmation?: string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear form errors when typing
    if (name === 'password' || name === 'passwordConfirmation') {
      setFormErrors({})
    }

    if (error) clearError()
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }))
  }

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {}

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.passwordConfirmation) {
      errors.passwordConfirmation = 'Passwords do not match'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await register(formData)
      // Only navigate to dashboard if user was authenticated
      const { isAuthenticated } = useAuthStore.getState()
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true })
      }
      // If not authenticated, the error message about email verification will be displayed
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <Card className="w-full bg-white border-accent/20 shadow-lg">
      <CardHeader className="space-y-1 border-b border-accent/10 bg-white">
        <CardTitle className="text-2xl font-bold text-primary">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert
            variant={error.includes('successful') ? 'default' : 'destructive'}
            className={`mb-4 ${error.includes('successful') ? 'bg-blue-50 text-blue-800 border-blue-200' : ''}`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white border-accent/20 focus:border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-white border-accent/20 focus:border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-white border-accent/20 focus:border-primary/30"
            />
            {formErrors.password && (
              <p className="text-sm text-destructive">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation" className="text-foreground/80">
              Confirm Password
            </Label>
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              required
              className="bg-white border-accent/20 focus:border-primary/30"
            />
            {formErrors.passwordConfirmation && (
              <p className="text-sm text-destructive">{formErrors.passwordConfirmation}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={handleCheckboxChange}
              required
              className="text-secondary border-accent/30 data-[state=checked]:bg-secondary"
            />
            <Label htmlFor="acceptTerms" className="text-sm text-foreground/70">
              I agree to the{' '}
              <Link to="/terms" className="text-secondary hover:text-primary transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-secondary hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 p-6 pt-0 border-t border-accent/10 mt-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-accent/10"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        <SocialAuth />

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-primary transition-colors">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
