'use client'

import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useClassesForSelect() {
  return useQuery({
    queryKey: queryKeys.classes.list({ pageSize: 100 }),
    queryFn: () => classesApi.list({ pageSize: 100 }),
    staleTime: 300_000,
  })
}
