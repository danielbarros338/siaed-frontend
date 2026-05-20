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

interface PublishLessonPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
  isPending: boolean
}

export function PublishLessonPlanDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  isPending,
}: PublishLessonPlanDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent aria-labelledby={titleId} aria-describedby={descriptionId}>
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>Publicar plano</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId}>
            Esta ação torna o plano visível como publicado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">Deseja publicar o plano {title}?</p>
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
