'use client'

import { Button } from '@/components/ui/button'
import { ClassForm } from '@/features/classes/components/class-form'
import { useClassDetail } from '@/features/classes/hooks/use-class-detail'
import { useUpdateClass } from '@/features/classes/hooks/use-update-class'
import type { CreateClassFormValues } from '@/features/classes/schemas/create-class-schema'
import { extractApiErrors } from '@/lib/api/auth'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

interface EditClassViewProps {
  id: string
}

function getClassTeacherIds(data: {
  teacherIds?: string[]
  teachers?: Array<{ id?: string; teacherId?: string }>
}) {
  if (Array.isArray(data.teacherIds)) {
    return data.teacherIds.filter((teacherId) => typeof teacherId === 'string' && teacherId.length > 0)
  }

  if (Array.isArray(data.teachers)) {
    return data.teachers
      .map((teacher) => teacher.id ?? teacher.teacherId)
      .filter((teacherId): teacherId is string => typeof teacherId === 'string' && teacherId.length > 0)
  }

  return []
}

function areTeacherListsEqual(current: string[], initial: string[]) {
  if (current.length !== initial.length) {
    return false
  }

  const currentSorted = [...current].sort()
  const initialSorted = [...initial].sort()

  return currentSorted.every((value, index) => value === initialSorted[index])
}

export function EditClassView({ id }: EditClassViewProps) {
  const { data: classData, isLoading, error, refetch } = useClassDetail(id)
  const mutation = useUpdateClass(id)
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

  const apiError = mutation.error ? extractApiErrors(mutation.error)[0] ?? null : null

  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404
  const initialTeacherIds = useMemo(() => (classData ? getClassTeacherIds(classData) : []), [classData])
  const preloadedTeachers = useMemo(
    () =>
      classData?.teachers
        ?.map((teacher) => {
          const teacherId = teacher.id ?? teacher.teacherId

          if (!teacherId) {
            return null
          }

          return {
            id: teacherId,
            name: teacher.name,
            subject: teacher.subject,
          }
        })
        .filter((teacher): teacher is { id: string; name: string; subject?: string | null } => teacher !== null) ?? [],
    [classData],
  )

  if (isNotFound) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Turma não encontrada.</p>
        <p className="mt-1 text-sm text-muted-foreground">Não foi possível localizar a turma para edição.</p>
        <Link href="/classes" className="mt-3 inline-block text-sm underline underline-offset-4 hover:text-primary">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  function handleSubmit(values: CreateClassFormValues) {
    const selectedTeacherIds = values.teacherIds?.filter(Boolean) ?? []
    const shouldSendTeacherIds = !areTeacherListsEqual(selectedTeacherIds, initialTeacherIds)

    mutation.mutate({
      id,
      name: values.name,
      grade: values.grade,
      schoolYear: values.schoolYear,
      ...(shouldSendTeacherIds ? { teacherIds: selectedTeacherIds } : {}),
    })
  }

  if (isLoading) {
    return <div className="space-y-4 text-sm text-muted-foreground">Carregando turma...</div>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar turma.</p>
        <p className="mt-1 text-sm text-muted-foreground">Tente novamente em instantes.</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!canWrite) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Apenas coordenadores e diretores podem editar turmas.
        </p>
        <Link href="/classes" className="text-sm underline underline-offset-4 hover:text-primary">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  if (!classData) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/classes/${id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Turma
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar turma</h1>
        <p className="text-muted-foreground">Atualize os dados da turma abaixo.</p>
      </div>

      <div className="max-w-2xl">
        <ClassForm
          mode="edit"
          preloadedTeachers={preloadedTeachers}
          defaultValues={{
            name: classData.name,
            grade: classData.grade,
            schoolYear: classData.schoolYear,
            teacherIds: initialTeacherIds,
          }}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}
