'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeachingPlanOriginBadge } from '@/features/teaching-plans/components/teaching-plan-origin-badge'
import { TeachingPlanStatusBadge } from '@/features/teaching-plans/components/teaching-plan-status-badge'
import type { TeachingPlan } from '@/features/teaching-plans/types'
import { GraduationCap } from 'lucide-react'

interface TeachingPlanDetailCardProps {
  plan: TeachingPlan
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function TeachingPlanDetailCard({ plan }: TeachingPlanDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0066cc]/10 text-[#0066cc]">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0066cc]">
                Plano de Ensino
              </p>
              <CardTitle className="mt-0.5">{plan.title}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TeachingPlanStatusBadge status={plan.status} />
            <TeachingPlanOriginBadge isAIGenerated={plan.isAIGenerated} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Disciplina" value={plan.subject} />
          <Field label="Curso/Segmento" value={plan.course} />
          <Field label="Turma" value={plan.grade} />
          <Field label="Período letivo" value={plan.academicPeriod} />
          <Field label="Carga horária" value={`${plan.workloadHours}h`} />
          <Field label="Criado em" value={formatDateTime(plan.createdAt)} />
          <Field label="Atualizado em" value={formatDateTime(plan.updatedAt)} />
        </div>

        <TextBlock label="Ementa" value={plan.syllabus} />
        <TextBlock label="Objetivos Gerais" value={plan.generalObjectives} />
        <TextBlock label="Objetivos Específicos" value={plan.specificObjectives} />
        <TextBlock label="Conteúdo Programático" value={plan.programContent} />
        <TextBlock label="Estratégias Metodológicas" value={plan.methodology} />
        <TextBlock label="Critérios e Instrumentos de Avaliação" value={plan.evaluationCriteria} />
        <TextBlock label="Cronograma" value={plan.schedule} />
        <TextBlock label="Bibliografia Básica" value={plan.basicBibliography} />
        <TextBlock label="Bibliografia Complementar" value={plan.complementaryBibliography} />
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
    <section className="space-y-1 border-l-2 border-l-[#0066cc]/30 pl-3">
      <h2 className="text-sm font-semibold">{label}</h2>
      <p className="whitespace-pre-line text-sm text-muted-foreground">{value}</p>
    </section>
  )
}
