'use client'

import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useInclusionProfile(studentId: string) {
  return useQuery({
    queryKey: queryKeys.classroomManagement.inclusionProfile(studentId),
    queryFn: () => classroomManagementApi.getInclusionProfile(studentId),
    enabled: studentId.length > 0,
    staleTime: 60_000,
  })
}
