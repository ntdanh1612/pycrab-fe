export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  acceptTerms: boolean
}

export interface PasswordResetData {
  token: string
  password: string
  passwordConfirmation: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
}

export interface SocialAuthProvider {
  id: string
  name: string
  icon: string
}
