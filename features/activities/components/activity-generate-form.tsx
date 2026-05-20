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
    generateActivitySchema,
    type GenerateActivityFormValues,
} from '@/features/activities/schemas/generate-activity-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface LessonPlanOption {
  id: string
  title: string
  subject: string
  grade: string
  ageRange: string
}

interface ActivityGenerateFormProps {
  onSubmit: (values: GenerateActivityFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
  timeoutReached?: boolean
  lessonPlans: LessonPlanOption[]
  isLoadingLessonPlans?: boolean
}

export function ActivityGenerateForm({
  onSubmit,
  isSubmitting,
  apiError,
  timeoutReached,
  lessonPlans,
  isLoadingLessonPlans,
}: ActivityGenerateFormProps) {
  const form = useForm<
    z.input<typeof generateActivitySchema>,
    unknown,
    GenerateActivityFormValues
  >({
    resolver: zodResolver(generateActivitySchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      lessonPlanId: '',
      subject: '',
      grade: '',
      ageRange: '',
      type: 1,
      numberOfQuestions: 5,
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

        <FormField control={form.control} name="lessonPlanId" render={({ field }) => (
          <FormItem>
            <FormLabel>Plano de aula</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value)
                const selected = lessonPlans.find((plan) => plan.id === value)
                if (!selected) return

                form.setValue('subject', selected.subject, { shouldValidate: false })
                form.setValue('grade', selected.grade, { shouldValidate: false })
                form.setValue('ageRange', selected.ageRange, { shouldValidate: false })
              }}
              disabled={isSubmitting || isLoadingLessonPlans}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingLessonPlans ? 'Carregando planos...' : 'Selecione um plano'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {lessonPlans.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    Nenhum plano disponível
                  </SelectItem>
                ) : (
                  lessonPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title} - {plan.subject} - {plan.grade}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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

        <FormField control={form.control} name="numberOfQuestions" render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade de questões</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={100}
                disabled={isSubmitting}
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

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
          {isSubmitting ? 'Gerando atividade...' : 'Gerar atividade com IA'}
        </Button>
      </form>
    </Form>
  )
}

