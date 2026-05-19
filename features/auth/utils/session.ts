import type { JwtPayload } from '@/features/auth/types'
import type { AuthResponse, UserSession } from '@/lib/types'
import { setAuthCookie } from './cookie'

const SESSION_KEY = 'siaed_user'

export function getStoredUser(): UserSession | null {
  if (typeof window === 'undefined') return null

  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as UserSession
  } catch {
    return null
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === 'undefined') return

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return

  sessionStorage.removeItem(SESSION_KEY)
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    // Adicionar padding se necessário
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    const decoded = atob(padded)
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

export function persistSession(
  response: AuthResponse,
  setUser: (user: UserSession) => void,
): void {
  const user: UserSession = {
    userId: response.userId,
    name: response.name,
    email: response.email,
    role: response.role,
  }

  setAuthCookie(response.token)
  setStoredUser(user)
  setUser(user)
}
