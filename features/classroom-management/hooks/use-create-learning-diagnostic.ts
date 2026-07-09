'use client'

import type { CreateLearningDiagnosticDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type CreateLearningDiagnosticOptions = {
  onSuccess?: () => void
}

export function useCreateLearningDiagnostic(options?: CreateLearningDiagnosticOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateLearningDiagnosticDto) => classroomManagementApi.createLearningDiagnostic(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classroomManagement.learningDiagnostics.all })
      toast.success('Diagnóstico registrado com sucesso!')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível registrar o diagnóstico.')
    },
  })
}
