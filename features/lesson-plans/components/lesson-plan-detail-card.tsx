'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonPlanOriginBadge } from '@/features/lesson-plans/components/lesson-plan-origin-badge'
import { LessonPlanStatusBadge } from '@/features/lesson-plans/components/lesson-plan-status-badge'
import type { LessonPlan } from '@/features/lesson-plans/types'

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{plan.title}</CardTitle>
          <div className="flex items-center gap-2">
            <LessonPlanStatusBadge status={plan.status} />
            <LessonPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Disciplina" value={plan.subject} />
          <Field label="Série" value={plan.grade} />
          <Field label="Faixa etária" value={plan.ageRange} />
          <Field label="Duração" value={`${plan.durationMinutes} min`} />
          <Field label="Criado em" value={formatDateTime(plan.createdAt)} />
          <Field label="Atualizado em" value={formatDateTime(plan.updatedAt)} />
        </div>

        <TextBlock label="Objetivos" value={plan.objectives} />
        <TextBlock label="Conteúdo" value={plan.content} />
        <TextBlock label="Metodologia" value={plan.methodology} />
        <TextBlock label="Recursos" value={plan.resources} />
        <TextBlock label="Avaliação" value={plan.evaluation} />
      </CardContent>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <section className="space-y-1">
      <h2 className="text-sm font-semibold">{label}</h2>
      <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
    </section>
  )
}
