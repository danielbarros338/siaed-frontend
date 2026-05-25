'use client'

import { gradesApi } from '@/lib/api/grades'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useGradeDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.grades.detail(id),
    queryFn: () => gradesApi.getById(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}
