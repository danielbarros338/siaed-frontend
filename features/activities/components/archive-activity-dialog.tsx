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
import { useId } from 'react'

interface ArchiveActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
  isPending: boolean
}

export function ArchiveActivityDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isPending,
}: ArchiveActivityDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-labelledby={titleId} aria-describedby={descriptionId}>
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>Arquivar atividade</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId}>
            A atividade continuará disponível para consulta, porém arquivada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">Deseja arquivar a atividade {title}?</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Arquivando...' : 'Arquivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

