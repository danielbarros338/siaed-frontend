'use client'

import type { ActivitiesListParams } from '@/features/activities/types'
import { activitiesApi } from '@/lib/api/activities'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useQuery } from '@tanstack/react-query'

type ListParams = Omit<ActivitiesListParams, 'teacherId'>

export function useActivities(params: ListParams) {
  const { user } = useCurrentUser()
  const teacherId = user?.userId
  const hasTeacher = typeof teacherId === 'string' && teacherId.length > 0
  const requestParams: ActivitiesListParams | null = hasTeacher
    ? { teacherId, ...params }
    : null

  return useQuery({
    queryKey: queryKeys.activities.list(requestParams ?? params),
    queryFn: () => {
      if (!requestParams) {
        throw new Error('Usuario autenticado invalido para carregar atividades.')
      }

      return activitiesApi.list(requestParams)
    },
    enabled: hasTeacher,
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}

