'use client'

import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { teachingPlansApi } from '@/lib/api/teaching-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type DeleteOptions = {
  onSuccess?: () => void
}

export function useDeleteTeachingPlan(id: string, options?: DeleteOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => teachingPlansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.all })
      toast.success('Plano de ensino excluído com sucesso!')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(extractTeachingPlanErrors(error)[0] ?? 'Não foi possível excluir o plano de ensino.')
    },
  })
}
