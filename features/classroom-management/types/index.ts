import type { PagedResult } from '@/lib/types'

// ─── Diagnóstico de Aprendizagem ───────────────────────────────────────────────

export type ProficiencyLevel = 1 | 2 | 3 | 4
// 1 = Avançado | 2 = Adequado | 3 = EmDesenvolvimento | 4 = Defasagem

export const PROFICIENCY_LEVEL_LABELS: Record<ProficiencyLevel, string> = {
  1: 'Avançado',
  2: 'Adequado',
  3: 'Em desenvolvimento',
  4: 'Defasagem',
}

export interface LearningDiagnostic {
  id: string
  studentId: string
  schoolClassId: string
  authorId: string
  subject: string
  proficiencyLevel: ProficiencyLevel
  identifiedGaps: string
  assessmentDate: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateLearningDiagnosticDto {
  studentId: string
  schoolClassId: string
  subject: string
  proficiencyLevel: ProficiencyLevel
  identifiedGaps: string
  assessmentDate: string
  notes?: string | null
}

export interface UpdateLearningDiagnosticDto extends CreateLearningDiagnosticDto {
  id: string
}

export interface LearningDiagnosticsListParams {
  studentId?: string
  schoolClassId?: string
  page?: number
  pageSize?: number
}

export type LearningDiagnosticsPagedResult = PagedResult<LearningDiagnostic>

// ─── Perfil de Inclusão / PEI ──────────────────────────────────────────────────

export type InclusionCondition = 1 | 2 | 3 | 4
// 1 = TDAH | 2 = TEA | 3 = Outro | 4 = Nenhum

export const INCLUSION_CONDITION_LABELS: Record<InclusionCondition, string> = {
  1: 'TDAH',
  2: 'TEA',
  3: 'Outro',
  4: 'Nenhum',
}

export interface InclusionProfile {
  studentId: string
  hasSpecialNeeds: boolean
  condition: InclusionCondition | null
  conditionDescription: string | null
  hasMedicalReport: boolean
  medicalReportDate: string | null
  curricularAdaptations: string
  needsAEE: boolean
  nextPeiReviewDate: string | null
  updatedBy: string
  updatedAt: string
}

export interface UpdateInclusionProfileDto {
  hasSpecialNeeds: boolean
  condition: InclusionCondition | null
  conditionDescription?: string | null
  hasMedicalReport: boolean
  medicalReportDate?: string | null
  curricularAdaptations: string
  needsAEE: boolean
  nextPeiReviewDate?: string | null
}

// ─── Perfil Socioemocional ─────────────────────────────────────────────────────

export type EngagementLevel = 1 | 2 | 3
// 1 = Baixo | 2 = Moderado | 3 = Alto

export const ENGAGEMENT_LEVEL_LABELS: Record<EngagementLevel, string> = {
  1: 'Baixo',
  2: 'Moderado',
  3: 'Alto',
}

export interface SocioemotionalProfile {
  studentId: string
  familyContext: string
  engagementLevel: EngagementLevel
  behaviorNotes: string
  updatedBy: string
  updatedAt: string
}

export interface UpdateSocioemotionalProfileDto {
  familyContext: string
  engagementLevel: EngagementLevel
  behaviorNotes: string
}

// ─── Dinâmica de Grupo ─────────────────────────────────────────────────────────

export type WorkPreference = 1 | 2 | 3
// 1 = Individual | 2 = Grupo | 3 = Misto

export const WORK_PREFERENCE_LABELS: Record<WorkPreference, string> = {
  1: 'Individual',
  2: 'Grupo',
  3: 'Misto',
}

export interface IdentifiedLeader {
  studentId: string
  studentName: string
}

export interface GroupDynamics {
  schoolClassId: string
  identifiedLeaders: IdentifiedLeader[]
  conflictsNotes: string
  workPreference: WorkPreference
  updatedBy: string
  updatedAt: string
}

export interface UpdateGroupDynamicsDto {
  identifiedLeaders: IdentifiedLeader[]
  conflictsNotes: string
  workPreference: WorkPreference
}

// ─── Rotina e Combinados ───────────────────────────────────────────────────────

export interface ClassRoutine {
  schoolClassId: string
  dailyRoutineDescription: string
  agreements: string[]
  updatedBy: string
  updatedAt: string
}

export interface UpdateClassRoutineDto {
  dailyRoutineDescription: string
  agreements: string[]
}

// ─── Frequência Diária ─────────────────────────────────────────────────────────

export type AttendanceStatus = 1 | 2 | 3
// 1 = Presente | 2 = Ausente | 3 = Justificado

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  1: 'Presente',
  2: 'Ausente',
  3: 'Justificado',
}

export interface AttendanceEntry {
  id: string
  schoolClassId: string
  studentId: string
  date: string
  status: AttendanceStatus
  notes: string | null
  recordedBy: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceEntryInput {
  studentId: string
  status: AttendanceStatus
  notes?: string | null
}

export interface BulkUpsertAttendanceDto {
  schoolClassId: string
  date: string
  entries: AttendanceEntryInput[]
}

export interface AttendanceListParams {
  schoolClassId: string
  date: string
}
