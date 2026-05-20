'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface DeactivateClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  className: string
  onConfirm: () => void
  isPending: boolean
}

export function DeactivateClassDialog({
  open,
  onOpenChange,
  className,
  onConfirm,
  isPending,
}: DeactivateClassDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inativar turma</DialogTitle>
          <DialogDescription>
            Confirme a inativação da turma selecionada. Esta ação pode ser revertida por reativação.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja inativar a turma {className}?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Inativando...' : 'Inativar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
