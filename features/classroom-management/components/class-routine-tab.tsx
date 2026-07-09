'use client'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useClassRoutine } from '@/features/classroom-management/hooks/use-class-routine'
import { useUpdateClassRoutine } from '@/features/classroom-management/hooks/use-update-class-routine'
import {
    classRoutineSchema,
    type ClassRoutineFormValues,
} from '@/features/classroom-management/schemas/class-routine-schema'
import { canManageClassRoutine } from '@/features/classroom-management/utils/classroom-management-permissions'
import type { ClassDetail } from '@/features/classes/types'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

interface ClassRoutineTabProps {
  classData: ClassDetail
}

export function ClassRoutineTab({ classData }: ClassRoutineTabProps) {
  const { user } = useCurrentUser()
  const canManage = canManageClassRoutine(user, classData)
  const { data, isLoading } = useClassRoutine(classData.id)
  const mutation = useUpdateClassRoutine(classData.id)

  const form = useForm<ClassRoutineFormValues>({
    resolver: zodResolver(classRoutineSchema) as unknown as Resolver<ClassRoutineFormValues>,
    values: data
      ? { dailyRoutineDescription: data.dailyRoutineDescription, agreements: data.agreements }
      : undefined,
    defaultValues: { dailyRoutineDescription: '', agreements: [] },
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando rotina da turma...</p>
  }

  function handleSubmit(values: ClassRoutineFormValues) {
    mutation.mutate(values)
  }

  return (
    <Form {...form}>
      <fieldset disabled={!canManage} className="space-y-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {!canManage && (
            <p className="text-xs text-muted-foreground">
              Você tem acesso somente de leitura à rotina desta turma.
            </p>
          )}

          <FormField
            control={form.control}
            name="dailyRoutineDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estrutura da rotina diária</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combinados de convivência (um por linha)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    value={field.value.join('\n')}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {canManage && (
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar rotina e combinados'}
            </Button>
          )}
        </form>
      </fieldset>
    </Form>
  )
}
