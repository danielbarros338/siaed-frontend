'use client'

import { extractGradeErrors, getDeleteSuccessMessage } from '@/features/activities/utils/grade-errors'
import { gradesApi } from '@/lib/api/grades'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => gradesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.all })
      toast.success(getDeleteSuccessMessage())
    },
    onError: (error) => {
      toast.error(extractGradeErrors(error)[0] ?? 'Nao foi possivel remover a nota.')
    },
  })
}
