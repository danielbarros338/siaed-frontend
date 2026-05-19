'use client'

import { persistSession } from '@/features/auth/utils/session'
import { authApi, extractApiErrors } from '@/lib/api/auth'
import { useAuth } from '@/lib/providers/auth-provider'
import type { LoginDto } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const router = useRouter()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: (response) => {
      persistSession(response, setUser)
      router.push('/dashboard')
    },
    onError: () => {
      // errors are exposed via mutation.error — handled in the form component
    },
  })
}

export { extractApiErrors }

