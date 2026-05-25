'use client'

import { reportsApi } from '@/lib/api/reports'
import { queryKeys } from '@/lib/hooks/query-keys'
import type { GenerateReportDto } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useGenerateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: GenerateReportDto) => reportsApi.generate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
