import type {
    CreateLessonPlanRequest,
    GenerateLessonPlanRequest,
    LessonPlan,
    LessonPlansListParams,
    UpdateLessonPlanRequest,
} from '@/features/lesson-plans/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const lessonPlansApi = {
  list: (params: LessonPlansListParams) =>
    apiClient
      .get<PagedResult<LessonPlan>>('/api/v1/lessonplans', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<LessonPlan>(`/api/v1/lessonplans/${id}`).then((r) => r.data),

  create: (dto: CreateLessonPlanRequest) =>
    apiClient.post<{ id: string }>('/api/v1/lessonplans', dto).then((r) => r.data),

  generate: (dto: GenerateLessonPlanRequest) =>
    apiClient
      .post<{ id: string }>('/api/v1/lessonplans/generate', dto, {
        timeout: 70_000,
      })
      .then((r) => r.data),

  update: (id: string, dto: UpdateLessonPlanRequest) =>
    apiClient.put<void>(`/api/v1/lessonplans/${id}`, dto).then(() => undefined),

  publish: (id: string) =>
    apiClient.patch<void>(`/api/v1/lessonplans/${id}/publish`).then(() => undefined),

  archive: (id: string) =>
    apiClient.patch<void>(`/api/v1/lessonplans/${id}/archive`).then(() => undefined),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/lessonplans/${id}`).then(() => undefined),
}
