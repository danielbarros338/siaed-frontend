'use client'

import type { UpdateInclusionProfileDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateInclusionProfile(studentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateInclusionProfileDto) => classroomManagementApi.updateInclusionProfile(studentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classroomManagement.inclusionProfile(studentId) })
      toast.success('Perfil de inclusão atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível atualizar o perfil de inclusão.')
    },
  })
}
