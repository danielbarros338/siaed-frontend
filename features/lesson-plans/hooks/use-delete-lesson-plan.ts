'use client'

import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type DeleteOptions = {
  onSuccess?: () => void
}

export function useDeleteLessonPlan(id: string, options?: DeleteOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => lessonPlansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.all })
      toast.success('Plano de aula excluído com sucesso!')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(extractLessonPlanErrors(error)[0] ?? 'Não foi possível excluir o plano de aula.')
    },
  })
}
