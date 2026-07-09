'use client'

import { TeachingPlanForm } from '@/features/teaching-plans/components/teaching-plan-form'
import { useCreateTeachingPlan } from '@/features/teaching-plans/hooks/use-create-teaching-plan'
import type { CreateTeachingPlanFormValues } from '@/features/teaching-plans/schemas/create-teaching-plan-schema'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CreateTeachingPlanView() {
  const mutation = useCreateTeachingPlan()
  const { user } = useCurrentUser()

  const apiError = mutation.error ? extractTeachingPlanErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1 && user?.role !== 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores e coordenadores podem criar planos de ensino.</p>
      </div>
    )
  }

  function handleSubmit(values: CreateTeachingPlanFormValues) {
    if (!user) return

    mutation.mutate({
      authorId: user.userId,
      ...values,
    })
  }

  return (
    <div className="space-y-6">
      <Link href="/teaching-plan" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de ensino
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criar plano manual</h1>
        <p className="text-muted-foreground">Preencha os campos curriculares para criar o plano de ensino.</p>
      </div>

      <div className="max-w-3xl">
        <TeachingPlanForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}
