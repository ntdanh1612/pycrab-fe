import { supabase } from './supabase'
import { AUTH_CONFIG } from '@/constants/config'
import type { User, LoginCredentials, RegisterData, PasswordResetData } from '@/types/auth'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type UserData = Database['public']['Tables']['users']['Row']

export class SupabaseAuthService {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const { email, password } = credentials

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed')
    }

    // Update last_login in users table
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)

    try {
      // Get the user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', data.user.id)
        .single()

      if (userError) {
        throw new Error('Failed to fetch user data')
      }

      // Get the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', data.user.id)
        .single()

      if (profileError) {
        throw new Error('Failed to fetch user profile')
      }

      // Store the tokens
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.session.access_token)
      if (credentials.remember) {
        localStorage.setItem(AUTH_CONFIG.refreshTokenKey, data.session.refresh_token)
      }

      return {
        token: data.session.access_token,
        user: this.mapUserAndProfileToUser(userData, profileData),
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      
      // Return minimal user data if we can't fetch the full profile
      return {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    }
  }

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    try {
      const { email, password, name } = data

      if (password !== data.passwordConfirmation) {
        throw new Error('Passwords do not match')
      }

      // Split name into first and last name
      const nameParts = name.split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null

      // Register the user with Supabase Auth
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) {
        console.error('Signup error:', error)
        throw new Error(error.message)
      }

      if (!authData.user) {
        throw new Error('Registration failed: No user data returned')
      }
      
      // If there's no session (email confirmation required), create a minimal user object
      if (!authData.session) {
        return {
          token: '',
          user: {
            id: authData.user.id,
            email: authData.user.email || '',
            name: name,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        };
      }

      // Wait for triggers to create user and profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get the user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', authData.user.id)
        .single()

      if (userError) {
        console.error('Failed to fetch user data:', userError)
        
        // If we can't get the user data, try to create it manually
        await supabase.from('users').upsert({
          id: authData.user.id,
          email: authData.user.email || '',
          password_hash: 'MANAGED_BY_SUPABASE_AUTH',
          email_verified: authData.user.email_confirmed_at !== null,
        })
      }

      // Get the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', authData.user.id)
        .single()

      if (profileError) {
        console.error('Failed to fetch profile data:', profileError)
        
        // If we can't get the profile, try to create it manually
        await supabase.from('profiles').upsert({
          id: crypto.randomUUID(),
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName || '',
          role: 'user',
        })
        
        // Try to get the profile again
        const { data: newProfileData } = await supabase
          .from('profiles')
          .select()
          .eq('user_id', authData.user.id)
          .single()
          
        if (newProfileData) {
          // Store the token
          if (authData.session) {
            localStorage.setItem(AUTH_CONFIG.tokenKey, authData.session.access_token)
          }
          
          return {
            token: authData.session?.access_token || '',
            user: {
              id: authData.user.id,
              email: authData.user.email || '',
              name: name,
              role: 'user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }
        }
      }

      // If we have both user and profile data
      if (userData && profileData) {
        // Store the token
        if (authData.session) {
          localStorage.setItem(AUTH_CONFIG.tokenKey, authData.session.access_token)
        }

        return {
          token: authData.session?.access_token || '',
          user: this.mapUserAndProfileToUser(userData, profileData),
        }
      }

      // Fallback return with minimal user data
      return {
        token: authData.session?.access_token || '',
        user: {
          id: authData.user.id,
          email: authData.user.email || '',
          name: name,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`)
      } else {
        throw new Error('Registration failed: Unknown error')
      }
    }
  }

  async logout(): Promise<void> {
    try {
      // Sign out from all sessions across all devices
      const { error } = await supabase.auth.signOut({ 
        scope: 'global' 
      })
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Purge all sessions
      await this.purgeAllSessions()
      
      // Clear browser session state
      const keysToClear = [
        AUTH_CONFIG.tokenKey,
        AUTH_CONFIG.refreshTokenKey,
        'supabase.auth.token',
        'supabase-auth-token',
        'sb-refresh-token',
        'sb-access-token',
        'supabase.auth.refreshToken',
        'supabase.auth.expiresAt',
        'auth-storage'
      ]
      
      // Clear all possible auth-related items from localStorage
      keysToClear.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.error(`Failed to remove ${key} from localStorage:`, e)
        }
      })
      
      // Force clear all supabase-related items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('supabase') || key.includes('sb-'))) {
          try {
            localStorage.removeItem(key)
          } catch (e) {
            console.error(`Failed to remove ${key} from localStorage:`, e)
          }
        }
      }
      
      // If sessionStorage is being used, clear it too
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('sb-'))) {
            sessionStorage.removeItem(key)
          }
        }
      } catch (e) {
        console.error('Error clearing sessionStorage:', e)
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Force purge all supabase sessions for the current user
   * This is a more aggressive approach to ensure no sessions remain
   */
  private async purgeAllSessions(): Promise<void> {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // If there's a session, try to purge all sessions for this user
        try {
          // This is done via sign out with global scope
          await supabase.auth.signOut({ scope: 'global' })
          
          // Additionally clear any browser storage
          window.localStorage.clear()
          try { window.sessionStorage.clear() } catch (e) {}
          
          // Attempt to clear cookies as well
          document.cookie.split(';').forEach(c => {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
          })
          
          // Specifically target Google auth cookies
          this.clearGoogleAuthCookies()
        } catch (e) {
          console.error('Error during session purging:', e)
        }
      }
    } catch (e) {
      console.error('Error getting session for purging:', e)
    }
  }

  /**
   * Clear Google authentication cookies that might prevent account selection
   */
  private clearGoogleAuthCookies(): void {
    try {
      // Common Google cookie names related to authentication
      const googleCookies = [
        'GAPS', 
        'LSID', 
        'HSID', 
        'SSID', 
        'APISID', 
        'SAPISID', 
        'S', 
        'NID', 
        '1P_JAR',
        'SIDCC',
        '__Secure-1PSID',
        '__Secure-3PSID',
        '__Secure-1PAPISID',
        '__Secure-3PAPISID',
        'OTZ'
      ]

      // Expire all possible Google cookies
      googleCookies.forEach(name => {
        document.cookie = `${name}=;expires=${new Date(0).toUTCString()};domain=.google.com;path=/`
        document.cookie = `${name}=;expires=${new Date(0).toUTCString()};domain=accounts.google.com;path=/`
        document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`
      })
      
      // Note: This may not be fully effective due to browser security constraints,
      // but it provides an additional layer of cleanup
    } catch (e) {
      console.error('Error clearing Google cookies:', e)
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async resetPassword(data: PasswordResetData): Promise<void> {
    const { password } = data

    if (password !== data.passwordConfirmation) {
      throw new Error('Passwords do not match')
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async verifyAccount(token: string): Promise<void> {
    // In Supabase, the verification is handled automatically via email links
    // This method is kept for API compatibility
    console.log('Verifying account with token', token)
  }

  async refreshToken(): Promise<{ token: string }> {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      throw new Error(error.message)
    }

    if (!data.session) {
      throw new Error('Failed to refresh token')
    }

    localStorage.setItem(AUTH_CONFIG.tokenKey, data.session.access_token)
    return { token: data.session.access_token }
  }

  getCurrentToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.tokenKey)
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentToken()
  }

  async isAdmin(): Promise<boolean> {
    try {
      // Get current user
      const { data: session } = await supabase.auth.getSession()
      
      if (!session.session) {
        return false
      }
      
      // Get profile with role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.session.user.id)
        .single()
      
      if (error || !profile) {
        return false
      }
      
      return profile.role === 'admin'
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }
  
  async getAllUsers(): Promise<User[]> {
    try {
      // First check if current user is admin
      const isAdmin = await this.isAdmin()
      
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admins can access user list')
      }
      
      // Get all user and profile data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select()
        .order('created_at', { ascending: false })
      
      if (usersError) {
        throw new Error(usersError.message)
      }
      
      // Get profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select()
      
      if (profilesError) {
        throw new Error(profilesError.message)
      }
      
      // Match users with their profiles
      const users = usersData.map(user => {
        const profile = profilesData.find(p => p.user_id === user.id)
        return profile ? this.mapUserAndProfileToUser(user, profile) : null
      }).filter(Boolean) as User[]
      
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  private mapUserAndProfileToUser(userData: UserData, profile: Profile): User {
    // Construct name from first_name and last_name
    const firstName = profile.first_name || ''
    const lastName = profile.last_name || ''
    const name = [firstName, lastName].filter(Boolean).join(' ') || 'Unnamed User'
    
    return {
      id: userData.id,
      email: userData.email,
      name,
      avatar: profile.avatar_url || undefined,
      role: profile.role as 'user' | 'admin',
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    }
  }
  
  /**
   * Handle the OAuth callback after a user authenticates with a social provider
   * This should be called on the /auth/callback route
   */
  async handleAuthCallback(): Promise<{ user: User | null; session: boolean }> {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('No session found in callback:', sessionError)
        return { user: null, session: false }
      }
      
      // User is now authenticated, fetch additional data
      const userId = session.user.id
      
      // Get the user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single()
        
      if (userError) {
        console.error('Failed to fetch user data in callback:', userError)
        // Try to create the user data if it doesn't exist
        await supabase.from('users').upsert({
          id: userId,
          email: session.user.email || '',
          password_hash: 'MANAGED_BY_SUPABASE_AUTH',
          email_verified: session.user.email_confirmed_at !== null,
          active: true,
        })
      }
      
      // Get or create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', userId)
        .single()
        
      if (profileError) {
        console.error('Failed to fetch profile in callback:', profileError)
        
        // Extract name from user metadata
        let firstName = ''
        let lastName = ''
        
        if (session.user.user_metadata && session.user.user_metadata.full_name) {
          const nameParts = session.user.user_metadata.full_name.split(' ')
          firstName = nameParts[0]
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
        }
        
        // Create a new profile
        await supabase.from('profiles').upsert({
          id: crypto.randomUUID(),
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          role: 'user',
        })
        
        // Try to get the profile again
        const { data: newProfileData } = await supabase
          .from('profiles')
          .select()
          .eq('user_id', userId)
          .single()
          
        if (newProfileData) {
          // We have a profile now
          return {
            user: this.mapUserAndProfileToUser(
              userData || {
                id: userId,
                email: session.user.email || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                email_verified: true,
                active: true,
              } as UserData,
              newProfileData
            ),
            session: true
          }
        }
      }
      
      // If we have all the data, map to user model
      if (profileData) {
        return {
          user: this.mapUserAndProfileToUser(
            userData || {
              id: userId,
              email: session.user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              email_verified: true,
              active: true,
            } as UserData,
            profileData
          ),
          session: true
        }
      }
      
      // Fallback with minimal user data
      return {
        user: {
          id: userId,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        session: true
      }
    } catch (error) {
      console.error('Error handling auth callback:', error)
      return { user: null, session: false }
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService()
