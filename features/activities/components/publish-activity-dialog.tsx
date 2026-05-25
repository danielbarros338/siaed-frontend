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

interface PublishActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
  isPending: boolean
}

export function PublishActivityDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isPending,
}: PublishActivityDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-labelledby={titleId} aria-describedby={descriptionId}>
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>Publicar atividade</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId}>
            Esta ação torna a atividade visível como publicada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">Deseja publicar a atividade {title}?</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Publicando...' : 'Publicar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

