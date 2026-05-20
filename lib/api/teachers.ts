import { apiClient } from '@/lib/api/client'
import type { PagedResult, TeacherListItem, TeachersListParams } from '@/lib/types'

export const teachersApi = {
  list: (params?: TeachersListParams) =>
    apiClient
      .get<PagedResult<TeacherListItem>>('/api/v1/teachers', { params })
      .then((r) => r.data),

  listAll: async () => {
    const pageSize = 100
    const firstPage = await teachersApi.list({ page: 1, pageSize })
    const items = [...firstPage.items]

    for (let page = 2; page <= firstPage.totalPages; page += 1) {
      const result = await teachersApi.list({ page, pageSize })
      items.push(...result.items)
    }

    return items
  },
}
