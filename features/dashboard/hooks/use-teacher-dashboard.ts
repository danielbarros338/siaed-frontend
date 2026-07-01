'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import { queryKeys } from '@/lib/hooks/query-keys'
import type { DateFilterPeriod } from '@/lib/types/dashboard'

export function useTeacherDashboard(period: DateFilterPeriod) {
  return useQuery({
    queryKey: queryKeys.dashboard.teacher(period),
    queryFn: () => dashboardApi.getTeacher(period),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}
