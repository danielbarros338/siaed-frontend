'use client'

import { Badge } from '@/components/ui/badge'
import type { ActivityStatus } from '@/features/activities/types'
import { getActivityStatusLabel } from '@/features/activities/utils/activity-status'

interface ActivityStatusBadgeProps {
  status: ActivityStatus
}

export function ActivityStatusBadge({ status }: ActivityStatusBadgeProps) {
  const variant = status === 2 ? 'default' : status === 3 ? 'outline' : 'secondary'
  return <Badge variant={variant}>{getActivityStatusLabel(status)}</Badge>
}

