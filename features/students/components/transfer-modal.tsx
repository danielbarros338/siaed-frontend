'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useClassesForSelect } from '@/features/students/hooks/use-classes-for-select'
import { useTransferStudent } from '@/features/students/hooks/use-transfer-student'
import { transferSchema, type TransferFormValues } from '@/features/students/schemas/transfer-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface TransferModalProps {
  studentId: string
  currentClassId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransferModal({
  studentId,
  currentClassId,
  open,
  onOpenChange,
}: TransferModalProps) {
  const { data: classesData, isLoading: classesLoading } = useClassesForSelect()
  const mutation = useTransferStudent(studentId, { onClose: () => onOpenChange(false) })

  const classes = classesData?.items.filter((c) => c.id !== currentClassId) ?? []

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { newClassId: '' },
  })

  function handleSubmit(values: TransferFormValues) {
    mutation.mutate({ newClassId: values.newClassId })
  }

  function handleOpenChange(val: boolean) {
    if (!mutation.isPending) {
      form.reset()
      onOpenChange(val)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Aluno de Turma</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Turma</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={classesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma de destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.length === 0 && (
                        <SelectItem value="_empty" disabled>
                          Nenhuma turma disponível
                        </SelectItem>
                      )}
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Transferindo...' : 'Transferir'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
