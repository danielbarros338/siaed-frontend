'use client'

import type { DeactivateStudentDto } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseDeactivateStudentOptions {
  onClose?: () => void
}

export function useDeactivateStudent(id: string, options?: UseDeactivateStudentOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: DeactivateStudentDto) => studentsApi.deactivate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      toast.success('Status do aluno atualizado com sucesso!')
      options?.onClose?.()
    },
  })
}
