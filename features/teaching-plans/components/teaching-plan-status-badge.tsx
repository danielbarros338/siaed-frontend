'use client'

import { Badge } from '@/components/ui/badge'
import type { TeachingPlanStatus } from '@/features/teaching-plans/types'
import { getTeachingPlanStatusLabel } from '@/features/teaching-plans/utils/teaching-plan-status'
import { cn } from '@/lib/utils'

const STATUS_CLASSES: Record<TeachingPlanStatus, string> = {
  1: 'bg-amber-50 text-amber-700 border-amber-300',
  2: 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/30',
  3: 'bg-muted text-muted-foreground border-transparent',
}

interface TeachingPlanStatusBadgeProps {
  status: TeachingPlanStatus
}

export function TeachingPlanStatusBadge({ status }: TeachingPlanStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-semibold', STATUS_CLASSES[status])}>
      {getTeachingPlanStatusLabel(status)}
    </Badge>
  )
}
