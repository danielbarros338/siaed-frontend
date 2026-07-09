'use client'

import type { UpdateLearningDiagnosticDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type UpdateLearningDiagnosticOptions = {
  onSuccess?: () => void
}

export function useUpdateLearningDiagnostic(id: string, options?: UpdateLearningDiagnosticOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateLearningDiagnosticDto) => classroomManagementApi.updateLearningDiagnostic(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classroomManagement.learningDiagnostics.all })
      toast.success('Diagnóstico atualizado com sucesso!')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível atualizar o diagnóstico.')
    },
  })
}
