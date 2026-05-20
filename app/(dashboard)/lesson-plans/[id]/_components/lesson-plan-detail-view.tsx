'use client'

import { Button } from '@/components/ui/button'
import { ArchiveLessonPlanDialog } from '@/features/lesson-plans/components/archive-lesson-plan-dialog'
import { DeleteLessonPlanDialog } from '@/features/lesson-plans/components/delete-lesson-plan-dialog'
import { LessonPlanDetailCard } from '@/features/lesson-plans/components/lesson-plan-detail-card'
import { PublishLessonPlanDialog } from '@/features/lesson-plans/components/publish-lesson-plan-dialog'
import { useArchiveLessonPlan } from '@/features/lesson-plans/hooks/use-archive-lesson-plan'
import { useDeleteLessonPlan } from '@/features/lesson-plans/hooks/use-delete-lesson-plan'
import { useLessonPlanDetail } from '@/features/lesson-plans/hooks/use-lesson-plan-detail'
import { usePublishLessonPlan } from '@/features/lesson-plans/hooks/use-publish-lesson-plan'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LessonPlanDetailViewProps {
  id: string
}

export function LessonPlanDetailView({ id }: LessonPlanDetailViewProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const [publishOpen, setPublishOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: plan, isLoading, error, refetch } = useLessonPlanDetail(id)
  const publishMutation = usePublishLessonPlan(id)
  const archiveMutation = useArchiveLessonPlan(id)
  const deleteMutation = useDeleteLessonPlan(id, {
    onSuccess: () => router.push('/lesson-plans'),
  })

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem acessar este módulo.</p>
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
        <p className="mt-1 text-sm text-muted-foreground">{extractLessonPlanErrors(error)[0]}</p>
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
      <Link href="/lesson-plans" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de aula
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={isBusy}>
          <Link href={`/lesson-plans/${id}/edit`}>
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

      <LessonPlanDetailCard plan={plan} />

      <PublishLessonPlanDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={plan.title}
        onConfirm={() => publishMutation.mutate()}
        isPending={publishMutation.isPending}
      />
      <ArchiveLessonPlanDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={plan.title}
        onConfirm={() => archiveMutation.mutate()}
        isPending={archiveMutation.isPending}
      />
      <DeleteLessonPlanDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={plan.title}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
