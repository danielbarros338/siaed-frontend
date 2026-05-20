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
import { Input } from '@/components/ui/input'
import { useTeachers } from '@/features/classes/hooks/use-teachers'
import { createClassSchema, type CreateClassFormValues } from '@/features/classes/schemas/create-class-schema'
import { editClassSchema } from '@/features/classes/schemas/edit-class-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'

type TeacherOption = {
  id: string
  name: string
  subject?: string | null
}

type CreateMode = {
  mode: 'create'
  defaultValues?: Partial<CreateClassFormValues>
  preloadedTeachers?: TeacherOption[]
  onSubmit: (data: CreateClassFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type EditMode = {
  mode: 'edit'
  defaultValues?: Partial<CreateClassFormValues>
  preloadedTeachers?: TeacherOption[]
  onSubmit: (data: CreateClassFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type ClassFormProps = CreateMode | EditMode

export function ClassForm(props: ClassFormProps) {
  const { mode, isSubmitting, apiError } = props
  const {
    data: teachers,
    isLoading: isTeachersLoading,
    isError: hasTeachersError,
    refetch: refetchTeachers,
  } = useTeachers()
  const teacherOptions = useMemo(() => {
    const byId = new Map<string, TeacherOption>()
    const availableTeachers = teachers ?? []
    const preloadedTeachers = props.preloadedTeachers ?? []

    availableTeachers.forEach((teacher) => {
      byId.set(teacher.id, teacher)
    })

    // Prioriza nome vindo do GET da turma para manter consistencia com o detalhe carregado.
    preloadedTeachers.forEach((teacher) => {
      byId.set(teacher.id, teacher)
    })

    return Array.from(byId.values())
  }, [teachers, props.preloadedTeachers])

  const schema = mode === 'create' ? createClassSchema : editClassSchema

  const form = useForm<CreateClassFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<CreateClassFormValues>,
    defaultValues: {
      schoolYear: new Date().getFullYear(),
      teacherIds: [],
      ...(props.defaultValues ?? {}),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-6">
        {apiError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da turma</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: 7º Ano A" autoComplete="off" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Série</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: 7º Ano" autoComplete="off" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schoolYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano letivo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2000}
                    max={2100}
                    disabled={isSubmitting}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="teacherIds"
          render={({ field }) => {
            const selectedTeacherIds = field.value ?? []

            return (
              <FormItem>
                <FormLabel>Professores</FormLabel>
                <FormControl>
                  <div className="rounded-md border p-3">
                    {isTeachersLoading ? (
                      <p className="text-sm text-muted-foreground">Carregando professores...</p>
                    ) : null}

                    {hasTeachersError ? (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-destructive">Erro ao carregar professores.</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => refetchTeachers()}
                          disabled={isSubmitting}
                        >
                          Tentar novamente
                        </Button>
                      </div>
                    ) : null}

                    {!isTeachersLoading && !hasTeachersError && teacherOptions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum professor disponível.</p>
                    ) : null}

                    {!isTeachersLoading && !hasTeachersError && teacherOptions.length > 0 ? (
                      <div className="max-h-56 space-y-2 overflow-y-auto">
                        {teacherOptions.map((teacher) => {
                          const isChecked = selectedTeacherIds.includes(teacher.id)

                          return (
                            <label
                              key={teacher.id}
                              className="flex cursor-pointer items-start gap-3 rounded-md border p-2 transition hover:bg-muted/40"
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5"
                                checked={isChecked}
                                disabled={isSubmitting}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    field.onChange([...selectedTeacherIds, teacher.id])
                                    return
                                  }

                                  field.onChange(selectedTeacherIds.filter((id) => id !== teacher.id))
                                }}
                              />

                              <span className="flex flex-col text-sm">
                                <span className="font-medium text-foreground">{teacher.name}</span>
                                <span className="text-muted-foreground">
                                  {teacher.subject?.trim() ? teacher.subject : 'Sem disciplina definida'}
                                </span>
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Cadastrar turma' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  )
}
