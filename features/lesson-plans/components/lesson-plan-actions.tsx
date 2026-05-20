'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArchiveLessonPlanDialog } from '@/features/lesson-plans/components/archive-lesson-plan-dialog'
import { DeleteLessonPlanDialog } from '@/features/lesson-plans/components/delete-lesson-plan-dialog'
import { PublishLessonPlanDialog } from '@/features/lesson-plans/components/publish-lesson-plan-dialog'
import { useArchiveLessonPlan } from '@/features/lesson-plans/hooks/use-archive-lesson-plan'
import { useDeleteLessonPlan } from '@/features/lesson-plans/hooks/use-delete-lesson-plan'
import { usePublishLessonPlan } from '@/features/lesson-plans/hooks/use-publish-lesson-plan'
import type { LessonPlan } from '@/features/lesson-plans/types'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface LessonPlanActionsProps {
  plan: LessonPlan
}

export function LessonPlanActions({ plan }: LessonPlanActionsProps) {
  const [publishOpen, setPublishOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const publishMutation = usePublishLessonPlan(plan.id)
  const archiveMutation = useArchiveLessonPlan(plan.id)
  const deleteMutation = useDeleteLessonPlan(plan.id)

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
            <Link href={`/lesson-plans/${plan.id}`}>Visualizar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/lesson-plans/${plan.id}/edit`}>Editar</Link>
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
    </>
  )
}
