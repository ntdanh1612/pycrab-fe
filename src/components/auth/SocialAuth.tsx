import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/services/supabase'
import type { SocialAuthProvider } from '@/types/auth'

const socialProviders: SocialAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z',
  },
]

export function SocialAuth() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialLogin = async (providerId: string) => {
    setLoading(providerId)

    try {
      const options = {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {},
      }

      // Add prompt=select_account for Google to force account selection
      if (providerId === 'google') {
        options.queryParams = {
          prompt: 'select_account',
        }
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: providerId as never,
        options: options,
      })

      if (error) {
        throw error
      }

      // Note: No need to navigate here as Supabase handles the redirect flow
      // The user will be redirected to the OAuth provider and then back to our callback URL
    } catch (error) {
      console.error('Social login error:', error)
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {socialProviders.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          type="button"
          disabled={loading !== null}
          onClick={() => handleSocialLogin(provider.id)}
          className="flex items-center justify-center gap-2 bg-white border-accent/20 hover:bg-accent/10 hover:border-primary/30 h-11 transition-all"
        >
          {loading === provider.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 512 512" className="fill-current">
              <path d={provider.icon} />
            </svg>
          )}
          {provider.name}
        </Button>
      ))}
    </div>
  )
}
