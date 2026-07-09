'use client'

import { Button } from '@/components/ui/button'
import { TeachingPlansEmptyState } from '@/features/teaching-plans/components/teaching-plans-empty-state'
import { TeachingPlansFilters } from '@/features/teaching-plans/components/teaching-plans-filters'
import { TeachingPlansTable } from '@/features/teaching-plans/components/teaching-plans-table'
import { useTeachingPlans } from '@/features/teaching-plans/hooks/use-teaching-plans'
import type { TeachingPlanStatusFilter } from '@/features/teaching-plans/types'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const PAGE_SIZE = 10

export function TeachingPlanView() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<TeachingPlanStatusFilter | undefined>()
  const [isAIGenerated, setIsAIGenerated] = useState<boolean | undefined>()

  const { user } = useCurrentUser()

  const { data, isLoading, isError, error, refetch } = useTeachingPlans({
    page,
    pageSize: PAGE_SIZE,
    status,
    isAIGenerated,
  })

  if (user?.role !== 1 && user?.role !== 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores e coordenadores podem acessar este módulo.</p>
      </div>
    )
  }

  const hasFilters = !!status || typeof isAIGenerated === 'boolean'

  return (
    <div className="space-y-6">
      <Link href="/plans" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planos de Ensino</h1>
          <p className="text-sm text-muted-foreground">Gerencie o planejamento curricular manual ou gerado por IA.</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="hover:border-[#0066cc]/40 hover:bg-[#0066cc]/5 hover:text-[#0066cc]">
            <Link href="/teaching-plan/generate">Gerar com IA</Link>
          </Button>
          <Button asChild className="text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] border-0 hover:opacity-90">
            <Link href="/teaching-plan/new">Criar manualmente</Link>
          </Button>
        </div>
      </div>

      <TeachingPlansFilters
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
          <p className="text-sm font-medium text-destructive">Erro ao carregar planos de ensino.</p>
          <p className="mt-1 text-sm text-muted-foreground">{extractTeachingPlanErrors(error)[0]}</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : data && data.items.length === 0 && !isLoading ? (
        <TeachingPlansEmptyState hasFilters={hasFilters} onClearFilters={() => {
          setStatus(undefined)
          setIsAIGenerated(undefined)
          setPage(1)
        }} />
      ) : (
        <TeachingPlansTable data={data?.items ?? []} isLoading={isLoading} />
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
            Página {Math.min(page, data.totalPages)} de {data.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.min(data.totalPages, current + 1))}
            disabled={page >= data.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
