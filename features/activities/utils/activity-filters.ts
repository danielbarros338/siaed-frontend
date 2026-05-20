import type { ActivityStatusFilter, ActivityType } from '@/features/activities/types'

export const ACTIVITIES_DEFAULT_STATUSES: ActivityStatusFilter[] = ['Draft', 'Published', 'Archived']

export function parseStatusFilter(status: string | null): ActivityStatusFilter | undefined {
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

export function parseTypeFilter(value: string | null): ActivityType | undefined {
  if (value === '1' || value === '2' || value === '3' || value === '4') {
    return Number(value) as ActivityType
  }
  return undefined
}

export function parseLessonPlanIdFilter(value: string | null): string | undefined {
  if (!value) return undefined
  return value.trim() || undefined
}

