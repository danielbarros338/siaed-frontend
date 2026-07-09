'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useTeacherClassesForSelect } from '@/features/classes/hooks/use-teacher-classes-for-select'
import {
    generateLessonPlanSchema,
    type GenerateLessonPlanFormValues,
} from '@/features/lesson-plans/schemas/generate-lesson-plan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
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
  const { data: classesData } = useTeacherClassesForSelect()
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

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-sm font-semibold">Contexto para geração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <FormLabel>Turma</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classesData?.items.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-[linear-gradient(135deg,#7c3aed_0%,#5b21b6_100%)] border-0 hover:opacity-90"
        >
          {isSubmitting ? 'Gerando plano...' : 'Gerar plano com IA'}
        </Button>
      </form>
    </Form>
  )
}
