import type { TeachingPlanStatusFilter } from '@/features/teaching-plans/types'

export const TEACHING_PLANS_DEFAULT_STATUSES: TeachingPlanStatusFilter[] = ['Draft', 'Published', 'Archived']

export function parseStatusFilter(status: string | null): TeachingPlanStatusFilter | undefined {
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
