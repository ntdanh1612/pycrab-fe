import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            // TODO: Implement actual API call
            const mockUser = { id: '1', email, name: 'Test User' }
            set({ user: mockUser, isAuthenticated: true, isLoading: false })
          } catch (error) {
            set({ error: 'Login failed', isLoading: false })
          }
        },

        logout: () => {
          set({ user: null, token: null, isAuthenticated: false })
        },

        setUser: (user: User) => {
          set({ user, isAuthenticated: true })
        },

        setError: (error: string | null) => {
          set({ error })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    )
  )
) 