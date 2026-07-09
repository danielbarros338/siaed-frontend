'use client'

import { Button } from '@/components/ui/button'
import { TeachingPlanForm } from '@/features/teaching-plans/components/teaching-plan-form'
import { useTeachingPlanDetail } from '@/features/teaching-plans/hooks/use-teaching-plan-detail'
import { useUpdateTeachingPlan } from '@/features/teaching-plans/hooks/use-update-teaching-plan'
import type { UpdateTeachingPlanFormValues } from '@/features/teaching-plans/schemas/update-teaching-plan-schema'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditTeachingPlanViewProps {
  id: string
}

export function EditTeachingPlanView({ id }: EditTeachingPlanViewProps) {
  const { user } = useCurrentUser()
  const { data: plan, isLoading, error, refetch } = useTeachingPlanDetail(id)
  const mutation = useUpdateTeachingPlan(id)

  const apiError = mutation.error ? extractTeachingPlanErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1 && user?.role !== 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores e coordenadores podem editar planos de ensino.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando plano de ensino...</p>
  }

  if (error) {
    return (
      <div className="rounded-md border p-6">
        <p className="text-sm font-medium text-destructive">Erro ao carregar plano para edição.</p>
        <p className="mt-1 text-sm text-muted-foreground">{extractTeachingPlanErrors(error)[0]}</p>
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

  function handleSubmit(values: UpdateTeachingPlanFormValues) {
    mutation.mutate({
      id,
      requestingUserId: userId,
      ...values,
    })
  }

  return (
    <div className="space-y-6">
      <Link href={`/teaching-plan/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Voltar para detalhes
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar plano</h1>
        <p className="text-muted-foreground">Atualize os campos curriculares permitidos.</p>
      </div>

      <div className="max-w-3xl">
        <TeachingPlanForm
          mode="edit"
          defaultValues={{
            title: plan.title,
            syllabus: plan.syllabus,
            generalObjectives: plan.generalObjectives,
            specificObjectives: plan.specificObjectives,
            programContent: plan.programContent,
            methodology: plan.methodology,
            evaluationCriteria: plan.evaluationCriteria,
            schedule: plan.schedule,
            basicBibliography: plan.basicBibliography,
            complementaryBibliography: plan.complementaryBibliography,
          }}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}
