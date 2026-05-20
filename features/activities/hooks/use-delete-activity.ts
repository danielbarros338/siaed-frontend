'use client'

import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { activitiesApi } from '@/lib/api/activities'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type DeleteOptions = {
  onSuccess?: () => void
}

export function useDeleteActivity(id: string, options?: DeleteOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => activitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all })
      toast.success('Plano de aula excluÃ­do com sucesso!')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(extractActivityErrors(error)[0] ?? 'NÃ£o foi possÃ­vel excluir o plano de aula.')
    },
  })
}

