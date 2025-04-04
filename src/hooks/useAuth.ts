import { useCallback } from 'react'
import { useAppStore } from '@/stores/store'
import { AUTH_CONFIG } from '@/constants/config'

export const useAuth = () => {
  const { isAuthenticated, user, setUser, setAuthenticated, logout: storeLogout } = useAppStore()

  const login = useCallback(
    (token: string, userData: typeof user) => {
      localStorage.setItem(AUTH_CONFIG.tokenKey, token)
      setUser(userData)
      setAuthenticated(true)
    },
    [setUser, setAuthenticated]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.tokenKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    storeLogout()
  }, [storeLogout])

  return {
    isAuthenticated,
    user,
    login,
    logout,
  }
}
