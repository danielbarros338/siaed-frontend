'use client'

import type { UpdateSocioemotionalProfileDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateSocioemotionalProfile(studentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateSocioemotionalProfileDto) =>
      classroomManagementApi.updateSocioemotionalProfile(studentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classroomManagement.socioemotionalProfile(studentId) })
      toast.success('Perfil socioemocional atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível atualizar o perfil socioemocional.')
    },
  })
}
