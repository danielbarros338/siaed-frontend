'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { DeleteGradeDialog } from '@/features/activities/components/delete-grade-dialog'
import { GradeEntryForm } from '@/features/activities/components/grade-entry-form'
import type { GradeEntryFormValues } from '@/features/activities/schemas/grade-entry-schema'
import type { GradeListRow } from '@/features/activities/types/grades'
import { useMemo, useState } from 'react'

interface ActivityGradesTableProps {
  rows: GradeListRow[]
  isLoading: boolean
  canManage: boolean
  isMutating: boolean
  gradeValueFilter: string
  onGradeValueFilterChange: (value: string) => void
  conventionKey: string
  conventionLocked: boolean
  onCreate: (row: GradeListRow, values: GradeEntryFormValues) => void
  onUpdate: (row: GradeListRow, values: GradeEntryFormValues) => void
  onDelete: (row: GradeListRow) => void
  page: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (value: number) => void
}

export function ActivityGradesTable({
  rows,
  isLoading,
  canManage,
  isMutating,
  gradeValueFilter,
  onGradeValueFilterChange,
  conventionKey,
  conventionLocked,
  onCreate,
  onUpdate,
  onDelete,
  page,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
}: ActivityGradesTableProps) {
  const [rowToDelete, setRowToDelete] = useState<GradeListRow | null>(null)

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => a.studentName.localeCompare(b.studentName, 'pt-BR')),
    [rows],
  )

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px]">
        <Input
          value={gradeValueFilter}
          onChange={(event) => onGradeValueFilterChange(event.target.value)}
          placeholder="Filtrar por nota"
          aria-label="Filtrar por nota"
        />
        <Input
          type="number"
          value={String(pageSize)}
          min={5}
          max={100}
          step={5}
          onChange={(event) => {
            const nextValue = Number(event.target.value)
            if (Number.isFinite(nextValue)) {
              onPageSizeChange(nextValue)
            }
          }}
          aria-label="Quantidade por pagina"
        />
      </div>

      {sortedRows.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          Nenhum aluno encontrado para os filtros atuais.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Situacao</TableHead>
                <TableHead className="w-120">Lancamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow key={row.studentId}>
                  <TableCell className="font-medium">{row.studentName}</TableCell>
                  <TableCell>{row.className}</TableCell>
                  <TableCell>{row.hasGrade ? 'Com nota' : 'Sem nota'}</TableCell>
                  <TableCell className="align-top whitespace-nowrap">
                    {canManage ? (
                      <div className="flex flex-nowrap items-start gap-2">
                        <GradeEntryForm
                          studentId={row.studentId}
                          defaultGradeValue={row.gradeValue ?? ''}
                          defaultConventionKey={row.conventionKey ?? conventionKey}
                          disableConventionChange={conventionLocked}
                          disabled={isMutating}
                          isSubmitting={isMutating}
                          submitLabel={row.hasGrade ? 'Atualizar' : 'Lancar'}
                          onSubmit={(values) => {
                            if (row.hasGrade) {
                              onUpdate(row, values)
                              return
                            }
                            onCreate(row, values)
                          }}
                        />

                        {row.hasGrade ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 w-24 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={isMutating}
                            onClick={() => setRowToDelete(row)}
                          >
                            Remover
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {row.hasGrade ? (row.gradeValue ?? '-') : 'Sem nota'}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              onClick={(event) => {
                event.preventDefault()
                if (hasPreviousPage) {
                  onPageChange(page - 1)
                }
              }}
              aria-disabled={!hasPreviousPage}
              className={!hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-3 text-sm text-muted-foreground">Pagina {page}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text="Proxima"
              onClick={(event) => {
                event.preventDefault()
                if (hasNextPage) {
                  onPageChange(page + 1)
                }
              }}
              aria-disabled={!hasNextPage}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <DeleteGradeDialog
        open={!!rowToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setRowToDelete(null)
          }
        }}
        studentName={rowToDelete?.studentName ?? ''}
        isPending={isMutating}
        onConfirm={() => {
          if (!rowToDelete) {
            return
          }
          onDelete(rowToDelete)
          setRowToDelete(null)
        }}
      />
    </div>
  )
}
