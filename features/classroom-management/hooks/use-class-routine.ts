'use client'

import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useClassRoutine(schoolClassId: string) {
  return useQuery({
    queryKey: queryKeys.classroomManagement.classRoutine(schoolClassId),
    queryFn: () => classroomManagementApi.getClassRoutine(schoolClassId),
    enabled: schoolClassId.length > 0,
    staleTime: 60_000,
  })
}
