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
import { getActivityTypeLabel } from '@/features/activities/utils/activity-status'

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
        {data.map((activity) => (
          <article key={activity.id} className="rounded-md border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{activity.title}</h3>
                <p className="text-xs text-muted-foreground">{activity.subject} • {activity.grade}</p>
              </div>
              <ActivityActions activity={activity} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ActivityStatusBadge status={activity.status} />
              <ActivityOriginBadge isAIGenerated={activity.isAIGenerated} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {getActivityTypeLabel(activity.type)} • Criado em {formatDateBr(activity.createdAt)}
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
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-16 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell>{activity.subject}</TableCell>
                <TableCell>{activity.grade}</TableCell>
                <TableCell>{getActivityTypeLabel(activity.type)}</TableCell>
                <TableCell>
                  <ActivityStatusBadge status={activity.status} />
                </TableCell>
                <TableCell>
                  <ActivityOriginBadge isAIGenerated={activity.isAIGenerated} />
                </TableCell>
                <TableCell>{formatDateBr(activity.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <ActivityActions activity={activity} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

