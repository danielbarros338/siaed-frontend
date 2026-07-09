'use client'

import { teachingPlansApi } from '@/lib/api/teaching-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useTeachingPlanDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.teachingPlans.detail(id),
    queryFn: () => teachingPlansApi.getById(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}
