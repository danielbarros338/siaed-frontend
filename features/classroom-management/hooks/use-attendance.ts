'use client'

import type { AttendanceListParams } from '@/features/classroom-management/types'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useAttendance(params: AttendanceListParams) {
  return useQuery({
    queryKey: queryKeys.classroomManagement.attendance(params),
    queryFn: () => classroomManagementApi.listAttendance(params),
    enabled: params.schoolClassId.length > 0 && params.date.length > 0,
    staleTime: 30_000,
  })
}
