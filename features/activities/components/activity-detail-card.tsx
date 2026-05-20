'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityOriginBadge } from '@/features/activities/components/activity-origin-badge'
import { ActivityStatusBadge } from '@/features/activities/components/activity-status-badge'
import type { Activity } from '@/features/activities/types'

interface ActivityDetailCardProps {
  plan: Activity
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ActivityDetailCard({ plan }: ActivityDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{plan.title}</CardTitle>
          <div className="flex items-center gap-2">
            <ActivityStatusBadge status={plan.status} />
            <ActivityOriginBadge isAIGenerated={plan.isAIGenerated} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Disciplina" value={plan.subject} />
          <Field label="SÃ©rie" value={plan.grade} />
          <Field label="Faixa etÃ¡ria" value={plan.ageRange} />
          <Field label="DuraÃ§Ã£o" value={`${plan.durationMinutes} min`} />
          <Field label="Criado em" value={formatDateTime(plan.createdAt)} />
          <Field label="Atualizado em" value={formatDateTime(plan.updatedAt)} />
        </div>

        <TextBlock label="Objetivos" value={plan.objectives} />
        <TextBlock label="ConteÃºdo" value={plan.content} />
        <TextBlock label="Metodologia" value={plan.methodology} />
        <TextBlock label="Recursos" value={plan.resources} />
        <TextBlock label="AvaliaÃ§Ã£o" value={plan.evaluation} />
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

