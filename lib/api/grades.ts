import type {
    CreateGradeDto,
    Grade,
    GradesListParams,
    UpdateGradeDto,
} from '@/features/activities/types/grades'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const gradesApi = {
  list: (params: GradesListParams) =>
    apiClient
      .get<PagedResult<Grade>>('/api/v1/grades', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Grade>(`/api/v1/grades/${id}`).then((r) => r.data),

  create: (dto: CreateGradeDto) =>
    apiClient.post<{ id: string }>('/api/v1/grades', dto).then((r) => r.data),

  update: (id: string, dto: UpdateGradeDto) =>
    apiClient.put<void>(`/api/v1/grades/${id}`, dto).then(() => undefined),

  remove: (id: string) =>
    apiClient.delete<void>(`/api/v1/grades/${id}`).then(() => undefined),
}
