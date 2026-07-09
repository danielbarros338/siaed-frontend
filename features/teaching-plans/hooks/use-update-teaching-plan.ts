'use client'

import type { UpdateTeachingPlanRequest } from '@/features/teaching-plans/types'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { teachingPlansApi } from '@/lib/api/teaching-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useUpdateTeachingPlan(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: UpdateTeachingPlanRequest) => teachingPlansApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.all })
      toast.success('Plano de ensino atualizado com sucesso!')
      router.push(`/teaching-plan/${id}`)
    },
    onError: (error) => {
      toast.error(extractTeachingPlanErrors(error)[0] ?? 'Não foi possível atualizar o plano de ensino.')
    },
  })
}
