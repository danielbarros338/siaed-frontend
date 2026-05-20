'use client'

import { Badge } from '@/components/ui/badge'

interface LessonPlanOriginBadgeProps {
  isAIGenerated: boolean
}

export function LessonPlanOriginBadge({ isAIGenerated }: LessonPlanOriginBadgeProps) {
  return <Badge variant={isAIGenerated ? 'default' : 'outline'}>{isAIGenerated ? 'IA' : 'Manual'}</Badge>
}
