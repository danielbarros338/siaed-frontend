'use client'

import type { UpdateLessonPlanRequest } from '@/features/lesson-plans/types'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useUpdateLessonPlan(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: UpdateLessonPlanRequest) => lessonPlansApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.all })
      toast.success('Plano de aula atualizado com sucesso!')
      router.push(`/lesson-plans/${id}`)
    },
    onError: (error) => {
      toast.error(extractLessonPlanErrors(error)[0] ?? 'Não foi possível atualizar o plano de aula.')
    },
  })
}
