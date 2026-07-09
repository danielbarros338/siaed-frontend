'use client'

import { TeachingPlanGenerateForm } from '@/features/teaching-plans/components/teaching-plan-generate-form'
import { useGenerateTeachingPlan } from '@/features/teaching-plans/hooks/use-generate-teaching-plan'
import type { GenerateTeachingPlanFormValues } from '@/features/teaching-plans/schemas/generate-teaching-plan-schema'
import { extractTeachingPlanErrors } from '@/features/teaching-plans/utils/teaching-plan-error'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

const GENERATION_TIMEOUT_MS = 60_000

export function GenerateTeachingPlanView() {
  const mutation = useGenerateTeachingPlan()
  const { user } = useCurrentUser()
  const [timeoutReached, setTimeoutReached] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const apiError = mutation.error ? extractTeachingPlanErrors(mutation.error)[0] ?? null : null

  if (user?.role !== 1 && user?.role !== 3) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">Apenas professores e coordenadores podem gerar planos de ensino.</p>
      </div>
    )
  }

  function handleSubmit(values: GenerateTeachingPlanFormValues) {
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
        authorId: user.userId,
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
      <Link href="/teaching-plan" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Planos de ensino
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerar plano com IA</h1>
        <p className="text-muted-foreground">Informe o contexto curricular e deixe a IA montar um plano inicial.</p>
      </div>

      <div className="max-w-3xl">
        <TeachingPlanGenerateForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          apiError={apiError}
          timeoutReached={timeoutReached}
        />
      </div>
    </div>
  )
}
