'use client'

import { Button } from '@/components/ui/button'
import { ClassStatusBadge } from '@/features/classes/components/class-status-badge'
import { DeactivateClassDialog } from '@/features/classes/components/deactivate-class-dialog'
import { ReactivateClassDialog } from '@/features/classes/components/reactivate-class-dialog'
import { useDeleteClass } from '@/features/classes/hooks/use-delete-class'
import { useReactivateClass } from '@/features/classes/hooks/use-reactivate-class'
import type { ClassDetail } from '@/features/classes/types'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ClassActionsProps {
  classData: ClassDetail
}

export function ClassActions({ classData }: ClassActionsProps) {
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [reactivateOpen, setReactivateOpen] = useState(false)

  const deactivateMutation = useDeleteClass(classData.id, {
    onSuccess: () => setDeactivateOpen(false),
  })
  const reactivateMutation = useReactivateClass(classData.id, {
    onSuccess: () => setReactivateOpen(false),
  })
  const isPending = deactivateMutation.isPending || reactivateMutation.isPending

  if (!canWrite) {
    return <ClassStatusBadge status={classData.status} />
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm" disabled={isPending}>
          <Link href={`/classes/${classData.id}/edit`}>
            <Pencil className="mr-1 size-4" />
            Editar
          </Link>
        </Button>

        {classData.status === 1 ? (
          <Button variant="outline" size="sm" onClick={() => setDeactivateOpen(true)} disabled={isPending}>
            Inativar
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setReactivateOpen(true)} disabled={isPending}>
            Reativar
          </Button>
        )}
      </div>

      <DeactivateClassDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        className={classData.name}
        onConfirm={() => deactivateMutation.mutate()}
        isPending={deactivateMutation.isPending}
      />

      <ReactivateClassDialog
        open={reactivateOpen}
        onOpenChange={setReactivateOpen}
        className={classData.name}
        onConfirm={() => reactivateMutation.mutate()}
        isPending={reactivateMutation.isPending}
      />
    </>
  )
}
