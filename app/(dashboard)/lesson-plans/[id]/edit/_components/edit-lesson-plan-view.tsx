'use client'

import { Button } from '@/components/ui/button'
import { LessonPlanForm } from '@/features/lesson-plans/components/lesson-plan-form'
import { useLessonPlanDetail } from '@/features/lesson-plans/hooks/use-lesson-plan-detail'
import { useUpdateLessonPlan } from '@/features/lesson-plans/hooks/use-update-lesson-plan'
import type { UpdateLessonPlanFormValues } from '@/features/lesson-plans/schemas/update-lesson-plan-schema'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditLessonPlanViewProps {
  id: string
}

export function EditLessonPlanView({ id }: EditLessonPlanViewProps) {
  const { user } = useCurrentUser()
  const { data: plan, isLoading, error, refetch } = useLessonPlanDetail(id)
  const mutation = useUpdateLessonPlan(id)

  const apiError = mutation.error ? extractLessonPlanErrors(mutation.error)[0] ?? null : null

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
        <p className="text-sm font-medium text-destructive">Erro ao carregar plano para edição.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractLessonPlanErrors(error)[0]}</p>
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

  function handleSubmit(values: UpdateLessonPlanFormValues) {
    mutation.mutate({
      id,
      requestingUserId: userId,
      ...values,
    })
  }

  return (
    <div className="space-y-6">
      <Link href={`/lesson-plans/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para detalhes
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar plano</h1>
        <p className="text-muted-foreground">Atualize os campos pedagógicos permitidos.</p>
      </div>

      <div className="max-w-3xl">
        <LessonPlanForm
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
