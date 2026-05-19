'use client'

import { useAuth } from '@/lib/providers/auth-provider'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()
  const { clearAuth } = useAuth()

  return function logout() {
    clearAuth()
    router.push('/login')
  }
}
