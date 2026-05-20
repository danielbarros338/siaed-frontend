'use client'

import { StudentForm } from '@/features/students/components/student-form'
import { useCreateStudent } from '@/features/students/hooks/use-create-student'
import type { CreateStudentFormValues } from '@/features/students/schemas/create-student-schema'
import { extractApiErrors } from '@/lib/api/auth'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CreateStudentView() {
  const mutation = useCreateStudent()
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

  const apiError = mutation.error ? extractApiErrors(mutation.error)[0] ?? null : null

  function handleSubmit(data: CreateStudentFormValues) {
    mutation.mutate(data)
  }

  if (!canWrite) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Apenas coordenadores e diretores podem cadastrar alunos.
        </p>
        <Link href="/students" className="text-sm underline underline-offset-4 hover:text-primary">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/students"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Alunos
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cadastrar novo aluno</h1>
        <p className="text-muted-foreground">Preencha os dados abaixo para cadastrar um novo aluno.</p>
      </div>

      <div className="max-w-2xl">
        <StudentForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}
