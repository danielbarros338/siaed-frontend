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
import { LessonPlanActions } from '@/features/lesson-plans/components/lesson-plan-actions'
import { LessonPlanOriginBadge } from '@/features/lesson-plans/components/lesson-plan-origin-badge'
import { LessonPlanStatusBadge } from '@/features/lesson-plans/components/lesson-plan-status-badge'
import type { LessonPlan } from '@/features/lesson-plans/types'

interface LessonPlansTableProps {
  data: LessonPlan[]
  isLoading: boolean
}

function formatDateBr(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function LessonPlansTable({ data, isLoading }: LessonPlansTableProps) {
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
          <article key={plan.id} className="rounded-md border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{plan.title}</h3>
                <p className="text-xs text-muted-foreground">{plan.subject} • {plan.grade}</p>
              </div>
              <LessonPlanActions plan={plan} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <LessonPlanStatusBadge status={plan.status} />
              <LessonPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {plan.durationMinutes} min • Criado em {formatDateBr(plan.createdAt)}
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
              <TableHead>Série</TableHead>
              <TableHead>Duração</TableHead>
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
                <TableCell>{plan.grade}</TableCell>
                <TableCell>{plan.durationMinutes} min</TableCell>
                <TableCell>
                  <LessonPlanStatusBadge status={plan.status} />
                </TableCell>
                <TableCell>
                  <LessonPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
                </TableCell>
                <TableCell>{formatDateBr(plan.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <LessonPlanActions plan={plan} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
