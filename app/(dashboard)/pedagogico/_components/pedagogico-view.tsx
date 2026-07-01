'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { AdminPedagogicoView } from './admin-pedagogico-view'
import { TeacherPedagogicoView } from './teacher-pedagogico-view'

export function PedagogicoView() {
  const { user, isAuthenticated } = useCurrentUser()

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      </div>
    )
  }

  if (user.role === 2 || user.role === 3) {
    return <AdminPedagogicoView />
  }

  return <TeacherPedagogicoView />
}
