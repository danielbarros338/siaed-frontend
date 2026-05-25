'use client'

import type { GenerateActivityRequest } from '@/features/activities/types'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { activitiesApi } from '@/lib/api/activities'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useGenerateActivity() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: GenerateActivityRequest) => activitiesApi.generate(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all })
      toast.success('Atividade gerada com sucesso!')
      router.push(`/activities/${data.id}`)
    },
    onError: (error) => {
      toast.error(extractActivityErrors(error)[0] ?? 'Não foi possível gerar a atividade.')
    },
  })
}

