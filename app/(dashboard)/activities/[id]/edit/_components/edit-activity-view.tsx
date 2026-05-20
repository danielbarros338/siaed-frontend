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
  const { data: plan, isLoading, error, refetch } = useActivityDetail(id)
  const mutation = useUpdateActivity(id)

  const apiError = mutation.error ? extractActivityErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem editar planos de aula.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando plano de aula...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar plano para ediÃ§Ã£o.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractActivityErrors(error)[0]}</p>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!plan || !user) {
    return null
  }

  const userId = user.userId

  function handleSubmit(values: UpdateActivityFormValues) {
    mutation.mutate({
      id,
      requestingUserId: userId,
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
        <h1 className="text-2xl font-bold tracking-tight">Editar plano</h1>
        <p className="text-muted-foreground">Atualize os campos pedagÃ³gicos permitidos.</p>
      </div>

      <div className="max-w-3xl">
        <ActivityForm
          mode="edit"
          defaultValues={{
            title: plan.title,
            objectives: plan.objectives,
            content: plan.content,
            methodology: plan.methodology,
            resources: plan.resources,
            evaluation: plan.evaluation,
          }}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}

