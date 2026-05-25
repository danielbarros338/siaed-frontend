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
    generateLessonPlanSchema,
    type GenerateLessonPlanFormValues,
} from '@/features/lesson-plans/schemas/generate-lesson-plan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface LessonPlanGenerateFormProps {
  onSubmit: (values: GenerateLessonPlanFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
  timeoutReached?: boolean
}

export function LessonPlanGenerateForm({
  onSubmit,
  isSubmitting,
  apiError,
  timeoutReached,
}: LessonPlanGenerateFormProps) {
  const form = useForm<
    z.input<typeof generateLessonPlanSchema>,
    unknown,
    GenerateLessonPlanFormValues
  >({
    resolver: zodResolver(generateLessonPlanSchema),
    defaultValues: {
      subject: '',
      grade: '',
      ageRange: '',
      durationMinutes: 50,
      additionalInstructions: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </p>
        )}

        {timeoutReached && (
          <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700">
            A geração ultrapassou 60 segundos. Você pode tentar novamente.
          </p>
        )}

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
          <FormField control={form.control} name="durationMinutes" render={({ field }) => (
            <FormItem>
              <FormLabel>Duração (min)</FormLabel>
              <FormControl><Input type="number" min={10} max={600} disabled={isSubmitting} {...field} value={(field.value as number | undefined) ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="additionalInstructions" render={({ field }) => (
          <FormItem>
            <FormLabel>Instruções adicionais</FormLabel>
            <FormControl>
              <Textarea rows={5} disabled={isSubmitting} placeholder="Contexto, preferências metodológicas, adaptações..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Gerando plano...' : 'Gerar plano com IA'}
        </Button>
      </form>
    </Form>
  )
}
