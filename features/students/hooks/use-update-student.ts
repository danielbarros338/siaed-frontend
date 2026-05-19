'use client'

import type { UpdateStudentDto } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: UpdateStudentDto) => studentsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      toast.success('Dados do aluno atualizados com sucesso!')
      router.push(`/students/${id}`)
    },
  })
}
