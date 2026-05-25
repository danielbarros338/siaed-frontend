'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteReportDialog } from '@/features/reports/components/delete-report-dialog'
import { EditReportForm } from '@/features/reports/components/edit-report-form'
import { useReportDetail } from '@/features/reports/hooks/use-report-detail'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ReportDetailViewProps {
  id: string
}

export function ReportDetailView({ id }: ReportDetailViewProps) {
  const { data: report, isLoading } = useReportDetail(id)
  const [editing, setEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-muted-foreground">
        <p>Relatório não encontrado.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/reports">Voltar para relatórios</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon">
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Relatório — {report.studentName}
            </h1>
            {report.isAIGenerated ? (
              <Badge variant="secondary">IA</Badge>
            ) : (
              <Badge variant="outline">Manual</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Criado em {new Date(report.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        {!editing && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              Excluir
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="rounded-lg border p-6">
          <EditReportForm report={report} />
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border p-6">
          <section className="space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Conteúdo
            </h2>
            <p className="whitespace-pre-wrap text-sm">{report.content}</p>
          </section>
          <hr />
          <section className="space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Resumo
            </h2>
            <p className="whitespace-pre-wrap text-sm">{report.summary}</p>
          </section>
          <hr />
          <section className="space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Comunicação com os pais
            </h2>
            <p className="whitespace-pre-wrap text-sm">{report.parentCommunication}</p>
          </section>
        </div>
      )}

      <DeleteReportDialog
        report={deleteOpen ? report : null}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
