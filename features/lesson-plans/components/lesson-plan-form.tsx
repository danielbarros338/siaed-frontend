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

const SECTION_ICON_CLASS = 'flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-100 text-[10px] font-bold text-violet-600'

function FormSection({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <span className={SECTION_ICON_CLASS}>{step}</span>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

export function LessonPlanForm(props: LessonPlanFormProps) {
  if (props.mode === 'create') {
    return <CreateLessonPlanInner {...props} />
  }

  return <EditLessonPlanInner {...props} />
}

function CreateLessonPlanInner({ defaultValues, onSubmit, isSubmitting, apiError }: CreateMode) {
  const { data: classesData } = useTeacherClassesForSelect()
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

        <FormSection step="1" title="Identificação da Aula">
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
        </FormSection>

        <FormSection step="2" title="Objetivos Educacionais">
          <FormField control={form.control} name="objectives" render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Educacionais</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="3" title="Conteúdos">
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdos</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="4" title="Estratégias Metodológicas">
          <FormField control={form.control} name="methodology" render={({ field }) => (
            <FormItem>
              <FormLabel>Estratégias Metodológicas</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="5" title="Recursos Didáticos">
          <FormField control={form.control} name="resources" render={({ field }) => (
            <FormItem>
              <FormLabel>Recursos Didáticos</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="6" title="Critérios e Instrumentos de Avaliação">
          <FormField control={form.control} name="evaluation" render={({ field }) => (
            <FormItem>
              <FormLabel>Critérios e Instrumentos de Avaliação</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="7" title="Referências">
          <FormField control={form.control} name="references" render={({ field }) => (
            <FormItem>
              <FormLabel>Referências</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-[linear-gradient(135deg,#7c3aed_0%,#5b21b6_100%)] border-0 hover:opacity-90"
        >
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

        <FormSection step="1" title="Identificação da Aula">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="2" title="Objetivos Educacionais">
          <FormField control={form.control} name="objectives" render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Educacionais</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="3" title="Conteúdos">
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdos</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="4" title="Estratégias Metodológicas">
          <FormField control={form.control} name="methodology" render={({ field }) => (
            <FormItem>
              <FormLabel>Estratégias Metodológicas</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="5" title="Recursos Didáticos">
          <FormField control={form.control} name="resources" render={({ field }) => (
            <FormItem>
              <FormLabel>Recursos Didáticos</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="6" title="Critérios e Instrumentos de Avaliação">
          <FormField control={form.control} name="evaluation" render={({ field }) => (
            <FormItem>
              <FormLabel>Critérios e Instrumentos de Avaliação</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="7" title="Referências">
          <FormField control={form.control} name="references" render={({ field }) => (
            <FormItem>
              <FormLabel>Referências</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-[linear-gradient(135deg,#7c3aed_0%,#5b21b6_100%)] border-0 hover:opacity-90"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  )
}
