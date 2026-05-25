'use client'

import type { UpdateActivityRequest } from '@/features/activities/types'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { activitiesApi } from '@/lib/api/activities'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useUpdateActivity(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: UpdateActivityRequest) => activitiesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all })
      toast.success('Atividade atualizada com sucesso!')
      router.push(`/activities/${id}`)
    },
    onError: (error) => {
      toast.error(extractActivityErrors(error)[0] ?? 'Não foi possível atualizar a atividade.')
    },
  })
}

