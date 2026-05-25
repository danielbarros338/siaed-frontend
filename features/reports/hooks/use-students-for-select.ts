'use client'

import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useQuery } from '@tanstack/react-query'

export function useStudentsForSelect() {
  const { user } = useCurrentUser()
  return useQuery({
    queryKey: queryKeys.students.list({ pageSize: 200 }),
    queryFn: () => studentsApi.list({ pageSize: 200 }),
    staleTime: 300_000,
    enabled: !!user,
  })
}
