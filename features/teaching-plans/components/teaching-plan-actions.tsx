'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArchiveTeachingPlanDialog } from '@/features/teaching-plans/components/archive-teaching-plan-dialog'
import { DeleteTeachingPlanDialog } from '@/features/teaching-plans/components/delete-teaching-plan-dialog'
import { PublishTeachingPlanDialog } from '@/features/teaching-plans/components/publish-teaching-plan-dialog'
import { useArchiveTeachingPlan } from '@/features/teaching-plans/hooks/use-archive-teaching-plan'
import { useDeleteTeachingPlan } from '@/features/teaching-plans/hooks/use-delete-teaching-plan'
import { usePublishTeachingPlan } from '@/features/teaching-plans/hooks/use-publish-teaching-plan'
import type { TeachingPlan } from '@/features/teaching-plans/types'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface TeachingPlanActionsProps {
  plan: TeachingPlan
}

export function TeachingPlanActions({ plan }: TeachingPlanActionsProps) {
  const [publishOpen, setPublishOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const publishMutation = usePublishTeachingPlan(plan.id)
  const archiveMutation = useArchiveTeachingPlan(plan.id)
  const deleteMutation = useDeleteTeachingPlan(plan.id)

  const isBusy = publishMutation.isPending || archiveMutation.isPending || deleteMutation.isPending
  const canPublish = plan.status === 1
  const canArchive = plan.status !== 3

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" disabled={isBusy}>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/teaching-plan/${plan.id}`}>Visualizar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/teaching-plan/${plan.id}/edit`}>Editar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canPublish || isBusy} onClick={() => setPublishOpen(true)}>
            Publicar
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canArchive || isBusy} onClick={() => setArchiveOpen(true)}>
            Arquivar
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled={isBusy} onClick={() => setDeleteOpen(true)}>
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  )
}
