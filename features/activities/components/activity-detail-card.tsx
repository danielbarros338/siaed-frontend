'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityOriginBadge } from '@/features/activities/components/activity-origin-badge'
import { ActivityStatusBadge } from '@/features/activities/components/activity-status-badge'
import type { Activity } from '@/features/activities/types'
import { getActivityTypeLabel } from '@/features/activities/utils/activity-status'

interface ActivityDetailCardProps {
  activity: Activity
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function ActivityDetailCard({ activity }: ActivityDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{activity.title}</CardTitle>
          <div className="flex items-center gap-2">
            <ActivityStatusBadge status={activity.status} />
            <ActivityOriginBadge isAIGenerated={activity.isAIGenerated} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Disciplina" value={activity.subject} />
          <Field label="Série" value={activity.grade} />
          <Field label="Faixa etária" value={activity.ageRange} />
          <Field label="Tipo" value={getActivityTypeLabel(activity.type)} />
          <Field label="Plano vinculado" value={activity.lessonPlanId ?? 'Não vinculado'} />
          <Field label="Criado em" value={formatDateTime(activity.createdAt)} />
          <Field label="Atualizado em" value={formatDateTime(activity.updatedAt)} />
        </div>

        <TextBlock label="Descrição" value={activity.description ?? 'Sem descrição.'} />
        <TextBlock label="Conteúdo" value={activity.content} />
        {activity.answerKey && <TextBlock label="Gabarito" value={activity.answerKey} />}
        {activity.simplifiedVersion && (
          <TextBlock label="Versão simplificada" value={activity.simplifiedVersion} />
        )}
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

