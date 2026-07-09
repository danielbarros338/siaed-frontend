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
    generateTeachingPlanSchema,
    type GenerateTeachingPlanFormValues,
} from '@/features/teaching-plans/schemas/generate-teaching-plan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface TeachingPlanGenerateFormProps {
  onSubmit: (values: GenerateTeachingPlanFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
  timeoutReached?: boolean
}

export function TeachingPlanGenerateForm({
  onSubmit,
  isSubmitting,
  apiError,
  timeoutReached,
}: TeachingPlanGenerateFormProps) {
  const { data: classesData } = useTeacherClassesForSelect()
  const form = useForm<
    z.input<typeof generateTeachingPlanSchema>,
    unknown,
    GenerateTeachingPlanFormValues
  >({
    resolver: zodResolver(generateTeachingPlanSchema),
    defaultValues: {
      subject: '',
      course: '',
      grade: '',
      academicPeriod: '',
      workloadHours: 80,
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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0066cc]/10 text-[#0066cc]">
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
              <FormField control={form.control} name="course" render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso/Segmento</FormLabel>
                  <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <FormField control={form.control} name="academicPeriod" render={({ field }) => (
                <FormItem>
                  <FormLabel>Período letivo</FormLabel>
                  <FormControl><Input placeholder="Ex.: 2026/1" disabled={isSubmitting} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="workloadHours" render={({ field }) => (
                <FormItem>
                  <FormLabel>Carga horária (h)</FormLabel>
                  <FormControl><Input type="number" min={1} max={2000} disabled={isSubmitting} {...field} value={(field.value as number | undefined) ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="additionalInstructions" render={({ field }) => (
              <FormItem>
                <FormLabel>Instruções adicionais</FormLabel>
                <FormControl>
                  <Textarea rows={5} disabled={isSubmitting} placeholder="Contexto, ênfases curriculares, adaptações..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] border-0 hover:opacity-90"
        >
          {isSubmitting ? 'Gerando plano...' : 'Gerar plano com IA'}
        </Button>
      </form>
    </Form>
  )
}
