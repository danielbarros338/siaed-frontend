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
    createTeachingPlanSchema,
    type CreateTeachingPlanFormValues,
} from '@/features/teaching-plans/schemas/create-teaching-plan-schema'
import {
    updateTeachingPlanSchema,
    type UpdateTeachingPlanFormValues,
} from '@/features/teaching-plans/schemas/update-teaching-plan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

type CreateMode = {
  mode: 'create'
  defaultValues?: Partial<CreateTeachingPlanFormValues>
  onSubmit: (values: CreateTeachingPlanFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type EditMode = {
  mode: 'edit'
  defaultValues?: Partial<UpdateTeachingPlanFormValues>
  onSubmit: (values: UpdateTeachingPlanFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type TeachingPlanFormProps = CreateMode | EditMode

const SECTION_ICON_CLASS = 'flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0066cc]/10 text-[10px] font-bold text-[#0066cc]'

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

export function TeachingPlanForm(props: TeachingPlanFormProps) {
  if (props.mode === 'create') {
    return <CreateTeachingPlanInner {...props} />
  }

  return <EditTeachingPlanInner {...props} />
}

function CreateTeachingPlanInner({ defaultValues, onSubmit, isSubmitting, apiError }: CreateMode) {
  const { data: classesData } = useTeacherClassesForSelect()
  const form = useForm<CreateTeachingPlanFormValues>({
    resolver: zodResolver(createTeachingPlanSchema) as unknown as Resolver<CreateTeachingPlanFormValues>,
    defaultValues: {
      workloadHours: 80,
      ...(defaultValues ?? {}),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>}

        <FormSection step="1" title="Identificação">
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
        </FormSection>

        <FormSection step="2" title="Ementa e Objetivos">
          <FormField control={form.control} name="syllabus" render={({ field }) => (
            <FormItem>
              <FormLabel>Ementa</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="generalObjectives" render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Gerais</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="specificObjectives" render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Específicos</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="3" title="Conteúdo e Metodologia">
          <FormField control={form.control} name="programContent" render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo Programático</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="methodology" render={({ field }) => (
            <FormItem>
              <FormLabel>Estratégias Metodológicas</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="4" title="Avaliação e Cronograma">
          <FormField control={form.control} name="evaluationCriteria" render={({ field }) => (
            <FormItem>
              <FormLabel>Critérios e Instrumentos de Avaliação</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="schedule" render={({ field }) => (
            <FormItem>
              <FormLabel>Cronograma</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="5" title="Bibliografia">
          <FormField control={form.control} name="basicBibliography" render={({ field }) => (
            <FormItem>
              <FormLabel>Bibliografia Básica</FormLabel>
              <FormControl><Textarea rows={3} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="complementaryBibliography" render={({ field }) => (
            <FormItem>
              <FormLabel>Bibliografia Complementar</FormLabel>
              <FormControl><Textarea rows={3} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] border-0 hover:opacity-90"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar plano'}
        </Button>
      </form>
    </Form>
  )
}

function EditTeachingPlanInner({ defaultValues, onSubmit, isSubmitting, apiError }: EditMode) {
  const form = useForm<UpdateTeachingPlanFormValues>({
    resolver: zodResolver(updateTeachingPlanSchema) as unknown as Resolver<UpdateTeachingPlanFormValues>,
    defaultValues: defaultValues ?? {},
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>}

        <FormSection step="1" title="Identificação">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl><Input disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="2" title="Ementa e Objetivos">
          <FormField control={form.control} name="syllabus" render={({ field }) => (
            <FormItem>
              <FormLabel>Ementa</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="generalObjectives" render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Gerais</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="specificObjectives" render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos Específicos</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="3" title="Conteúdo e Metodologia">
          <FormField control={form.control} name="programContent" render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo Programático</FormLabel>
              <FormControl><Textarea rows={5} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="methodology" render={({ field }) => (
            <FormItem>
              <FormLabel>Estratégias Metodológicas</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="4" title="Avaliação e Cronograma">
          <FormField control={form.control} name="evaluationCriteria" render={({ field }) => (
            <FormItem>
              <FormLabel>Critérios e Instrumentos de Avaliação</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="schedule" render={({ field }) => (
            <FormItem>
              <FormLabel>Cronograma</FormLabel>
              <FormControl><Textarea rows={4} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <FormSection step="5" title="Bibliografia">
          <FormField control={form.control} name="basicBibliography" render={({ field }) => (
            <FormItem>
              <FormLabel>Bibliografia Básica</FormLabel>
              <FormControl><Textarea rows={3} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="complementaryBibliography" render={({ field }) => (
            <FormItem>
              <FormLabel>Bibliografia Complementar</FormLabel>
              <FormControl><Textarea rows={3} disabled={isSubmitting} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </FormSection>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] border-0 hover:opacity-90"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  )
}
