import type {
    ActivitiesListParams,
    Activity,
    CreateActivityRequest,
    GenerateActivityRequest,
    UpdateActivityRequest,
} from '@/features/activities/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const activitiesApi = {
  list: (params: ActivitiesListParams) =>
    apiClient
      .get<PagedResult<Activity>>('/api/v1/activities', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Activity>(`/api/v1/activities/${id}`).then((r) => r.data),

  create: (dto: CreateActivityRequest) =>
    apiClient.post<{ id: string }>('/api/v1/activities', dto).then((r) => r.data),

  generate: (dto: GenerateActivityRequest) =>
    apiClient
      .post<{ id: string }>(
        '/api/v1/activities/generate',
        {
          ...dto,
          LessonPlanId: dto.lessonPlanId,
        },
        {
          timeout: 70_000,
        },
      )
      .then((r) => r.data),

  update: (id: string, dto: UpdateActivityRequest) =>
    apiClient.put<void>(`/api/v1/activities/${id}`, dto).then(() => undefined),

  publish: (id: string) =>
    apiClient.patch<void>(`/api/v1/activities/${id}/publish`).then(() => undefined),

  archive: (id: string) =>
    apiClient.patch<void>(`/api/v1/activities/${id}/archive`).then(() => undefined),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/activities/${id}`).then(() => undefined),
}

