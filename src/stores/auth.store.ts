import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { authService } from '@/services/auth.service'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string, passwordConfirmation: string) => Promise<void>
  verifyAccount: (token: string) => Promise<void>
  handleAuthCallback: () => Promise<boolean>
  setUser: (user: User | null) => void
  clearError: () => void
  resetStore: () => void
}

// Initial state for the store
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        login: async (credentials) => {
          set({ loading: true, error: null })
          try {
            const response = await authService.login(credentials)
            set({
              isAuthenticated: true,
              user: response.user,
              loading: false,
            })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            })
            throw error
          }
        },

        register: async (data) => {
          set({ loading: true, error: null })
          try {
            const response = await authService.register(data)
            
            // Check if we got a token back (indicates successful auth)
            if (response.token) {
              set({
                isAuthenticated: true,
                user: response.user,
                loading: false,
              })
            } else {
              // Registration succeeded but requires email confirmation
              set({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: "Registration successful! Please check your email to verify your account before logging in."
              })
            }
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Registration failed',
            })
            throw error
          }
        },

        logout: async () => {
          set({ loading: true })
          try {
            await authService.logout()
            
            // Call resetStore to fully clear all state
            get().resetStore()
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Logout failed',
            })
          }
        },

        forgotPassword: async (email) => {
          set({ loading: true, error: null })
          try {
            await authService.forgotPassword(email)
            set({ loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Password reset request failed',
            })
            throw error
          }
        },

        resetPassword: async (token, password, passwordConfirmation) => {
          set({ loading: true, error: null })
          try {
            await authService.resetPassword({ token, password, passwordConfirmation })
            set({ loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Password reset failed',
            })
            throw error
          }
        },

        verifyAccount: async (token) => {
          set({ loading: true, error: null })
          try {
            await authService.verifyAccount(token)
            set({ loading: false })
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Account verification failed',
            })
            throw error
          }
        },
        
        handleAuthCallback: async () => {
          set({ loading: true, error: null })
          try {
            // @ts-expect-error - We know this method exists in our Supabase implementation
            const { user, session } = await authService.handleAuthCallback()
            
            if (session && user) {
              set({
                isAuthenticated: true,
                user,
                loading: false,
              })
              return true
            } else {
              set({
                loading: false,
                error: 'Authentication failed',
              })
              return false
            }
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Authentication failed',
            })
            return false
          }
        },

        setUser: (user) => set({ user, isAuthenticated: !!user }),

        clearError: () => set({ error: null }),

        resetStore: () => {
          // Reset to initial state
          set(initialState)
          
          // Clear any persisted auth state from localStorage
          try {
            localStorage.removeItem('auth-storage')
            
            // Look for any auth-related keys that might be lingering
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              if (key && (key?.includes('auth') || key?.includes('supabase'))) {
                localStorage.removeItem(key)
              }
            }
          } catch (error) {
            console.error('Error clearing persisted auth state:', error)
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }),
      }
    )
  )
)
