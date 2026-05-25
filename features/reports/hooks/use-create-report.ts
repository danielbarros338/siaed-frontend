'use client'

import { reportsApi } from '@/lib/api/reports'
import { queryKeys } from '@/lib/hooks/query-keys'
import type { CreateReportDto } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateReportDto) => reportsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
