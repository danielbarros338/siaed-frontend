import type { PagedResult } from '@/lib/types'

export interface Grade {
  id: string
  activityId: string
  studentId: string
  schoolClassId: string
  teacherId: string
  gradeValue: string
  conventionKey: string
  version: string
  createdAt: string
  updatedAt: string
}

export interface CreateGradeDto {
  activityId: string
  studentId: string
  schoolClassId: string
  teacherId: string
  gradeValue: string
  conventionKey: string
}

export interface UpdateGradeDto {
  gradeValue: string
  conventionKey: string
  version: string
}

export interface GradesListParams {
  page?: number
  pageSize?: number
  activityId?: string
  schoolClassId?: string
  teacherId?: string
  gradeValue?: string
}

export interface GradeListRow {
  studentId: string
  studentName: string
  classId: string
  className: string
  gradeId: string | null
  gradeValue: string | null
  conventionKey: string | null
  version: string | null
  hasGrade: boolean
}

export type GradesPagedResult = PagedResult<Grade>
