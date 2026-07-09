'use client'

import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { TeachingPlanActions } from '@/features/teaching-plans/components/teaching-plan-actions'
import { TeachingPlanOriginBadge } from '@/features/teaching-plans/components/teaching-plan-origin-badge'
import { TeachingPlanStatusBadge } from '@/features/teaching-plans/components/teaching-plan-status-badge'
import type { TeachingPlan } from '@/features/teaching-plans/types'

interface TeachingPlansTableProps {
  data: TeachingPlan[]
  isLoading: boolean
}

function formatDateBr(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function TeachingPlansTable({ data, isLoading }: TeachingPlansTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 sm:hidden">
        {data.map((plan) => (
          <article key={plan.id} className="rounded-lg border p-3 transition-all hover:border-[#0066cc]/40 hover:shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{plan.title}</h3>
                <p className="text-xs text-muted-foreground">{plan.subject} • {plan.grade} • {plan.academicPeriod}</p>
              </div>
              <TeachingPlanActions plan={plan} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TeachingPlanStatusBadge status={plan.status} />
              <TeachingPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {plan.workloadHours}h • Criado em {formatDateBr(plan.createdAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-md border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.title}</TableCell>
                <TableCell>{plan.subject}</TableCell>
                <TableCell>{plan.course}</TableCell>
                <TableCell>{plan.grade}</TableCell>
                <TableCell>{plan.academicPeriod}</TableCell>
                <TableCell>
                  <TeachingPlanStatusBadge status={plan.status} />
                </TableCell>
                <TableCell>
                  <TeachingPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
                </TableCell>
                <TableCell>{formatDateBr(plan.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <TeachingPlanActions plan={plan} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
