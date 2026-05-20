import type { PagedResult } from '@/lib/types'

export type LessonPlanStatus = 1 | 2 | 3
export type LessonPlanStatusFilter = 'Draft' | 'Published' | 'Archived'

export interface LessonPlan {
  id: string
  teacherId: string
  title: string
  subject: string
  grade: string
  durationMinutes: number
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
  ageRange: string
  isAIGenerated: boolean
  status: LessonPlanStatus
  createdAt: string
  updatedAt: string
}

export interface LessonPlansListParams {
  teacherId: string
  page?: number
  pageSize?: number
  status?: LessonPlanStatusFilter
  isAIGenerated?: boolean
}

export interface CreateLessonPlanRequest {
  teacherId: string
  title: string
  subject: string
  grade: string
  durationMinutes: number
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
  ageRange: string
}

export interface GenerateLessonPlanRequest {
  teacherId: string
  subject: string
  grade: string
  ageRange: string
  durationMinutes: number
  additionalInstructions?: string
}

export interface UpdateLessonPlanRequest {
  id: string
  requestingUserId: string
  title: string
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
}

export interface CreateLessonPlanFormValues {
  title: string
  subject: string
  grade: string
  durationMinutes: number
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
  ageRange: string
}

export interface GenerateLessonPlanFormValues {
  subject: string
  grade: string
  ageRange: string
  durationMinutes: number
  additionalInstructions?: string
}

export interface UpdateLessonPlanFormValues {
  title: string
  objectives: string
  content: string
  methodology: string
  resources: string
  evaluation: string
}

export type LessonPlansPagedResult = PagedResult<LessonPlan>
