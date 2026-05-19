'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { StudentForm } from '@/features/students/components/student-form'
import { useStudentDetail } from '@/features/students/hooks/use-student-detail'
import { useUpdateStudent } from '@/features/students/hooks/use-update-student'
import type { EditStudentFormValues } from '@/features/students/schemas/edit-student-schema'
import { extractApiErrors } from '@/lib/api/auth'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface EditStudentViewProps {
  id: string
}

export function EditStudentView({ id }: EditStudentViewProps) {
  const { data: student, isLoading, error } = useStudentDetail(id)
  const mutation = useUpdateStudent(id)

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound()
    }
  }

  const apiError = mutation.error
    ? extractApiErrors(mutation.error)[0] ?? null
    : null

  function handleSubmit(values: EditStudentFormValues) {
    mutation.mutate({ id, ...values })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!student) return null

  const defaultValues: Partial<EditStudentFormValues> = {
    fullName: student.fullName,
    documentType: student.documentType,
    documentId: student.documentIdMasked,
    birthDate: student.birthDate,
    notes: student.notes ?? '',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/students/${id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Detalhes do Aluno
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Aluno</h1>
        <p className="mt-1 text-sm text-muted-foreground">{student.fullName}</p>
      </div>

      <StudentForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        apiError={apiError}
      />
    </div>
  )
}
