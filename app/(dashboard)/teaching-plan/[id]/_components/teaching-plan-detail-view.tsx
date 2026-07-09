'use client'

import { Button } from '@/components/ui/button'
import { ArchiveTeachingPlanDialog } from '@/features/teaching-plans/components/archive-teaching-plan-dialog'
import { DeleteTeachingPlanDialog } from '@/features/teaching-plans/components/delete-teaching-plan-dialog'
import { TeachingPlanDetailCard } from '@/features/teaching-plans/components/teaching-plan-detail-card'
import { PublishTeachingPlanDialog } from '@/features/teaching-plans/components/publish-teaching-plan-dialog'
import { useArchiveTeachingPlan } from '@/features/teaching-plans/hooks/use-archive-teaching-plan'
import { useDeleteTeachingPlan } from '@/features/teaching-plans/hooks/use-delete-teaching-plan'
import { useTeachingPlanDetail } from '@/features/teaching-plans/hooks/use-teaching-plan-detail'
import { usePublishTeachingPlan } from '@/features/teaching-plans/hooks/use-publish-teaching-plan'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface TeachingPlanDetailViewProps {
  id: string
}

export function TeachingPlanDetailView({ id }: TeachingPlanDetailViewProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const [publishOpen, setPublishOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: plan, isLoading, error, refetch } = useTeachingPlanDetail(id)
  const publishMutation = usePublishTeachingPlan(id)
  const archiveMutation = useArchiveTeachingPlan(id)
  const deleteMutation = useDeleteTeachingPlan(id, {
    onSuccess: () => router.push('/teaching-plan'),
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
    return <p className="text-sm text-muted-foreground">Carregando plano de ensino...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar plano de ensino.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractTeachingPlanErrors(error)[0]}</p>
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
      <Link href="/teaching-plan" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de ensino
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={isBusy} className="hover:border-[#0066cc]/40 hover:bg-[#0066cc]/5 hover:text-[#0066cc]">
          <Link href={`/teaching-plan/${id}/edit`}>
            <Pencil className="mr-1 size-4" />
            Editar
          </Link>
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={plan.status !== 1 || isBusy} onClick={() => setPublishOpen(true)} className="hover:border-[#0066cc]/40 hover:bg-[#0066cc]/5 hover:text-[#0066cc]">
          Publicar
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={plan.status === 3 || isBusy} onClick={() => setArchiveOpen(true)} className="hover:border-[#0066cc]/40 hover:bg-[#0066cc]/5 hover:text-[#0066cc]">
          Arquivar
        </Button>
        <Button type="button" size="sm" variant="destructive" disabled={isBusy} onClick={() => setDeleteOpen(true)}>
          Excluir
        </Button>
      </div>

      <TeachingPlanDetailCard plan={plan} />

      <PublishTeachingPlanDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title={plan.title}
        onConfirm={() => publishMutation.mutate()}
        isPending={publishMutation.isPending}
      />
      <ArchiveTeachingPlanDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={plan.title}
        onConfirm={() => archiveMutation.mutate()}
        isPending={archiveMutation.isPending}
      />
      <DeleteTeachingPlanDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={plan.title}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
