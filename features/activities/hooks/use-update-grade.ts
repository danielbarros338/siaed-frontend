'use client'

import type { UpdateGradeDto } from '@/features/activities/types/grades'
import { extractGradeErrors } from '@/features/activities/utils/grade-errors'
import { gradesApi } from '@/lib/api/grades'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UpdateGradeMutationInput {
  id: string
  dto: UpdateGradeDto
}

export function useUpdateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: UpdateGradeMutationInput) => gradesApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.detail(variables.id) })
      toast.success('Nota atualizada com sucesso!')
    },
    onError: (error) => {
      toast.error(extractGradeErrors(error)[0] ?? 'Nao foi possivel atualizar a nota.')
    },
  })
}
