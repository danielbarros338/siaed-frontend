'use client'

import type { UpdateGroupDynamicsDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateGroupDynamics(schoolClassId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateGroupDynamicsDto) => classroomManagementApi.updateGroupDynamics(schoolClassId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classroomManagement.groupDynamics(schoolClassId) })
      toast.success('Dinâmica de grupo atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível atualizar a dinâmica de grupo.')
    },
  })
}
