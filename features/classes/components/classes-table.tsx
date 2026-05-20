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
import { ClassStatusBadge } from '@/features/classes/components/class-status-badge'
import type { ClassListItem } from '@/features/classes/types'
import { ArrowRight, Pencil } from 'lucide-react'
import Link from 'next/link'

interface ClassesTableProps {
  data: ClassListItem[]
  isLoading: boolean
  canWrite: boolean
}

export function ClassesTable({ data, isLoading, canWrite }: ClassesTableProps) {
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
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-16 text-muted-foreground">
        <p className="text-sm">Nenhuma turma encontrada.</p>
        {canWrite && (
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/classes/new">Inserir turma</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
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
                  {canWrite && (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/classes/${classItem.id}/edit`}>
                        <Pencil className="mr-2 size-4" />
                        Editar
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm">
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
  )
}
