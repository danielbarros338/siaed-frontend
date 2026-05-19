'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { InativarDialog, RegistrarEvasaoDialog } from '@/features/students/components/deactivate-dialog'
import { ReactivateModal } from '@/features/students/components/reactivate-modal'
import { StudentsTable } from '@/features/students/components/students-table'
import { TransferModal } from '@/features/students/components/transfer-modal'
import { useClassesForSelect } from '@/features/students/hooks/use-classes-for-select'
import { useStudents } from '@/features/students/hooks/use-students'
import type { StudentListItem, StudentStatus } from '@/features/students/types'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const PAGE_SIZE = 20

export function StudentsView() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatus | null>(null)
  const [classFilter, setClassFilter] = useState<string | null>(null)

  // Modals state
  const [transferTarget, setTransferTarget] = useState<StudentListItem | null>(null)
  const [inativarTarget, setInativarTarget] = useState<StudentListItem | null>(null)
  const [evasaoTarget, setEvasaoTarget] = useState<StudentListItem | null>(null)
  const [reativarTarget, setReativarTarget] = useState<StudentListItem | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useStudents({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter,
    classId: classFilter,
  })

  const { data: classesData } = useClassesForSelect()

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : (Number(value) as StudentStatus))
    setPage(1)
  }

  const handleClassChange = (value: string) => {
    setClassFilter(value === 'all' ? null : value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Alunos</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/students/new">Novo aluno</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/students/import">Importar CSV</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou documento..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select onValueChange={handleStatusChange} defaultValue="all">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="1">Ativo</SelectItem>
            <SelectItem value="2">Inativo</SelectItem>
            <SelectItem value="3">Evadido</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleClassChange} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Turma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as turmas</SelectItem>
            {classesData?.items.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StudentsTable
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        onTransfer={setTransferTarget}
        onInativar={setInativarTarget}
        onRegistrarEvasao={setEvasaoTarget}
        onReativar={setReativarTarget}
      />

      <TransferModal
        studentId={transferTarget?.id ?? ''}
        currentClassId={transferTarget?.classId ?? ''}
        open={!!transferTarget}
        onOpenChange={(open) => { if (!open) setTransferTarget(null) }}
      />

      <InativarDialog
        studentId={inativarTarget?.id ?? ''}
        studentName={inativarTarget?.fullName ?? ''}
        open={!!inativarTarget}
        onOpenChange={(open) => { if (!open) setInativarTarget(null) }}
      />

      <RegistrarEvasaoDialog
        studentId={evasaoTarget?.id ?? ''}
        studentName={evasaoTarget?.fullName ?? ''}
        open={!!evasaoTarget}
        onOpenChange={(open) => { if (!open) setEvasaoTarget(null) }}
      />

      <ReactivateModal
        studentId={reativarTarget?.id ?? ''}
        open={!!reativarTarget}
        onOpenChange={(open) => { if (!open) setReativarTarget(null) }}
      />
    </div>
  )
}
