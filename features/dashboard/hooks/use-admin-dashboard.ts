'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import { queryKeys } from '@/lib/hooks/query-keys'

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.admin(),
    queryFn: () => dashboardApi.getAdmin(),
    staleTime: 60_000,
  })
}
