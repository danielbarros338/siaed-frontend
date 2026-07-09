'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface LessonPlanOriginBadgeProps {
  isAIGenerated: boolean
}

export function LessonPlanOriginBadge({ isAIGenerated }: LessonPlanOriginBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold',
        isAIGenerated
          ? 'bg-violet-50 text-violet-700 border-violet-300'
          : 'bg-transparent text-muted-foreground border-border',
      )}
    >
      {isAIGenerated && <Sparkles className="size-3" />}
      {isAIGenerated ? 'IA' : 'Manual'}
    </Badge>
  )
}
