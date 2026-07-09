'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface TeachingPlanOriginBadgeProps {
  isAIGenerated: boolean
}

export function TeachingPlanOriginBadge({ isAIGenerated }: TeachingPlanOriginBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold',
        isAIGenerated
          ? 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/30'
          : 'bg-transparent text-muted-foreground border-border',
      )}
    >
      {isAIGenerated && <Sparkles className="size-3" />}
      {isAIGenerated ? 'IA' : 'Manual'}
    </Badge>
  )
}
