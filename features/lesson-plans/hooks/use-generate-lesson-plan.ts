'use client'

import type { GenerateLessonPlanRequest } from '@/features/lesson-plans/types'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useGenerateLessonPlan() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: GenerateLessonPlanRequest) => lessonPlansApi.generate(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.all })
      toast.success('Plano de aula gerado com sucesso!')
      router.push(`/lesson-plans/${data.id}`)
    },
    onError: (error) => {
      toast.error(extractLessonPlanErrors(error)[0] ?? 'Não foi possível gerar o plano de aula.')
    },
  })
}
