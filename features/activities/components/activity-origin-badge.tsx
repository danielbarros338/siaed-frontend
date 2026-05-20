'use client'

import { Badge } from '@/components/ui/badge'

interface ActivityOriginBadgeProps {
  isAIGenerated: boolean
}

export function ActivityOriginBadge({ isAIGenerated }: ActivityOriginBadgeProps) {
  return <Badge variant={isAIGenerated ? 'default' : 'outline'}>{isAIGenerated ? 'IA' : 'Manual'}</Badge>
}

