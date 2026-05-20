import type { LessonPlanStatusFilter } from '@/features/lesson-plans/types'

export const LESSON_PLANS_DEFAULT_STATUSES: LessonPlanStatusFilter[] = ['Draft', 'Published', 'Archived']

export function parseStatusFilter(status: string | null): LessonPlanStatusFilter | undefined {
  if (status === 'Draft' || status === 'Published' || status === 'Archived') {
    return status
  }
  return undefined
}

export function parseIsAiGeneratedFilter(value: string | null): boolean | undefined {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}
