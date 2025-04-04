import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string | null
    email: string | null
    name: string | null
  } | null
  setUser: (user: AuthState['user']) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        setUser: (user) => set({ user }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        logout: () => set({ isAuthenticated: false, user: null }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
)
