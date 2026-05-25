'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { InativarDialog, RegistrarEvasaoDialog } from '@/features/students/components/deactivate-dialog'
import { ReactivateModal } from '@/features/students/components/reactivate-modal'
import { StudentStatusBadge } from '@/features/students/components/student-status-badge'
import { TransferModal } from '@/features/students/components/transfer-modal'
import { useStudentDetail } from '@/features/students/hooks/use-student-detail'
import { DOCUMENT_TYPE_LABELS, formatDateBr } from '@/features/students/utils/format'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import axios from 'axios'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'

interface StudentDetailViewProps {
  id: string
}

export function StudentDetailView({ id }: StudentDetailViewProps) {
  const { data: student, isLoading, error } = useStudentDetail(id)
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

  const [transferOpen, setTransferOpen] = useState(false)
  const [inativarOpen, setInativarOpen] = useState(false)
  const [evasaoOpen, setEvasaoOpen] = useState(false)
  const [reativarOpen, setReativarOpen] = useState(false)

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound()
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!student) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/students"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Alunos
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{student.fullName}</h1>
            <StudentStatusBadge status={student.status} />
          </div>
          <p className="text-sm text-muted-foreground">Turma: {student.className}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/reports?studentId=${id}`}>
              Relatório
            </Link>
          </Button>
          {canWrite && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/students/${id}/edit`}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Editar
                </Link>
              </Button>

              {student.status === 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTransferOpen(true)}
                  >
                    Transferir Turma
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInativarOpen(true)}
                  >
                    Inativar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEvasaoOpen(true)}
                  >
                    Registrar Evasão
                  </Button>
                </>
              )}

              {(student.status === 2 || student.status === 3) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReativarOpen(true)}
                >
                  Reativar
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tipo de documento
          </p>
          <p className="text-sm">{DOCUMENT_TYPE_LABELS[student.documentType]}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Documento
          </p>
          <p className="text-sm font-mono">{student.documentIdMasked}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Data de nascimento
          </p>
          <p className="text-sm">{formatDateBr(student.birthDate)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Data de matrícula
          </p>
          <p className="text-sm">{formatDateBr(student.enrollmentDate)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Turma
          </p>
          <p className="text-sm">{student.className}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Cadastrado em
          </p>
          <p className="text-sm">{formatDateBr(student.createdAt)}</p>
        </div>
      </div>

      {student.notes && (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Observações
          </p>
          <p className="text-sm whitespace-pre-wrap">{student.notes}</p>
        </div>
      )}

      {canWrite && (
        <>
          <TransferModal
            studentId={id}
            currentClassId={student.classId}
            open={transferOpen}
            onOpenChange={setTransferOpen}
          />
          <InativarDialog
            studentId={id}
            studentName={student.fullName}
            open={inativarOpen}
            onOpenChange={setInativarOpen}
          />
          <RegistrarEvasaoDialog
            studentId={id}
            studentName={student.fullName}
            open={evasaoOpen}
            onOpenChange={setEvasaoOpen}
          />
          <ReactivateModal
            studentId={id}
            open={reativarOpen}
            onOpenChange={setReativarOpen}
          />
        </>
      )}
    </div>
  )
}
