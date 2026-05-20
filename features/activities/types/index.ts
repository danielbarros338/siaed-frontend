import type { PagedResult } from '@/lib/types'

export type ActivityStatus = 1 | 2 | 3
export type ActivityStatusFilter = 'Draft' | 'Published' | 'Archived'
export type ActivityType = 1 | 2 | 3 | 4

export interface Activity {
  id: string
  teacherId: string
  lessonPlanId: string | null
  title: string
  description: string | null
  subject: string
  grade: string
  content: string
  ageRange: string
  answerKey: string | null
  simplifiedVersion: string | null
  type: ActivityType
  isAIGenerated: boolean
  status: ActivityStatus
  createdAt: string
  updatedAt: string
}

export interface ActivitiesListParams {
  teacherId: string
  page?: number
  pageSize?: number
  status?: ActivityStatusFilter
  type?: ActivityType
  isAIGenerated?: boolean
  lessonPlanId?: string
}

export interface CreateActivityRequest {
  teacherId: string
  title: string
  description: string
  subject: string
  grade: string
  content: string
  ageRange: string
  type: ActivityType
  lessonPlanId: string | null
}

export interface GenerateActivityRequest {
  teacherId: string
  lessonPlanId: string
  subject: string
  grade: string
  ageRange: string
  type: ActivityType
  numberOfQuestions: number
  additionalInstructions?: string
}

export interface UpdateActivityRequest {
  id: string
  title: string
  description: string
  content: string
}

export interface CreateActivityFormValues {
  title: string
  description: string
  subject: string
  grade: string
  content: string
  ageRange: string
  type: ActivityType
  lessonPlanId: string | null
}

export interface GenerateActivityFormValues {
  lessonPlanId: string
  subject: string
  grade: string
  ageRange: string
  type: ActivityType
  numberOfQuestions: number
  additionalInstructions?: string
}

export interface UpdateActivityFormValues {
  title: string
  description: string
  content: string
}

export type ActivitiesPagedResult = PagedResult<Activity>

