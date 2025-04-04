import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  isAuthenticated: boolean
  user: {
    id: string | null
    email: string | null
    name: string | null
  } | null
  setUser: (user: AppState['user']) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
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
        name: 'app-storage',
      }
    )
  )
) 