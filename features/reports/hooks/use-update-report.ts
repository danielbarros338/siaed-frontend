'use client'

import { reportsApi } from '@/lib/api/reports'
import { queryKeys } from '@/lib/hooks/query-keys'
import type { UpdateReportDto } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateReport(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateReportDto) => reportsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(id) })
    },
  })
}
