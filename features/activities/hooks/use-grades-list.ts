'use client'

import type { GradesListParams } from '@/features/activities/types/grades'
import { gradesApi } from '@/lib/api/grades'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useGradesList(params: GradesListParams) {
  return useQuery({
    queryKey: queryKeys.grades.list(params),
    queryFn: () => gradesApi.list(params),
    enabled: !!params.activityId,
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}
