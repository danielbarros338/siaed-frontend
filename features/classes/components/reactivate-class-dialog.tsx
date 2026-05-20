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

interface ReactivateClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  className: string
  onConfirm: () => void
  isPending: boolean
}

export function ReactivateClassDialog({
  open,
  onOpenChange,
  className,
  onConfirm,
  isPending,
}: ReactivateClassDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reativar turma</DialogTitle>
          <DialogDescription>
            Confirme a reativação da turma para disponibilizá-la novamente no ciclo letivo.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja reativar a turma {className}?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Reativando...' : 'Reativar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
