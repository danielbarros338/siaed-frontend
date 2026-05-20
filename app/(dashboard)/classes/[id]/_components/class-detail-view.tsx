'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ClassActions } from '@/features/classes/components/class-actions'
import { ClassStatusBadge } from '@/features/classes/components/class-status-badge'
import { useClassDetail } from '@/features/classes/hooks/use-class-detail'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ClassDetailViewProps {
  id: string
}

function formatDateBr(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

function getTeachersLabel(data: {
  teachers?: Array<{ name: string }>
}) {
  if (!Array.isArray(data.teachers) || data.teachers.length === 0) {
    return 'Não associado'
  }

  const names = data.teachers
    .map((teacher) => teacher.name?.trim())
    .filter((name): name is string => Boolean(name))

  return names.length > 0 ? names.join(', ') : 'Não associado'
}

export function ClassDetailView({ id }: ClassDetailViewProps) {
  const { data: classData, isLoading, error, refetch } = useClassDetail(id)
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3
  const teachersLabel = classData ? getTeachersLabel(classData) : 'Não associado'

  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404

  if (isNotFound) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Turma não encontrada.</p>
        <p className="mt-1 text-sm text-muted-foreground">A turma pode ter sido removida ou não existe.</p>
        <Link href="/classes" className="mt-3 inline-block text-sm underline underline-offset-4 hover:text-primary">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>
      </div>
    )
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

  if (!classData) {
    return null
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{classData.name}</h1>
            <ClassStatusBadge status={classData.status} />
          </div>
          <p className="text-sm text-muted-foreground">Série: {classData.grade}</p>
        </div>

        {canWrite && <ClassActions classData={classData} />}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nome</p>
          <p className="text-sm">{classData.name}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Série</p>
          <p className="text-sm">{classData.grade}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ano letivo</p>
          <p className="text-sm">{classData.schoolYear}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Professor(es)</p>
          <p className="text-sm">{teachersLabel}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
          <p className="text-sm">
            <ClassStatusBadge status={classData.status} />
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cadastrada em</p>
          <p className="text-sm">{formatDateBr(classData.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}
