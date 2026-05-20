'use client'

import { activitiesApi } from '@/lib/api/activities'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useActivityDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.activities.detail(id),
    queryFn: () => activitiesApi.getById(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

