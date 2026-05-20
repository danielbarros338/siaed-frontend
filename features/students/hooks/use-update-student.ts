'use client'

import type { UpdateStudentDto } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UseUpdateStudentOptions {
  redirectOnSuccess?: boolean
  showSuccessToast?: boolean
}

export function useUpdateStudent(id: string, options?: UseUpdateStudentOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const redirectOnSuccess = options?.redirectOnSuccess ?? true
  const showSuccessToast = options?.showSuccessToast ?? true

  return useMutation({
    mutationFn: (dto: UpdateStudentDto) => studentsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      if (showSuccessToast) {
        toast.success('Dados do aluno atualizados com sucesso!')
      }
      if (redirectOnSuccess) {
        router.push(`/students/${id}`)
      }
    },
  })
}
