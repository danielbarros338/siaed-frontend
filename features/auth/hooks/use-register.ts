'use client'

import { persistSession } from '@/features/auth/utils/session'
import { authApi, extractApiErrors } from '@/lib/api/auth'
import { useAuth } from '@/lib/providers/auth-provider'
import type { RegisterDto } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useRegister() {
  const router = useRouter()
  const { setUser } = useAuth()

  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
    onSuccess: (response) => {
      persistSession(response, setUser)
      router.push('/register/success')
    },
    onError: () => {
      // errors are exposed via mutation.error — handled in the form component
    },
  })
}

export { extractApiErrors }

