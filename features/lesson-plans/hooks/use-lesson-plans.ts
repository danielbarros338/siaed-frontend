'use client'

import type { LessonPlansListParams } from '@/features/lesson-plans/types'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useQuery } from '@tanstack/react-query'

type ListParams = Omit<LessonPlansListParams, 'teacherId'>

export function useLessonPlans(params: ListParams) {
  const { user } = useCurrentUser()
  const teacherId = user?.userId
  const hasTeacher = typeof teacherId === 'string' && teacherId.length > 0
  const requestParams: LessonPlansListParams | null = hasTeacher
    ? { teacherId, ...params }
    : null

  return useQuery({
    queryKey: queryKeys.lessonPlans.list(requestParams ?? params),
    queryFn: () => {
      if (!requestParams) {
        throw new Error('Usuário autenticado inválido para carregar planos de aula.')
      }

      return lessonPlansApi.list(requestParams)
    },
    enabled: hasTeacher,
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}
