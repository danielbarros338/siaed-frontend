'use client'

import type { AuthContextValue, AuthState } from '@/features/auth/types'
import { clearAuthCookie, getTokenFromCookie } from '@/features/auth/utils/cookie'
import { clearStoredUser, decodeJwtPayload, getStoredUser, setStoredUser } from '@/features/auth/utils/session'
import type { UserSession } from '@/lib/types'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

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

    if (!token) {
      // Cenário 4: sem cookie → unauthenticated
      setState({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    // Verificar expiração via JWT payload
    const payload = decodeJwtPayload(token)
    if (payload && payload.exp < Date.now() / 1000) {
      // Cenário 3: cookie + expirado → clearAuth
      clearAuth()
      return
    }

    // Tentar restaurar de sessionStorage (fast path)
    const stored = getStoredUser()
    if (stored) {
      // Cenário 1: cookie + sessionStorage → fast path
      setState({ user: stored, isAuthenticated: true, isLoading: false })
      return
    }

    // Cenário 2: cookie + sem sessionStorage → decodificar JWT
    if (payload) {
      const user: UserSession = {
        userId: payload.sub,
        name: payload.name ?? '',
        email: payload.email ?? '',
        role: (Number(payload.role) as UserSession['role']),
      }
      setStoredUser(user)
      setState({ user, isAuthenticated: true, isLoading: false })
    } else {
      // Token inválido
      clearAuth()
    }
  }, [clearAuth])

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
