'use client'

import type { CreateLessonPlanRequest } from '@/features/lesson-plans/types'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { lessonPlansApi } from '@/lib/api/lesson-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useCreateLessonPlan() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: CreateLessonPlanRequest) => lessonPlansApi.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessonPlans.all })
      toast.success('Plano de aula criado com sucesso!')
      router.push(`/lesson-plans/${data.id}`)
    },
    onError: (error) => {
      toast.error(extractLessonPlanErrors(error)[0] ?? 'Não foi possível criar o plano de aula.')
    },
  })
}
