import { apiClient } from '@/lib/api/client'
import type {
    CreateReportDto,
    GenerateReportDto,
    PagedResult,
    Report,
    ReportsListParams,
    UpdateReportDto,
} from '@/lib/types'

export const reportsApi = {
  list: (params: ReportsListParams) =>
    apiClient
      .get<PagedResult<Report>>('/api/v1/Reports', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Report>(`/api/v1/Reports/${id}`).then((r) => r.data),

  create: (dto: CreateReportDto) =>
    apiClient.post<{ id: string }>('/api/v1/Reports', dto).then((r) => r.data),

  generate: (dto: GenerateReportDto) =>
    apiClient.post<{ id: string }>('/api/v1/Reports/generate', dto).then((r) => r.data),

  update: (id: string, dto: UpdateReportDto) =>
    apiClient.put(`/api/v1/Reports/${id}`, dto),

  delete: (id: string) =>
    apiClient.delete(`/api/v1/Reports/${id}`),
}
