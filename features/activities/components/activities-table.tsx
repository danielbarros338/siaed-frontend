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
import { ActivityActions } from '@/features/activities/components/activity-actions'
import { ActivityOriginBadge } from '@/features/activities/components/activity-origin-badge'
import { ActivityStatusBadge } from '@/features/activities/components/activity-status-badge'
import type { Activity } from '@/features/activities/types'

interface ActivitiesTableProps {
  data: Activity[]
  isLoading: boolean
}

function formatDateBr(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function ActivitiesTable({ data, isLoading }: ActivitiesTableProps) {
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
                <p className="text-xs text-muted-foreground">{plan.subject} â€¢ {plan.grade}</p>
              </div>
              <ActivityActions plan={plan} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ActivityStatusBadge status={plan.status} />
              <ActivityOriginBadge isAIGenerated={plan.isAIGenerated} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {plan.durationMinutes} min â€¢ Criado em {formatDateBr(plan.createdAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-md border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TÃ­tulo</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>SÃ©rie</TableHead>
              <TableHead>DuraÃ§Ã£o</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-16 text-right">AÃ§Ãµes</TableHead>
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
                  <ActivityStatusBadge status={plan.status} />
                </TableCell>
                <TableCell>
                  <ActivityOriginBadge isAIGenerated={plan.isAIGenerated} />
                </TableCell>
                <TableCell>{formatDateBr(plan.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <ActivityActions plan={plan} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

