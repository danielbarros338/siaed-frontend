import type { UserSession } from '@/lib/types'

export function isSelfRegisteredProfessor(user: UserSession | null): boolean {
  return !!user && user.role === 1 && user.schoolId === null
}

export function isSchoolRegisteredProfessor(user: UserSession | null): boolean {
  return !!user && user.role === 1 && user.schoolId !== null
}
