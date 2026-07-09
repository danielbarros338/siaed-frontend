'use client'

import type { BulkUpsertAttendanceDto } from '@/features/classroom-management/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpsertAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: BulkUpsertAttendanceDto) => classroomManagementApi.upsertAttendance(dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.classroomManagement.attendance({
          schoolClassId: variables.schoolClassId,
          date: variables.date,
        }),
      })
      toast.success('Frequência registrada com sucesso!')
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível registrar a frequência.')
    },
  })
}
