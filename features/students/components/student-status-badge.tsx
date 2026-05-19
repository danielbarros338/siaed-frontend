'use client'

import { Badge } from '@/components/ui/badge'
import type { StudentStatus } from '@/features/students/types'
import { STUDENT_STATUS_BADGE_VARIANT, STUDENT_STATUS_LABELS } from '@/features/students/utils/format'

interface StudentStatusBadgeProps {
  status: StudentStatus
}

export function StudentStatusBadge({ status }: StudentStatusBadgeProps) {
  return (
    <Badge variant={STUDENT_STATUS_BADGE_VARIANT[status] as 'default' | 'secondary' | 'destructive'}>
      {STUDENT_STATUS_LABELS[status]}
    </Badge>
  )
}
