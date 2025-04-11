import { supabaseAuthService } from './auth.supabase'

// Export the Supabase implementation directly
export const authService = supabaseAuthService

// Keep the original code as comments for reference
/*
import { apiService } from './api'
import { AUTH_CONFIG } from '@/constants/config'
import type { ApiResponse } from '@/types'
import type { User, LoginCredentials, RegisterData, PasswordResetData } from '@/types/auth'

export class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await apiService.post<{ token: string; user: User }>(
      '/auth/login',
      credentials
    )

    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem(AUTH_CONFIG.tokenKey, response.data.token)
    }

    return response
  }

  async register(data: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await apiService.post<{ token: string; user: User }>('/auth/register', data)

    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem(AUTH_CONFIG.tokenKey, response.data.token)
    }

    return response
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      // Silent fail on logout errors
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem(AUTH_CONFIG.tokenKey)
      localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/forgot-password', { email })
  }

  async resetPassword(data: PasswordResetData): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/reset-password', data)
  }

  async verifyAccount(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`/auth/verify`, { token })
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
    const response = await apiService.post<{ token: string }>('/auth/refresh-token', {
      refreshToken,
    })

    if (response.data.token) {
      localStorage.setItem(AUTH_CONFIG.tokenKey, response.data.token)
    }

    return response
  }

  getCurrentToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.tokenKey)
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentToken()
  }
}

export const authService = new AuthService()
*/
