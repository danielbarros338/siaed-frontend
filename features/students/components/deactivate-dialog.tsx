'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeactivateStudent } from '@/features/students/hooks/use-deactivate-student'

interface DeactivateDialogProps {
  studentId: string
  studentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InativarDialog({
  studentId,
  studentName,
  open,
  onOpenChange,
}: DeactivateDialogProps) {
  const mutation = useDeactivateStudent(studentId, {
    onClose: () => onOpenChange(false),
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inativar Aluno</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja inativar <strong>{studentName}</strong>? O aluno será marcado
            como inativo e não aparecerá como aluno ativo nas turmas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault()
              mutation.mutate({ status: 2 })
            }}
          >
            {mutation.isPending ? 'Inativando...' : 'Inativar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function RegistrarEvasaoDialog({
  studentId,
  studentName,
  open,
  onOpenChange,
}: DeactivateDialogProps) {
  const mutation = useDeactivateStudent(studentId, {
    onClose: () => onOpenChange(false),
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registrar Evasão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja registrar a evasão de <strong>{studentName}</strong>? O aluno
            será marcado como evadido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault()
              mutation.mutate({ status: 3 })
            }}
          >
            {mutation.isPending ? 'Registrando...' : 'Registrar Evasão'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
