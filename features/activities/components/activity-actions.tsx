'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArchiveActivityDialog } from '@/features/activities/components/archive-activity-dialog'
import { DeleteActivityDialog } from '@/features/activities/components/delete-activity-dialog'
import { PublishActivityDialog } from '@/features/activities/components/publish-activity-dialog'
import { useArchiveActivity } from '@/features/activities/hooks/use-archive-activity'
import { useDeleteActivity } from '@/features/activities/hooks/use-delete-activity'
import { usePublishActivity } from '@/features/activities/hooks/use-publish-activity'
import type { Activity } from '@/features/activities/types'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ActivityActionsProps {
  plan: Activity
}

export function ActivityActions({ plan }: ActivityActionsProps) {
  const [publishOpen, setPublishOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const publishMutation = usePublishActivity(plan.id)
  const archiveMutation = useArchiveActivity(plan.id)
  const deleteMutation = useDeleteActivity(plan.id)

  const isBusy = publishMutation.isPending || archiveMutation.isPending || deleteMutation.isPending
  const canPublish = plan.status === 1
  const canArchive = plan.status !== 3

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="sm" disabled={isBusy}>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">AÃ§Ãµes</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/activities/${plan.id}`}>Visualizar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/activities/${plan.id}/edit`}>Editar</Link>
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
    </>
  )
}

