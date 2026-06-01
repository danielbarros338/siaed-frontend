'use client'

import type { AuthContextValue, AuthState } from '@/features/auth/types'
import { clearAuthCookie, getTokenFromCookie } from '@/features/auth/utils/cookie'
import { clearStoredUser, decodeJwtPayload, getStoredUser, setStoredUser } from '@/features/auth/utils/session'
import type { UserSession } from '@/lib/types'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<AuthContextValue | null>(null)

function resolveInitialAuthState(): AuthState {
  const token = getTokenFromCookie()
  if (!token) {
    return { user: null, isAuthenticated: false, isLoading: false }
  }

  const payload = decodeJwtPayload(token)
  if (!payload || payload.exp < Date.now() / 1000) {
    return { user: null, isAuthenticated: false, isLoading: false }
  }

  const stored = getStoredUser()
  if (stored) {
    return { user: stored, isAuthenticated: true, isLoading: false }
  }

  const user: UserSession = {
    userId: payload.sub,
    name: payload.name ?? '',
    email: payload.email ?? '',
    role: Number(payload.role) as UserSession['role'],
  }

  return { user, isAuthenticated: true, isLoading: false }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(resolveInitialAuthState)

  const setUser = useCallback((user: UserSession) => {
    setState({ user, isAuthenticated: true, isLoading: false })
  }, [])

  const clearAuth = useCallback(() => {
    clearAuthCookie()
    clearStoredUser()
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  useEffect(() => {
    const token = getTokenFromCookie()
    const payload = token ? decodeJwtPayload(token) : null
    const isValid = Boolean(payload && payload.exp >= Date.now() / 1000)

    if (!isValid) {
      clearAuthCookie()
      clearStoredUser()
      return
    }

    if (state.user && !getStoredUser()) {
      setStoredUser(state.user)
    }
  }, [state.user])

  const value: AuthContextValue = {
    ...state,
    setUser,
    clearAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return context
}
