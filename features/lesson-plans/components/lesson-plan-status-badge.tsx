'use client'

import { Badge } from '@/components/ui/badge'
import type { LessonPlanStatus } from '@/features/lesson-plans/types'
import { getLessonPlanStatusLabel } from '@/features/lesson-plans/utils/lesson-plan-status'
import { cn } from '@/lib/utils'

const STATUS_CLASSES: Record<LessonPlanStatus, string> = {
  1: 'bg-amber-50 text-amber-700 border-amber-300',
  2: 'bg-violet-50 text-violet-700 border-violet-300',
  3: 'bg-muted text-muted-foreground border-transparent',
}

interface LessonPlanStatusBadgeProps {
  status: LessonPlanStatus
}

export function LessonPlanStatusBadge({ status }: LessonPlanStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-semibold', STATUS_CLASSES[status])}>
      {getLessonPlanStatusLabel(status)}
    </Badge>
  )
}
