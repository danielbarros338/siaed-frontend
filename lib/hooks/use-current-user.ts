'use client'

import { useAuth } from '@/lib/providers/auth-provider'

export function useCurrentUser() {
  const { user, isAuthenticated } = useAuth()
  return { user, isAuthenticated }
}
