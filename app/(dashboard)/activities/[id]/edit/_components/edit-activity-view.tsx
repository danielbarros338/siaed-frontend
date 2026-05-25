'use client'

import { Button } from '@/components/ui/button'
import { ActivityForm } from '@/features/activities/components/activity-form'
import { useActivityDetail } from '@/features/activities/hooks/use-activity-detail'
import { useUpdateActivity } from '@/features/activities/hooks/use-update-activity'
import type { UpdateActivityFormValues } from '@/features/activities/schemas/update-activity-schema'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditActivityViewProps {
  id: string
}

export function EditActivityView({ id }: EditActivityViewProps) {
  const { user } = useCurrentUser()
  const { data: activity, isLoading, error, refetch } = useActivityDetail(id)
  const mutation = useUpdateActivity(id)

  const apiError = mutation.error ? extractActivityErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem editar atividades.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando atividade...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar atividade para edição.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractActivityErrors(error)[0]}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!activity || !user) {
    return null
  }

  function handleSubmit(values: UpdateActivityFormValues) {
    mutation.mutate({
      id,
      ...values,
    })
  }

  return (
    <div className="space-y-6">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para detalhes
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar atividade</h1>
        <p className="text-muted-foreground">Atualize os campos permitidos da atividade.</p>
      </div>

      <div className="max-w-3xl">
        <ActivityForm
          mode="edit"
          defaultValues={{
            title: activity.title,
            description: activity.description ?? '',
            content: activity.content,
          }}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}

