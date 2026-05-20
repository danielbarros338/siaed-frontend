'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClassesTable } from '@/features/classes/components/classes-table'
import { useClasses } from '@/features/classes/hooks/use-classes'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useDebounce } from '@/lib/hooks/use-debounce'
import axios from 'axios'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const PAGE_SIZE = 20

export function ClassesView() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3
  const debouncedSearch = useDebounce(search, 300)
  const normalizedSearch = useMemo(() => debouncedSearch.trim(), [debouncedSearch])

  const { data, isLoading, isError, error, refetch } = useClasses({
    page,
    pageSize: PAGE_SIZE,
    search: normalizedSearch || undefined,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Turmas</h1>
          <p className="text-sm text-muted-foreground">Gerencie as turmas cadastradas no sistema.</p>
        </div>

        {canWrite && (
          <Button asChild>
            <Link href="/classes/new">Inserir turma</Link>
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          aria-label="Buscar turmas"
          placeholder="Buscar por nome ou série..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          className="pl-9"
        />
      </div>

      {isError ? (
        axios.isAxiosError(error) && error.response?.status === 403 ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-sm font-medium text-destructive">Acesso negado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Você não tem permissão para visualizar esta listagem.
            </p>
          </div>
        ) : (
          <div className="rounded-md border p-6">
            <p className="text-sm font-medium text-destructive">Erro ao carregar turmas.</p>
            <p className="mt-1 text-sm text-muted-foreground">Tente novamente em instantes.</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        )
      ) : (
        <ClassesTable data={data?.items ?? []} isLoading={isLoading} canWrite={canWrite} />
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
