'use client'

import { LessonPlanGenerateForm } from '@/features/lesson-plans/components/lesson-plan-generate-form'
import { useGenerateLessonPlan } from '@/features/lesson-plans/hooks/use-generate-lesson-plan'
import type { GenerateLessonPlanFormValues } from '@/features/lesson-plans/schemas/generate-lesson-plan-schema'
import { extractLessonPlanErrors } from '@/features/lesson-plans/utils/lesson-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

const GENERATION_TIMEOUT_MS = 60_000

export function GenerateLessonPlanView() {
  const mutation = useGenerateLessonPlan()
  const { user } = useCurrentUser()
  const [timeoutReached, setTimeoutReached] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const apiError = mutation.error ? extractLessonPlanErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem gerar planos de aula.</p>
      </div>
    )
  }

  function handleSubmit(values: GenerateLessonPlanFormValues) {
    if (!user) return

    setTimeoutReached(false)

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setTimeoutReached(true)
    }, GENERATION_TIMEOUT_MS)

    mutation.mutate(
      {
        teacherId: user.userId,
        ...values,
      },
      {
        onSettled: () => {
          if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          setTimeoutReached(false)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/lesson-plans" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de aula
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerar plano com IA</h1>
        <p className="text-muted-foreground">Informe contexto pedagógico e deixe a IA montar um plano inicial.</p>
      </div>

      <div className="max-w-3xl">
        <LessonPlanGenerateForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
          timeoutReached={timeoutReached}
        />
      </div>
    </div>
  )
}
