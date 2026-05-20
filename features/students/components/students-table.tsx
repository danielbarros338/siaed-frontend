'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { StudentStatusBadge } from '@/features/students/components/student-status-badge'
import type { StudentListItem } from '@/features/students/types'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

interface StudentsTableProps {
  data: StudentListItem[]
  isLoading: boolean
  page: number
  totalPages: number
  canWrite: boolean
  onPageChange: (page: number) => void
  onTransfer: (student: StudentListItem) => void
  onInativar: (student: StudentListItem) => void
  onRegistrarEvasao: (student: StudentListItem) => void
  onReativar: (student: StudentListItem) => void
}

export function StudentsTable({
  data,
  isLoading,
  page,
  totalPages,
  canWrite,
  onPageChange,
  onTransfer,
  onInativar,
  onRegistrarEvasao,
  onReativar,
}: StudentsTableProps) {
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
        <p className="text-sm">Nenhum aluno encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-56">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{student.documentIdMasked}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>
                  <StudentStatusBadge status={student.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/students/${student.id}`}>Ver detalhes</Link>
                    </Button>
                    {canWrite && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/students/${student.id}/edit`}>Editar</Link>
                          </DropdownMenuItem>
                          {student.status === 1 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onTransfer(student)}>
                                Transferir turma
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onInativar(student)}>
                                Inativar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRegistrarEvasao(student)}
                                className="text-destructive focus:text-destructive"
                              >
                                Registrar evasão
                              </DropdownMenuItem>
                            </>
                          )}
                          {(student.status === 2 || student.status === 3) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onReativar(student)}>
                                Reativar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
