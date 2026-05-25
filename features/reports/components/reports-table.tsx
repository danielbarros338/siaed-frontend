'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { Report } from '@/lib/types'
import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface ReportsTableProps {
  data: Report[]
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete: (report: Report) => void
}

export function ReportsTable({
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onDelete,
}: ReportsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">Nenhum relatório encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Resumo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.studentName}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {report.summary}
                </TableCell>
                <TableCell>
                  {report.isAIGenerated ? (
                    <Badge variant="secondary">IA</Badge>
                  ) : (
                    <Badge variant="outline">Manual</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                      <Link href={`/reports/${report.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver relatório</span>
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(report)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir relatório</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(page - 1)}
                aria-disabled={page <= 1}
                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            <PaginationItem className="text-sm text-muted-foreground px-2 flex items-center">
              Página {page} de {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(page + 1)}
                aria-disabled={page >= totalPages}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
