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

interface DeleteActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
  isPending: boolean
}

export function DeleteActivityDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isPending,
}: DeleteActivityDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-labelledby={titleId} aria-describedby={descriptionId}>
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>Excluir atividade</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId}>
            Esta ação realiza exclusão lógica e não poderá ser desfeita pela interface.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">Confirma a exclusão da atividade {title}?</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

