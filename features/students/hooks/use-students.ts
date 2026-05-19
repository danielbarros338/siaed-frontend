'use client'

import type { StudentsListParams } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useStudents(params: StudentsListParams) {
  return useQuery({
    queryKey: queryKeys.students.list(params),
    queryFn: () => studentsApi.list(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}
