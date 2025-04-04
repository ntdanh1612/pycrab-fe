// Common types used across the application
export type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ErrorResponse = {
  message: string
  code: string
  status: number
}
