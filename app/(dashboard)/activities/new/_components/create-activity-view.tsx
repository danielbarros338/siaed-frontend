'use client'

import { ActivityForm } from '@/features/activities/components/activity-form'
import { useCreateActivity } from '@/features/activities/hooks/use-create-activity'
import type { CreateActivityFormValues } from '@/features/activities/schemas/create-activity-schema'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CreateActivityView() {
  const mutation = useCreateActivity()
  const { user } = useCurrentUser()

  const apiError = mutation.error ? extractActivityErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem criar atividades.</p>
      </div>
    )
  }

  function handleSubmit(values: CreateActivityFormValues) {
    if (!user) return

    mutation.mutate({
      teacherId: user.userId,
      ...values,
    })
  }

  return (
    <div className="space-y-6">
      <Link href="/activities" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Atividades
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criar atividade manual</h1>
        <p className="text-muted-foreground">Preencha os campos para criar a atividade.</p>
      </div>

      <div className="max-w-3xl">
        <ActivityForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}

