'use client'

import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useLessonPlanDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.lessonPlans.detail(id),
    queryFn: () => lessonPlansApi.getById(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}
