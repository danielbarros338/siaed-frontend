import type { ClassDetail } from '@/features/classes/types'
import { canManageClass } from '@/features/classes/utils/class-permissions'
import { isSchoolRegisteredProfessor } from '@/features/classes/utils/professor-scope'
import type { UserSession } from '@/lib/types'

export function canManageLearningDiagnostic(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData) || isSchoolRegisteredProfessor(user)
}

export function canManageInclusionProfile(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData)
}

export function canManageSocioemotionalProfile(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData)
}

/** Exceção de campo único: "observações de comportamento" é editável mesmo por professor cadastrado por escola. */
export function canManageBehaviorNotes(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData) || isSchoolRegisteredProfessor(user)
}

export function canManageGroupDynamics(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData)
}

export function canManageClassRoutine(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData)
}

export function canManageAttendance(user: UserSession | null, classData: ClassDetail): boolean {
  return canManageClass(user, classData) || isSchoolRegisteredProfessor(user)
}
