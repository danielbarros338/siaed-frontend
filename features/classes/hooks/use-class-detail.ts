'use client'

import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useClassDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: () => classesApi.getById(id),
    staleTime: 120_000,
    enabled: !!id,
  })
}
