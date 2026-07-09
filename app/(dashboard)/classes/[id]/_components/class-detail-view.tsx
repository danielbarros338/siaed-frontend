'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ClassActions } from '@/features/classes/components/class-actions'
import { ClassDetailCard } from '@/features/classes/components/class-detail-card'
import { useClassDetail } from '@/features/classes/hooks/use-class-detail'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ClassDetailViewProps {
  id: string
}

export function ClassDetailView({ id }: ClassDetailViewProps) {
  const { data: classData, isLoading, error, refetch } = useClassDetail(id)
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

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
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-40" />
        <div className="rounded-2xl border p-6 space-y-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
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
      <Link
        href="/classes"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Turmas
      </Link>

      {canWrite && (
        <div className="flex flex-wrap items-center gap-2">
          <ClassActions classData={classData} />
        </div>
      )}

      <ClassDetailCard data={classData} />
    </div>
  )
}
