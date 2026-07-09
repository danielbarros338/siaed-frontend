import type {
    CreateTeachingPlanRequest,
    GenerateTeachingPlanRequest,
    TeachingPlan,
    TeachingPlansListParams,
    UpdateTeachingPlanRequest,
} from '@/features/teaching-plans/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const teachingPlansApi = {
  list: (params: TeachingPlansListParams) =>
    apiClient
      .get<PagedResult<TeachingPlan>>('/api/v1/teachingplans', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<TeachingPlan>(`/api/v1/teachingplans/${id}`).then((r) => r.data),

  create: (dto: CreateTeachingPlanRequest) =>
    apiClient.post<{ id: string }>('/api/v1/teachingplans', dto).then((r) => r.data),

  generate: (dto: GenerateTeachingPlanRequest) =>
    apiClient
      .post<{ id: string }>('/api/v1/teachingplans/generate', dto, {
        timeout: 70_000,
      })
      .then((r) => r.data),

  update: (id: string, dto: UpdateTeachingPlanRequest) =>
    apiClient.put<void>(`/api/v1/teachingplans/${id}`, dto).then(() => undefined),

  publish: (id: string) =>
    apiClient.patch<void>(`/api/v1/teachingplans/${id}/publish`).then(() => undefined),

  archive: (id: string) =>
    apiClient.patch<void>(`/api/v1/teachingplans/${id}/archive`).then(() => undefined),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/teachingplans/${id}`).then(() => undefined),
}
