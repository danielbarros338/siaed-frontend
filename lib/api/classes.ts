import type {
    ClassListItem,
    ClassesListParams,
    CreateClassDto,
    SchoolClass,
    UpdateClassDto,
} from '@/features/classes/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

interface RequestingUser {
  requestingUserId: string
  requestingRole: number
}

export const classesApi = {
  list: (params?: ClassesListParams) =>
    apiClient
      .get<PagedResult<ClassListItem>>('/api/v1/classes', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<SchoolClass>(`/api/v1/classes/${id}`).then((r) => r.data),

  create: (dto: CreateClassDto, requester: RequestingUser) =>
    apiClient
      .post<{ id: string }>('/api/v1/classes', dto, { params: requester })
      .then((r) => r.data),

  update: (id: string, dto: UpdateClassDto, requester: RequestingUser) =>
    apiClient
      .put<void>(`/api/v1/classes/${id}`, dto, { params: requester })
      .then(() => undefined),

  delete: (id: string, requester: RequestingUser) =>
    apiClient
      .delete<void>(`/api/v1/classes/${id}`, { params: requester })
      .then(() => undefined),

  reactivate: (id: string, requester: RequestingUser) =>
    apiClient
      .patch<void>(`/api/v1/classes/${id}/reactivate`, undefined, { params: requester })
      .then(() => undefined),
}
