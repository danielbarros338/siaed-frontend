'use client'

import type { CreateStudentDto } from '@/features/students/types'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useCreateStudent() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (dto: CreateStudentDto) => studentsApi.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
      toast.success('Aluno cadastrado com sucesso!')
      router.push(`/students/${data.id}`)
    },
  })
}
