'use client'

import { Badge } from '@/components/ui/badge'
import type { LessonPlanStatus } from '@/features/lesson-plans/types'
import { getLessonPlanStatusLabel } from '@/features/lesson-plans/utils/lesson-plan-status'

interface LessonPlanStatusBadgeProps {
  status: LessonPlanStatus
}

export function LessonPlanStatusBadge({ status }: LessonPlanStatusBadgeProps) {
  const variant = status === 2 ? 'default' : status === 3 ? 'outline' : 'secondary'
  return <Badge variant={variant}>{getLessonPlanStatusLabel(status)}</Badge>
}
