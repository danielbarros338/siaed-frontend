'use client'

import type { CreateClassDto } from '@/features/classes/types'
import { extractApiErrors } from '@/lib/api/auth'
import { classesApi } from '@/lib/api/classes'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type CreateClassOptions = {
  onSuccess?: (id: string) => void
}

export function useCreateClass(options?: CreateClassOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: CreateClassDto) => classesApi.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
      toast.success('Turma cadastrada com sucesso!')
      options?.onSuccess?.(data.id)
      router.push(`/classes/${data.id}`)
    },
    onError: (error) => {
      toast.error(extractApiErrors(error)[0] ?? 'Não foi possível cadastrar a turma.')
    },
  })
}
