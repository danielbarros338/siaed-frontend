'use client'

import { Button } from '@/components/ui/button'
import { ActivityDetailCard } from '@/features/activities/components/activity-detail-card'
import { ActivityGradesSection } from '@/features/activities/components/activity-grades-section'
import { ArchiveActivityDialog } from '@/features/activities/components/archive-activity-dialog'
import { DeleteActivityDialog } from '@/features/activities/components/delete-activity-dialog'
import { PublishActivityDialog } from '@/features/activities/components/publish-activity-dialog'
import { useActivityDetail } from '@/features/activities/hooks/use-activity-detail'
import { useArchiveActivity } from '@/features/activities/hooks/use-archive-activity'
import { useDeleteActivity } from '@/features/activities/hooks/use-delete-activity'
import { usePublishActivity } from '@/features/activities/hooks/use-publish-activity'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ActivityDetailViewProps {
  id: string
}

export function ActivityDetailView({ id }: ActivityDetailViewProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const [publishOpen, setPublishOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: activity, isLoading, error, refetch } = useActivityDetail(id)
  const publishMutation = usePublishActivity(id)
  const archiveMutation = useArchiveActivity(id)
  const deleteMutation = useDeleteActivity(id, {
    onSuccess: () => router.push('/activities'),
  })

  if (user?.role !== 1 && user?.role !== 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores e coordenadores podem acessar este módulo.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando atividade...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar atividade.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractActivityErrors(error)[0]}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!activity) {
    return null
  }

  const isBusy = publishMutation.isPending || archiveMutation.isPending || deleteMutation.isPending

  return (
    <div className="space-y-6">
      <Link href="/activities" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Atividades
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={isBusy}>
          <Link href={`/activities/${id}/grades`}>Sessao de notas</Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={isBusy}>
          <Link href={`/activities/${id}/edit`}>
            <Pencil className="mr-1 size-4" />
            Editar
          </Link>
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={activity.status !== 1 || isBusy} onClick={() => setPublishOpen(true)}>
          Publicar
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={activity.status === 3 || isBusy} onClick={() => setArchiveOpen(true)}>
          Arquivar
        </Button>
        <Button type="button" size="sm" variant="destructive" disabled={isBusy} onClick={() => setDeleteOpen(true)}>
          Excluir
        </Button>
      </div>

      <ActivityDetailCard activity={activity} />
      <ActivityGradesSection activityId={activity.id} />

      <PublishActivityDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={activity.title}
        onConfirm={() => publishMutation.mutate()}
        isPending={publishMutation.isPending}
      />
      <ArchiveActivityDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={activity.title}
        onConfirm={() => archiveMutation.mutate()}
        isPending={archiveMutation.isPending}
      />
      <DeleteActivityDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={activity.title}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}

