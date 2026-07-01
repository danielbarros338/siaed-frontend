'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { AdminDashboardView } from './admin-dashboard-view'
import { TeacherDashboardView } from './teacher-dashboard-view'

export function DashboardView() {
  const { user, isAuthenticated } = useCurrentUser()

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // role 2 = Diretor, role 3 = Coordenador → visão administrativa
  if (user.role === 2 || user.role === 3) {
    return <AdminDashboardView />
  }

  // role 1 = Professor → visão pedagógica
  return <TeacherDashboardView />
}
