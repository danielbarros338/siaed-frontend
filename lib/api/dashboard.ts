import { apiClient } from '@/lib/api/client'
import type {
  AdminDashboardData,
  DateFilterPeriod,
  TeacherDashboardData,
} from '@/lib/types/dashboard'

export const dashboardApi = {
  // GET /api/v1/dashboard/admin
  getAdmin: () =>
    apiClient.get<AdminDashboardData>('/api/v1/dashboard/admin').then((r) => r.data),

  // GET /api/v1/dashboard/teacher?period=30d|trimestre|ano
  getTeacher: (period: DateFilterPeriod = '30d') =>
    apiClient
      .get<TeacherDashboardData>('/api/v1/dashboard/teacher', { params: { period } })
      .then((r) => r.data),
}
