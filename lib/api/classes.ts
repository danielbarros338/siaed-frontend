import type {
    ClassListItem,
    ClassesListParams,
    CreateClassDto,
    SchoolClass,
    UpdateClassDto,
} from '@/features/classes/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const classesApi = {
  list: (params?: ClassesListParams) =>
    apiClient
      .get<PagedResult<ClassListItem>>('/api/v1/classes', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<SchoolClass>(`/api/v1/classes/${id}`).then((r) => r.data),

  create: (dto: CreateClassDto) =>
    apiClient.post<{ id: string }>('/api/v1/classes', dto).then((r) => r.data),

  update: (id: string, dto: UpdateClassDto) =>
    apiClient.put<void>(`/api/v1/classes/${id}`, dto).then(() => undefined),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/classes/${id}`).then(() => undefined),

  reactivate: (id: string) =>
    apiClient.patch<void>(`/api/v1/classes/${id}/reactivate`).then(() => undefined),
}
