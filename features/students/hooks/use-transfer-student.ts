'use client'

import type { TransferStudentDto } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseTransferStudentOptions {
  onClose?: () => void
}

export function useTransferStudent(id: string, options?: UseTransferStudentOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: TransferStudentDto) => studentsApi.transfer(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      toast.success('Aluno transferido com sucesso!')
      options?.onClose?.()
    },
  })
}
