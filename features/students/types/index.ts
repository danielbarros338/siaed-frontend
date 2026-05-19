import type { DocumentType, StudentStatus } from '@/lib/types'

export type { DocumentType, StudentStatus }

export interface Student {
  id: string
  fullName: string
  documentType: DocumentType
  documentIdMasked: string
  birthDate: string
  classId: string
  className: string
  status: StudentStatus
  enrollmentDate: string
  notes: string | null
  createdAt: string
}

export interface StudentListItem {
  id: string
  fullName: string
  documentIdMasked: string
  classId: string
  className: string
  status: StudentStatus
}

export interface CreateStudentDto {
  fullName: string
  documentType: DocumentType
  documentId: string
  birthDate: string
  classId: string
  enrollmentDate: string
  notes?: string | null
}

export interface UpdateStudentDto {
  id: string
  fullName: string
  documentType: DocumentType
  documentId: string
  birthDate: string
  notes?: string | null
}

export interface TransferStudentDto {
  newClassId: string
}

export interface DeactivateStudentDto {
  status: 2 | 3
}

export interface ReactivateStudentDto {
  classId: string
}

export interface ImportResult {
  imported: number
  skipped: number
  errors: string[]
}

export interface StudentsListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: StudentStatus | null
  classId?: string | null
}

export interface ClassesListParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface ClassListItem {
  id: string
  name: string
  grade: string
  schoolYear: number
  status: number
}
