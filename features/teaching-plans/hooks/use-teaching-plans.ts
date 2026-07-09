'use client'

import type { TeachingPlansListParams } from '@/features/teaching-plans/types'
import { teachingPlansApi } from '@/lib/api/teaching-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useQuery } from '@tanstack/react-query'

type ListParams = Omit<TeachingPlansListParams, 'authorId'>

export function useTeachingPlans(params: ListParams) {
  const { user } = useCurrentUser()
  const authorId = user?.userId
  const hasAuthor = typeof authorId === 'string' && authorId.length > 0
  const requestParams: TeachingPlansListParams | null = hasAuthor
    ? { authorId, ...params }
    : null

  return useQuery({
    queryKey: queryKeys.teachingPlans.list(requestParams ?? params),
    queryFn: () => {
      if (!requestParams) {
        throw new Error('Usuário autenticado inválido para carregar planos de ensino.')
      }

      return teachingPlansApi.list(requestParams)
    },
    enabled: hasAuthor,
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}
