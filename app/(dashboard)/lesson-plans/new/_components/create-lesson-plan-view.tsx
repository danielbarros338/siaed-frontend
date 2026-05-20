'use client'

import { LessonPlanForm } from '@/features/lesson-plans/components/lesson-plan-form'
import { useCreateLessonPlan } from '@/features/lesson-plans/hooks/use-create-lesson-plan'
import type { CreateLessonPlanFormValues } from '@/features/lesson-plans/schemas/create-lesson-plan-schema'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CreateLessonPlanView() {
  const mutation = useCreateLessonPlan()
  const { user } = useCurrentUser()

  const apiError = mutation.error ? extractLessonPlanErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem criar planos de aula.</p>
      </div>
    )
  }

  function handleSubmit(values: CreateLessonPlanFormValues) {
    if (!user) return

    mutation.mutate({
      teacherId: user.userId,
      ...values,
    })
  }

  return (
    <div className="space-y-6">
      <Link href="/lesson-plans" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de aula
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criar plano manual</h1>
        <p className="text-muted-foreground">Preencha os campos pedagógicos para criar o plano de aula.</p>
      </div>

      <div className="max-w-3xl">
        <LessonPlanForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
        />
      </div>
    </div>
  )
}
