import type { ClassListItem, ClassesListParams } from '@/features/students/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const classesApi = {
  list: (params?: ClassesListParams) =>
    apiClient
      .get<PagedResult<ClassListItem>>('/api/v1/classes', { params })
      .then((r) => r.data),
}
