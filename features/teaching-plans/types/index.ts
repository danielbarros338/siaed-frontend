import type { PagedResult } from '@/lib/types'

export type TeachingPlanStatus = 1 | 2 | 3
export type TeachingPlanStatusFilter = 'Draft' | 'Published' | 'Archived'

export interface TeachingPlan {
  id: string
  authorId: string
  title: string
  subject: string
  course: string
  grade: string
  academicPeriod: string
  workloadHours: number
  syllabus: string
  generalObjectives: string
  specificObjectives: string
  programContent: string
  methodology: string
  evaluationCriteria: string
  schedule: string
  basicBibliography: string
  complementaryBibliography: string
  isAIGenerated: boolean
  status: TeachingPlanStatus
  createdAt: string
  updatedAt: string
}

export interface TeachingPlansListParams {
  authorId: string
  page?: number
  pageSize?: number
  status?: TeachingPlanStatusFilter
  isAIGenerated?: boolean
}

export interface CreateTeachingPlanRequest {
  authorId: string
  title: string
  subject: string
  course: string
  grade: string
  academicPeriod: string
  workloadHours: number
  syllabus: string
  generalObjectives: string
  specificObjectives: string
  programContent: string
  methodology: string
  evaluationCriteria: string
  schedule: string
  basicBibliography: string
  complementaryBibliography: string
}

export interface GenerateTeachingPlanRequest {
  authorId: string
  subject: string
  course: string
  grade: string
  academicPeriod: string
  workloadHours: number
  additionalInstructions?: string
}

export interface UpdateTeachingPlanRequest {
  id: string
  requestingUserId: string
  title: string
  syllabus: string
  generalObjectives: string
  specificObjectives: string
  programContent: string
  methodology: string
  evaluationCriteria: string
  schedule: string
  basicBibliography: string
  complementaryBibliography: string
}

export interface CreateTeachingPlanFormValues {
  title: string
  subject: string
  course: string
  grade: string
  academicPeriod: string
  workloadHours: number
  syllabus: string
  generalObjectives: string
  specificObjectives: string
  programContent: string
  methodology: string
  evaluationCriteria: string
  schedule: string
  basicBibliography: string
  complementaryBibliography: string
}

export interface GenerateTeachingPlanFormValues {
  subject: string
  course: string
  grade: string
  academicPeriod: string
  workloadHours: number
  additionalInstructions?: string
}

export interface UpdateTeachingPlanFormValues {
  title: string
  syllabus: string
  generalObjectives: string
  specificObjectives: string
  programContent: string
  methodology: string
  evaluationCriteria: string
  schedule: string
  basicBibliography: string
  complementaryBibliography: string
}

export type TeachingPlansPagedResult = PagedResult<TeachingPlan>
