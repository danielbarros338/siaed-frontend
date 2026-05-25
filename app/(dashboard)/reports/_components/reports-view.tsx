'use client'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { DeleteReportDialog } from '@/features/reports/components/delete-report-dialog'
import { ReportsTable } from '@/features/reports/components/reports-table'
import { useReports } from '@/features/reports/hooks/use-reports'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import type { Report } from '@/lib/types'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

const PAGE_SIZE = 10

export function ReportsView() {
  const { user } = useCurrentUser()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId') ?? undefined
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'manual' | 'ai'>('all')
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null)

  const isAIGenerated =
    filter === 'ai' ? true : filter === 'manual' ? false : undefined

  const { data, isLoading } = useReports({
    userId: user?.userId ?? '',
    studentId,
    page,
    pageSize: PAGE_SIZE,
    isAIGenerated,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            {studentId
              ? 'Listagem filtrada para o aluno selecionado.'
              : 'Listagem de todos os relatórios de todos os alunos.'}
          </p>
        </div>
        <Button asChild>
          <Link href="/reports/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Relatório
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={filter}
          onValueChange={(v) => {
            setFilter(v as 'all' | 'manual' | 'ai')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="ai">Gerado por IA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReportsTable
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        onDelete={(report) => setReportToDelete(report)}
      />

      <DeleteReportDialog
        report={reportToDelete}
        open={!!reportToDelete}
        onOpenChange={(open) => {
          if (!open) setReportToDelete(null)
        }}
      />
    </div>
  )
}
