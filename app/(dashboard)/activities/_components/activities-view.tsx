'use client'

import { Button } from '@/components/ui/button'
import { ActivitiesEmptyState } from '@/features/activities/components/activities-empty-state'
import { ActivitiesFilters } from '@/features/activities/components/activities-filters'
import { ActivitiesTable } from '@/features/activities/components/activities-table'
import { useActivities } from '@/features/activities/hooks/use-activities'
import type { ActivityStatusFilter } from '@/features/activities/types'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import Link from 'next/link'
import { useState } from 'react'

const PAGE_SIZE = 10

export function ActivitiesView() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<ActivityStatusFilter | undefined>()
  const [isAIGenerated, setIsAIGenerated] = useState<boolean | undefined>()

  const { user } = useCurrentUser()

  const { data, isLoading, isError, error, refetch } = useActivities({
    page,
    pageSize: PAGE_SIZE,
    status,
    isAIGenerated,
  })

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem acessar este mÃ³dulo.</p>
      </div>
    )
  }

  const hasFilters = !!status || typeof isAIGenerated === 'boolean'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planos de Aula</h1>
          <p className="text-sm text-muted-foreground">Gerencie planos manuais e gerados por IA.</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/activities/generate">Gerar com IA</Link>
          </Button>
          <Button asChild>
            <Link href="/activities/new">Criar manualmente</Link>
          </Button>
        </div>
      </div>

      <ActivitiesFilters
        status={status}
        isAIGenerated={isAIGenerated}
        onStatusChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
        onIsAIGeneratedChange={(value) => {
          setIsAIGenerated(value)
          setPage(1)
        }}
        onClear={() => {
          setStatus(undefined)
          setIsAIGenerated(undefined)
          setPage(1)
        }}
      />

      {isError ? (
        <div className="rounded-md border p-6">
          <p className="text-sm font-medium text-destructive">Erro ao carregar planos de aula.</p>
          <p className="mt-1 text-sm text-muted-foreground">{extractActivityErrors(error)[0]}</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : data && data.items.length === 0 && !isLoading ? (
        <ActivitiesEmptyState hasFilters={hasFilters} onClearFilters={() => {
          setStatus(undefined)
          setIsAIGenerated(undefined)
          setPage(1)
        }} />
      ) : (
        <ActivitiesTable data={data?.items ?? []} isLoading={isLoading} />
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span>
            PÃ¡gina {Math.min(page, data.totalPages)} de {data.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.min(data.totalPages, current + 1))}
            disabled={page >= data.totalPages}
          >
            PrÃ³xima
          </Button>
        </div>
      )}
    </div>
  )
}

