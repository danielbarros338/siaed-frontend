import type {
    CreateStudentDto,
    DeactivateStudentDto,
    ImportResult,
    ReactivateStudentDto,
    Student,
    StudentListItem,
    StudentsListParams,
    TransferStudentDto,
    UpdateStudentDto,
} from '@/features/students/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const studentsApi = {
  list: (params: StudentsListParams) =>
    apiClient
      .get<PagedResult<StudentListItem>>('/api/v1/students', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Student>(`/api/v1/students/${id}`).then((r) => r.data),

  create: (dto: CreateStudentDto) =>
    apiClient.post<{ id: string }>('/api/v1/students', dto).then((r) => r.data),

  update: (id: string, dto: UpdateStudentDto) =>
    apiClient.put(`/api/v1/students/${id}`, dto),

  transfer: (id: string, dto: TransferStudentDto) =>
    apiClient.patch(`/api/v1/students/${id}/transfer`, dto),

  deactivate: (id: string, dto: DeactivateStudentDto) =>
    apiClient.patch(`/api/v1/students/${id}/deactivate`, dto),

  reactivate: (id: string, dto: ReactivateStudentDto) =>
    apiClient.patch(`/api/v1/students/${id}/reactivate`, dto),

  import: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post<ImportResult>('/api/v1/students/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
}
