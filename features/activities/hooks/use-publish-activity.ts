'use client'

import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { activitiesApi } from '@/lib/api/activities'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePublishActivity(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => activitiesApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all })
      toast.success('Atividade publicada com sucesso!')
    },
    onError: (error) => {
      toast.error(extractActivityErrors(error)[0] ?? 'Não foi possível publicar a atividade.')
    },
  })
}

