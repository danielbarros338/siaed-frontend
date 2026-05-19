'use client'

import type { ReactivateStudentDto } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseReactivateStudentOptions {
  onClose?: () => void
}

export function useReactivateStudent(id: string, options?: UseReactivateStudentOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: ReactivateStudentDto) => studentsApi.reactivate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      toast.success('Aluno reativado com sucesso!')
      options?.onClose?.()
    },
  })
}
