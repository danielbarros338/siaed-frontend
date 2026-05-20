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
            <FormLabel>TÃ­tulo</FormLabel>
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
              <FormLabel>SÃ©rie</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="durationMinutes" render={({ field }) => (
            <FormItem>
              <FormLabel>DuraÃ§Ã£o (min)</FormLabel>
              <FormControl><Input type="number" min={10} max={600} disabled={isSubmitting} {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="ageRange" render={({ field }) => (
            <FormItem>
              <FormLabel>Faixa etÃ¡ria</FormLabel>
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
            <FormLabel>ConteÃºdo</FormLabel>
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
            <FormLabel>AvaliaÃ§Ã£o</FormLabel>
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
            <FormLabel>TÃ­tulo</FormLabel>
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
            <FormLabel>ConteÃºdo</FormLabel>
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
            <FormLabel>AvaliaÃ§Ã£o</FormLabel>
            <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar alteraÃ§Ãµes'}
        </Button>
      </form>
    </Form>
  )
}


