'use client'

import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useImportStudents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => studentsApi.import(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
    },
  })
}
