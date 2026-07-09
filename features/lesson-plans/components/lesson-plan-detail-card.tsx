'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonPlanOriginBadge } from '@/features/lesson-plans/components/lesson-plan-origin-badge'
import { LessonPlanStatusBadge } from '@/features/lesson-plans/components/lesson-plan-status-badge'
import type { LessonPlan } from '@/features/lesson-plans/types'
import { ClipboardList } from 'lucide-react'

interface LessonPlanDetailCardProps {
  plan: LessonPlan
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function LessonPlanDetailCard({ plan }: LessonPlanDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">
                Plano de Aula
              </p>
              <CardTitle className="mt-0.5">{plan.title}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LessonPlanStatusBadge status={plan.status} />
            <LessonPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Disciplina" value={plan.subject} />
          <Field label="Turma" value={plan.grade} />
          <Field label="Faixa etária" value={plan.ageRange} />
          <Field label="Duração" value={`${plan.durationMinutes} min`} />
          <Field label="Criado em" value={formatDateTime(plan.createdAt)} />
          <Field label="Atualizado em" value={formatDateTime(plan.updatedAt)} />
        </div>

        <TextBlock label="Objetivos Educacionais" value={plan.objectives} />
        <TextBlock label="Conteúdos" value={plan.content} />
        <TextBlock label="Estratégias Metodológicas" value={plan.methodology} />
        <TextBlock label="Recursos Didáticos" value={plan.resources} />
        <TextBlock label="Critérios e Instrumentos de Avaliação" value={plan.evaluation} />
        <TextBlock label="Referências" value={plan.references} />
      </CardContent>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <section className="space-y-1 border-l-2 border-l-violet-300 pl-3">
      <h2 className="text-sm font-semibold">{label}</h2>
      <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
    </section>
  )
}
