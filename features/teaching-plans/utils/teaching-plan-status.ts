import type { TeachingPlanStatus, TeachingPlanStatusFilter } from '@/features/teaching-plans/types'

export const TEACHING_PLAN_STATUS_LABELS: Record<TeachingPlanStatus, string> = {
  1: 'Rascunho',
  2: 'Publicado',
  3: 'Arquivado',
}

export function toTeachingPlanStatusFilter(status: TeachingPlanStatus): TeachingPlanStatusFilter {
  if (status === 1) return 'Draft'
  if (status === 2) return 'Published'
  return 'Archived'
}

export function fromTeachingPlanStatusFilter(status?: TeachingPlanStatusFilter): TeachingPlanStatus | undefined {
  if (!status) return undefined
  if (status === 'Draft') return 1
  if (status === 'Published') return 2
  return 3
}

export function getTeachingPlanStatusLabel(status: TeachingPlanStatus): string {
  return TEACHING_PLAN_STATUS_LABELS[status]
}
