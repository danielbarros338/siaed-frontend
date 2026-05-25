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
import { Textarea } from '@/components/ui/textarea'
import {
    createLessonPlanSchema,
    type CreateLessonPlanFormValues,
} from '@/features/lesson-plans/schemas/create-lesson-plan-schema'
import {
    updateLessonPlanSchema,
    type UpdateLessonPlanFormValues,
} from '@/features/lesson-plans/schemas/update-lesson-plan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

type CreateMode = {
  mode: 'create'
  defaultValues?: Partial<CreateLessonPlanFormValues>
  onSubmit: (values: CreateLessonPlanFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type EditMode = {
  mode: 'edit'
  defaultValues?: Partial<UpdateLessonPlanFormValues>
  onSubmit: (values: UpdateLessonPlanFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type LessonPlanFormProps = CreateMode | EditMode

export function LessonPlanForm(props: LessonPlanFormProps) {
  if (props.mode === 'create') {
    return <CreateLessonPlanInner {...props} />
  }

  return <EditLessonPlanInner {...props} />
}

function CreateLessonPlanInner({ defaultValues, onSubmit, isSubmitting, apiError }: CreateMode) {
  const form = useForm<CreateLessonPlanFormValues>({
    resolver: zodResolver(createLessonPlanSchema) as unknown as Resolver<CreateLessonPlanFormValues>,
    defaultValues: {
      durationMinutes: 50,
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
          <FormField control={form.control} name="durationMinutes" render={({ field }) => (
            <FormItem>
              <FormLabel>Duração (min)</FormLabel>
              <FormControl><Input type="number" min={10} max={600} disabled={isSubmitting} {...field} value={(field.value as number | undefined) ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="ageRange" render={({ field }) => (
            <FormItem>
              <FormLabel>Faixa etária</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="objectives" render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos</FormLabel>
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

        <FormField control={form.control} name="methodology" render={({ field }) => (
          <FormItem>
            <FormLabel>Metodologia</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="resources" render={({ field }) => (
          <FormItem>
            <FormLabel>Recursos</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="evaluation" render={({ field }) => (
          <FormItem>
            <FormLabel>Avaliação</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar plano'}
        </Button>
      </form>
    </Form>
  )
}

function EditLessonPlanInner({ defaultValues, onSubmit, isSubmitting, apiError }: EditMode) {
  const form = useForm<UpdateLessonPlanFormValues>({
    resolver: zodResolver(updateLessonPlanSchema) as unknown as Resolver<UpdateLessonPlanFormValues>,
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

        <FormField control={form.control} name="objectives" render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos</FormLabel>
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

        <FormField control={form.control} name="methodology" render={({ field }) => (
          <FormItem>
            <FormLabel>Metodologia</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="resources" render={({ field }) => (
          <FormItem>
            <FormLabel>Recursos</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="evaluation" render={({ field }) => (
          <FormItem>
            <FormLabel>Avaliação</FormLabel>
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

