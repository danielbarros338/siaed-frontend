import type { LessonPlanStatus, LessonPlanStatusFilter } from '@/features/lesson-plans/types'

export const LESSON_PLAN_STATUS_LABELS: Record<LessonPlanStatus, string> = {
  1: 'Rascunho',
  2: 'Publicado',
  3: 'Arquivado',
}

export function toLessonPlanStatusFilter(status: LessonPlanStatus): LessonPlanStatusFilter {
  if (status === 1) return 'Draft'
  if (status === 2) return 'Published'
  return 'Archived'
}

export function fromLessonPlanStatusFilter(status?: LessonPlanStatusFilter): LessonPlanStatus | undefined {
  if (!status) return undefined
  if (status === 'Draft') return 1
  if (status === 'Published') return 2
  return 3
}

export function getLessonPlanStatusLabel(status: LessonPlanStatus): string {
  return LESSON_PLAN_STATUS_LABELS[status]
}
