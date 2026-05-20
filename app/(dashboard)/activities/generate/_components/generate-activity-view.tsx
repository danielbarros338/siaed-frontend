'use client'

import { ActivityGenerateForm } from '@/features/activities/components/activity-generate-form'
import { useGenerateActivity } from '@/features/activities/hooks/use-generate-activity'
import type { GenerateActivityFormValues } from '@/features/activities/schemas/generate-activity-schema'
import { extractActivityErrors } from '@/features/activities/utils/activity-error'
import { useLessonPlans } from '@/features/lesson-plans/hooks/use-lesson-plans'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

const GENERATION_TIMEOUT_MS = 60_000

export function GenerateActivityView() {
  const mutation = useGenerateActivity()
  const { user } = useCurrentUser()
  const lessonPlansQuery = useLessonPlans({ page: 1, pageSize: 100 })
  const [timeoutReached, setTimeoutReached] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const apiError = mutation.error ? extractActivityErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores podem gerar atividades.</p>
      </div>
    )
  }

  function handleSubmit(values: GenerateActivityFormValues) {
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

  const lessonPlanOptions = (lessonPlansQuery.data?.items ?? []).map((plan) => ({
    id: plan.id,
    title: plan.title,
    subject: plan.subject,
    grade: plan.grade,
    ageRange: plan.ageRange,
  }))

  return (
    <div className="space-y-6">
      <Link href="/activities" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Atividades
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerar atividade com IA</h1>
        <p className="text-muted-foreground">Informe o contexto pedagógico e gere uma atividade a partir de um plano de aula.</p>
      </div>

      <div className="max-w-3xl">
        <ActivityGenerateForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
          timeoutReached={timeoutReached}
          lessonPlans={lessonPlanOptions}
          isLoadingLessonPlans={lessonPlansQuery.isLoading}
        />
      </div>
    </div>
  )
}

