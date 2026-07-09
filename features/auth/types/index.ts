import type { UserSession } from '@/lib/types'

export interface JwtPayload {
  sub: string
  name: string
  email: string
  role: string | number
  schoolId?: string | null
  exp: number
  iat: number
}

export interface AuthState {
  user: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextValue extends AuthState {
  setUser: (user: UserSession) => void
  clearAuth: () => void
}
