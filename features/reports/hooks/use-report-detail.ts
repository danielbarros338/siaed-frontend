'use client'

import { reportsApi } from '@/lib/api/reports'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useReportDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => reportsApi.getById(id),
    enabled: !!id,
  })
}
