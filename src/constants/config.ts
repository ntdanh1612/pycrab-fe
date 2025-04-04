export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const APP_CONFIG = {
  name: 'Gift & Souvenir Shop',
  description: 'Your one-stop shop for unique gifts and souvenirs',
  version: '1.0.0',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr'],
  itemsPerPage: 12,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  contactEmail: 'support@giftshop.com',
} as const

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const
