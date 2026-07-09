'use client'

import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { teachingPlansApi } from '@/lib/api/teaching-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePublishTeachingPlan(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => teachingPlansApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.all })
      toast.success('Plano de ensino publicado com sucesso!')
    },
    onError: (error) => {
      toast.error(extractTeachingPlanErrors(error)[0] ?? 'Não foi possível publicar o plano de ensino.')
    },
  })
}
