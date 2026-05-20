'use client'

import { ClassForm } from '@/features/classes/components/class-form'
import { useCreateClass } from '@/features/classes/hooks/use-create-class'
import type { CreateClassFormValues } from '@/features/classes/schemas/create-class-schema'
import { extractApiErrors } from '@/lib/api/auth'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CreateClassView() {
  const mutation = useCreateClass()
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

  const apiError = mutation.error ? extractApiErrors(mutation.error)[0] ?? null : null

  function handleSubmit(values: CreateClassFormValues) {
    const teacherIds = values.teacherIds?.filter(Boolean) ?? []

    mutation.mutate({
      name: values.name,
      grade: values.grade,
      schoolYear: values.schoolYear,
      ...(teacherIds.length > 0 ? { teacherIds } : {}),
    })
  }

  if (!canWrite) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Apenas coordenadores e diretores podem cadastrar turmas.
        </p>
        <Link href="/classes" className="text-sm underline underline-offset-4 hover:text-primary">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/classes"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Turmas
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cadastrar nova turma</h1>
        <p className="text-muted-foreground">Preencha os dados abaixo para cadastrar uma turma.</p>
      </div>

      <div className="max-w-2xl">
        <ClassForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}
