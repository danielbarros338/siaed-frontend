'use client'

import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useArchiveLessonPlan(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lessonPlansApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.all })
      toast.success('Plano de aula arquivado com sucesso!')
    },
    onError: (error) => {
      toast.error(extractLessonPlanErrors(error)[0] ?? 'Não foi possível arquivar o plano de aula.')
    },
  })
}
