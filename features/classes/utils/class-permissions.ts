import type { ClassDetail, ClassListItem } from '@/features/classes/types'
import type { UserSession } from '@/lib/types'

export function canCreateClass(user: UserSession | null): boolean {
  return user !== null && (user.role === 1 || user.role === 2 || user.role === 3)
}

export function canManageClass(
  user: UserSession | null,
  classData: Pick<ClassDetail | ClassListItem, 'createdBy'>,
): boolean {
  if (!user) return false
  if (user.role === 2 || user.role === 3) return true
  return user.role === 1 && classData.createdBy === user.userId
}
