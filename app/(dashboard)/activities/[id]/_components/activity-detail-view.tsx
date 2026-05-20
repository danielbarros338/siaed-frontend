'use client'

import { Button } from '@/components/ui/button'
import { ArchiveActivityDialog } from '@/features/activities/components/archive-activity-dialog'
import { DeleteActivityDialog } from '@/features/activities/components/delete-activity-dialog'
import { ActivityDetailCard } from '@/features/activities/components/activity-detail-card'
import { PublishActivityDialog } from '@/features/activities/components/publish-activity-dialog'
import { useArchiveActivity } from '@/features/activities/hooks/use-archive-activity'
import { useDeleteActivity } from '@/features/activities/hooks/use-delete-activity'
import { useActivityDetail } from '@/features/activities/hooks/use-activity-detail'
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

  const { data: plan, isLoading, error, refetch } = useActivityDetail(id)
  const publishMutation = usePublishActivity(id)
  const archiveMutation = useArchiveActivity(id)
  const deleteMutation = useDeleteActivity(id, {
    onSuccess: () => router.push('/activities'),
  })

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem acessar este mÃ³dulo.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando plano de aula...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar plano de aula.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractActivityErrors(error)[0]}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!plan) {
    return null
  }

  const isBusy = publishMutation.isPending || archiveMutation.isPending || deleteMutation.isPending

  return (
    <div className="space-y-6">
      <Link href="/activities" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de aula
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={isBusy}>
          <Link href={`/activities/${id}/edit`}>
            <Pencil className="mr-1 size-4" />
            Editar
          </Link>
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={plan.status !== 1 || isBusy} onClick={() => setPublishOpen(true)}>
          Publicar
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={plan.status === 3 || isBusy} onClick={() => setArchiveOpen(true)}>
          Arquivar
        </Button>
        <Button type="button" size="sm" variant="destructive" disabled={isBusy} onClick={() => setDeleteOpen(true)}>
          Excluir
        </Button>
      </div>

      <ActivityDetailCard plan={plan} />

      <PublishActivityDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={plan.title}
        onConfirm={() => publishMutation.mutate()}
        isPending={publishMutation.isPending}
      />
      <ArchiveActivityDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={plan.title}
        onConfirm={() => archiveMutation.mutate()}
        isPending={archiveMutation.isPending}
      />
      <DeleteActivityDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={plan.title}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}

