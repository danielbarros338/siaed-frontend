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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    createActivitySchema,
    type CreateActivityFormValues,
} from '@/features/activities/schemas/create-activity-schema'
import {
    updateActivitySchema,
    type UpdateActivityFormValues,
} from '@/features/activities/schemas/update-activity-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

type CreateMode = {
  mode: 'create'
  defaultValues?: Partial<CreateActivityFormValues>
  onSubmit: (values: CreateActivityFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type EditMode = {
  mode: 'edit'
  defaultValues?: Partial<UpdateActivityFormValues>
  onSubmit: (values: UpdateActivityFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type ActivityFormProps = CreateMode | EditMode

export function ActivityForm(props: ActivityFormProps) {
  if (props.mode === 'create') {
    return <CreateActivityInner {...props} />
  }

  return <EditActivityInner {...props} />
}

function CreateActivityInner({ defaultValues, onSubmit, isSubmitting, apiError }: CreateMode) {
  const form = useForm<CreateActivityFormValues>({
    resolver: zodResolver(createActivitySchema) as unknown as Resolver<CreateActivityFormValues>,
    defaultValues: {
      description: '',
      type: 1,
      lessonPlanId: null,
      ...(defaultValues ?? {}),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>}

        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="subject" render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="grade" render={({ field }) => (
            <FormItem>
              <FormLabel>Série</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="ageRange" render={({ field }) => (
            <FormItem>
              <FormLabel>Faixa etária</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de atividade</FormLabel>
              <Select
                value={String(field.value ?? '1')}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Exercício</SelectItem>
                  <SelectItem value="2">Questionário</SelectItem>
                  <SelectItem value="3">Projeto</SelectItem>
                  <SelectItem value="4">Lição de casa</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Conteúdo</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="lessonPlanId" render={({ field }) => (
          <FormItem>
            <FormLabel>ID do plano de aula (opcional)</FormLabel>
            <FormControl>
              <Input
                disabled={isSubmitting}
                value={field.value ?? ''}
                onChange={(event) => {
                  const value = event.target.value.trim()
                  field.onChange(value === '' ? null : value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar atividade'}
        </Button>
      </form>
    </Form>
  )
}

function EditActivityInner({ defaultValues, onSubmit, isSubmitting, apiError }: EditMode) {
  const form = useForm<UpdateActivityFormValues>({
    resolver: zodResolver(updateActivitySchema) as unknown as Resolver<UpdateActivityFormValues>,
    defaultValues: defaultValues ?? {},
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>}

        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Conteúdo</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  )
}


