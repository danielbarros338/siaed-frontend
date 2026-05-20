'use client'

import type { UpdateClassDto } from '@/features/classes/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type UpdateClassOptions = {
  onSuccess?: () => void
}

export function useUpdateClass(id: string, options?: UpdateClassOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: UpdateClassDto) => classesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
      toast.success('Turma atualizada com sucesso!')
      options?.onSuccess?.()
      router.push(`/classes/${id}`)
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível atualizar a turma.')
    },
  })
}
