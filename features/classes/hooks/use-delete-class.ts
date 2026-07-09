'use client'

import { extractApiErrors } from '@/lib/api/auth'
import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type DeleteClassOptions = {
  onSuccess?: () => void
}

export function useDeleteClass(id: string, options?: DeleteClassOptions) {
  const queryClient = useQueryClient()
  const { user } = useCurrentUser()

  return useMutation({
    mutationFn: () =>
      classesApi.delete(id, { requestingUserId: user?.userId ?? '', requestingRole: user?.role ?? 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
      toast.success('Turma inativada com sucesso!')
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível inativar a turma.')
    },
  })
}
