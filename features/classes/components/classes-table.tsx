'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ClassesEmptyState } from '@/features/classes/components/classes-empty-state'
import { ClassStatusBadge } from '@/features/classes/components/class-status-badge'
import type { ClassListItem } from '@/features/classes/types'
import { ArrowRight, Pencil } from 'lucide-react'
import Link from 'next/link'

interface ClassesTableProps {
  data: ClassListItem[]
  isLoading: boolean
  canWrite: (classItem: ClassListItem) => boolean
  canInsert: boolean
}

export function ClassesTable({ data, isLoading, canWrite, canInsert }: ClassesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <ClassesEmptyState canWrite={canInsert} />
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 sm:hidden">
        {data.map((classItem) => (
          <article
            key={classItem.id}
            className="rounded-lg border p-3 transition-all hover:border-amber-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{classItem.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {classItem.grade} • {classItem.schoolYear}
                </p>
              </div>
              <ClassStatusBadge status={classItem.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {canWrite(classItem) && (
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/classes/${classItem.id}/edit`}>
                    <Pencil className="mr-2 size-4" />
                    Editar
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
              >
                <Link href={`/classes/${classItem.id}`}>
                  Detalhes
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-md border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Ano letivo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell className="font-medium">{classItem.name}</TableCell>
                <TableCell>{classItem.grade}</TableCell>
                <TableCell>{classItem.schoolYear}</TableCell>
                <TableCell>
                  <ClassStatusBadge status={classItem.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canWrite(classItem) && (
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/classes/${classItem.id}/edit`}>
                          <Pencil className="mr-2 size-4" />
                          Editar
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <Link href={`/classes/${classItem.id}`}>
                        Detalhes
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
