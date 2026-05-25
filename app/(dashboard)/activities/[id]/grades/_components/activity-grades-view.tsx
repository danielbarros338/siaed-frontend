'use client'

import { ActivityGradesSection } from '@/features/activities/components/activity-grades-section'
import { useActivityDetail } from '@/features/activities/hooks/use-activity-detail'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ActivityGradesViewProps {
  id: string
}

export function ActivityGradesView({ id }: ActivityGradesViewProps) {
  const { user } = useCurrentUser()
  const { data: activity, isLoading, error } = useActivityDetail(id)

  if (user?.role !== 1 && user?.role !== 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores e coordenadores podem acessar a sessao de notas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para atividade
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sessao de notas</h1>
        <p className="text-muted-foreground">
          {isLoading
            ? 'Carregando atividade...'
            : error
              ? extractActivityErrors(error)[0]
              : `Atividade: ${activity?.title ?? id}`}
        </p>
      </div>

      <ActivityGradesSection activityId={id} />
    </div>
  )
}
