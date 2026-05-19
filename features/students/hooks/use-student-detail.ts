'use client'

import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useStudentDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentsApi.getById(id),
    staleTime: 120_000,
    enabled: !!id,
  })
}
