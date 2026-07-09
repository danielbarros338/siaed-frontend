'use client'

import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useQuery } from '@tanstack/react-query'

export function useTeacherClassesForSelect() {
  const { user } = useCurrentUser()
  const teacherId = user?.userId
  const hasTeacher = typeof teacherId === 'string' && teacherId.length > 0

  return useQuery({
    queryKey: queryKeys.classes.list({ teacherId, pageSize: 100 }),
    queryFn: () => classesApi.list({ teacherId, pageSize: 100 }),
    enabled: hasTeacher,
    staleTime: 300_000,
  })
}
