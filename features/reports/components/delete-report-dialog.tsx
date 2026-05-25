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
import { useDeleteReport } from '@/features/reports/hooks/use-delete-report'
import type { Report } from '@/lib/types'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteReportDialogProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteReportDialog({ report, open, onOpenChange }: DeleteReportDialogProps) {
  const { mutateAsync, isPending } = useDeleteReport()

  async function handleConfirm() {
    if (!report) return
    try {
      await mutateAsync(report.id)
      toast.success('Relatório excluído com sucesso.')
      onOpenChange(false)
    } catch (err) {
      const messages = axios.isAxiosError(err)
        ? (err.response?.data?.errors as string[] | undefined) ?? ['Erro ao excluir relatório.']
        : ['Erro ao excluir relatório.']
      messages.forEach((m) => toast.error(m))
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir relatório</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
