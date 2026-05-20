// Tipos globais derivados do contrato do backend (docs/backend-state.md)

export type UserRole = 1 | 2 | 3
// 1 = Professor | 2 = Diretor | 3 = Coordenador

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  1: 'Professor',
  2: 'Diretor',
  3: 'Coordenador',
}

export interface AuthResponse {
  userId: string
  name: string
  email: string
  role: UserRole
  token: string
  expiresAt: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role: UserRole
  subject?: string | null
  schoolId?: string | null
}

export interface UserSession {
  userId: string
  name: string
  email: string
  role: UserRole
}

export interface ApiErrorResponse {
  errors: string[]
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export type StudentStatus = 1 | 2 | 3
// 1 = Ativo | 2 = Inativo | 3 = Evadido

export type DocumentType = 1 | 2 | 3
// 1 = CPF | 2 = RegistroEstrangeiro | 3 = IdInterno

export type ClassStatus = 1 | 2
// 1 = Active | 2 = Inactive

export const CLASS_STATUS_LABELS: Record<ClassStatus, string> = {
  1: 'Ativa',
  2: 'Inativa',
}

export interface SchoolClass {
  id: string
  name: string
  grade: string
  schoolYear: number
  status: ClassStatus
  createdAt: string
  teacherIds?: string[]
  teachers?: ClassTeacher[]
}

export interface ClassTeacher {
  id?: string
  teacherId?: string
  name: string
  subject?: string | null
}

export interface ClassListItem {
  id: string
  name: string
  grade: string
  schoolYear: number
  status: ClassStatus
}

export interface CreateClassDto {
  name: string
  grade: string
  schoolYear: number
  teacherIds?: string[]
}

export interface UpdateClassDto {
  id: string
  name: string
  grade: string
  schoolYear: number
  teacherIds?: string[]
}

export interface TeacherListItem {
  id: string
  name: string
  subject?: string | null
}

export interface TeachersListParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface ClassesListParams {
  page?: number
  pageSize?: number
  search?: string
}
