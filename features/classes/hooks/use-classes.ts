'use client'

import type { ClassesListParams } from '@/features/classes/types'
import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useClasses(params: ClassesListParams) {
  return useQuery({
    queryKey: queryKeys.classes.list(params),
    queryFn: () => classesApi.list(params),
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}
