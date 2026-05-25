'use client'

import { reportsApi } from '@/lib/api/reports'
import { queryKeys } from '@/lib/hooks/query-keys'
import type { ReportsListParams } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'

export function useReports(params: ReportsListParams) {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => reportsApi.list(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
    enabled: !!params.userId,
  })
}
