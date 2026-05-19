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
import { useReactivateStudent } from '@/features/students/hooks/use-reactivate-student'
import { reactivateSchema, type ReactivateFormValues } from '@/features/students/schemas/reactivate-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface ReactivateModalProps {
  studentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReactivateModal({ studentId, open, onOpenChange }: ReactivateModalProps) {
  const { data: classesData, isLoading: classesLoading } = useClassesForSelect()
  const mutation = useReactivateStudent(studentId, { onClose: () => onOpenChange(false) })

  const classes = classesData?.items ?? []

  const form = useForm<ReactivateFormValues>({
    resolver: zodResolver(reactivateSchema),
    defaultValues: { classId: '' },
  })

  function handleSubmit(values: ReactivateFormValues) {
    mutation.mutate({ classId: values.classId })
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
          <DialogTitle>Reativar Aluno</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={classesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
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
              <Button
                type="submit"
                disabled={mutation.isPending || !form.watch('classId')}
              >
                {mutation.isPending ? 'Reativando...' : 'Reativar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
