import type { ActivityStatus, ActivityStatusFilter } from '@/features/activities/types'

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  1: 'Rascunho',
  2: 'Publicado',
  3: 'Arquivado',
}

export function toActivityStatusFilter(status: ActivityStatus): ActivityStatusFilter {
  if (status === 1) return 'Draft'
  if (status === 2) return 'Published'
  return 'Archived'
}

export function fromActivityStatusFilter(status?: ActivityStatusFilter): ActivityStatus | undefined {
  if (!status) return undefined
  if (status === 'Draft') return 1
  if (status === 'Published') return 2
  return 3
}

export function getActivityStatusLabel(status: ActivityStatus): string {
  return ACTIVITY_STATUS_LABELS[status]
}

