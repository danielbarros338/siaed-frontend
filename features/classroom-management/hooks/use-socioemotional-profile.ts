'use client'

import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useSocioemotionalProfile(studentId: string) {
  return useQuery({
    queryKey: queryKeys.classroomManagement.socioemotionalProfile(studentId),
    queryFn: () => classroomManagementApi.getSocioemotionalProfile(studentId),
    enabled: studentId.length > 0,
    staleTime: 60_000,
  })
}
