'use client'

import type { UpdateClassRoutineDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateClassRoutine(schoolClassId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateClassRoutineDto) => classroomManagementApi.updateClassRoutine(schoolClassId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classroomManagement.classRoutine(schoolClassId) })
      toast.success('Rotina e combinados atualizados com sucesso!')
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível atualizar a rotina da turma.')
    },
  })
}
