'use client'

import type { GenerateTeachingPlanRequest } from '@/features/teaching-plans/types'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { teachingPlansApi } from '@/lib/api/teaching-plans'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useGenerateTeachingPlan() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: GenerateTeachingPlanRequest) => teachingPlansApi.generate(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachingPlans.all })
      toast.success('Plano de ensino gerado com sucesso!')
      router.push(`/teaching-plan/${data.id}`)
    },
    onError: (error) => {
      toast.error(extractTeachingPlanErrors(error)[0] ?? 'Não foi possível gerar o plano de ensino.')
    },
  })
}
