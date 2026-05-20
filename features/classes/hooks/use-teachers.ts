'use client'

import { teachersApi } from '@/lib/api/teachers'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useTeachers() {
  return useQuery({
    queryKey: queryKeys.teachers.list({ scope: 'all' }),
    queryFn: () => teachersApi.listAll(),
    staleTime: 300_000,
  })
}
