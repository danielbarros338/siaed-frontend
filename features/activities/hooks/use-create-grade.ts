'use client'

import type { CreateGradeDto } from '@/features/activities/types/grades'
import { extractGradeErrors } from '@/features/activities/utils/grade-errors'
import { gradesApi } from '@/lib/api/grades'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateGradeDto) => gradesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.all })
      toast.success('Nota registrada com sucesso!')
    },
    onError: (error) => {
      toast.error(extractGradeErrors(error)[0] ?? 'Nao foi possivel registrar a nota.')
    },
  })
}
