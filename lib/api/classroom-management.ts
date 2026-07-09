import type {
    AttendanceEntry,
    AttendanceListParams,
    BulkUpsertAttendanceDto,
    ClassRoutine,
    CreateLearningDiagnosticDto,
    GroupDynamics,
    InclusionProfile,
    LearningDiagnostic,
    LearningDiagnosticsListParams,
    SocioemotionalProfile,
    UpdateClassRoutineDto,
    UpdateGroupDynamicsDto,
    UpdateInclusionProfileDto,
    UpdateLearningDiagnosticDto,
    UpdateSocioemotionalProfileDto,
} from '@/features/classroom-management/types'
import { apiClient } from '@/lib/api/client'
import type { PagedResult } from '@/lib/types'

export const classroomManagementApi = {
  listLearningDiagnostics: (params: LearningDiagnosticsListParams) =>
    apiClient
      .get<PagedResult<LearningDiagnostic>>('/api/v1/classroom-management/learning-diagnostics', { params })
      .then((r) => r.data),

  createLearningDiagnostic: (dto: CreateLearningDiagnosticDto) =>
    apiClient
      .post<{ id: string }>('/api/v1/classroom-management/learning-diagnostics', dto)
      .then((r) => r.data),

  updateLearningDiagnostic: (id: string, dto: UpdateLearningDiagnosticDto) =>
    apiClient
      .put<void>(`/api/v1/classroom-management/learning-diagnostics/${id}`, dto)
      .then(() => undefined),

  getInclusionProfile: (studentId: string) =>
    apiClient
      .get<InclusionProfile>(`/api/v1/classroom-management/inclusion-profiles/${studentId}`)
      .then((r) => r.data),

  updateInclusionProfile: (studentId: string, dto: UpdateInclusionProfileDto) =>
    apiClient
      .put<void>(`/api/v1/classroom-management/inclusion-profiles/${studentId}`, dto)
      .then(() => undefined),

  getSocioemotionalProfile: (studentId: string) =>
    apiClient
      .get<SocioemotionalProfile>(`/api/v1/classroom-management/socioemotional-profiles/${studentId}`)
      .then((r) => r.data),

  updateSocioemotionalProfile: (studentId: string, dto: UpdateSocioemotionalProfileDto) =>
    apiClient
      .put<void>(`/api/v1/classroom-management/socioemotional-profiles/${studentId}`, dto)
      .then(() => undefined),

  getGroupDynamics: (schoolClassId: string) =>
    apiClient
      .get<GroupDynamics>(`/api/v1/classroom-management/group-dynamics/${schoolClassId}`)
      .then((r) => r.data),

  updateGroupDynamics: (schoolClassId: string, dto: UpdateGroupDynamicsDto) =>
    apiClient
      .put<void>(`/api/v1/classroom-management/group-dynamics/${schoolClassId}`, dto)
      .then(() => undefined),

  getClassRoutine: (schoolClassId: string) =>
    apiClient
      .get<ClassRoutine>(`/api/v1/classroom-management/class-routines/${schoolClassId}`)
      .then((r) => r.data),

  updateClassRoutine: (schoolClassId: string, dto: UpdateClassRoutineDto) =>
    apiClient
      .put<void>(`/api/v1/classroom-management/class-routines/${schoolClassId}`, dto)
      .then(() => undefined),

  listAttendance: (params: AttendanceListParams) =>
    apiClient
      .get<AttendanceEntry[]>('/api/v1/classroom-management/attendance', { params })
      .then((r) => r.data),

  upsertAttendance: (dto: BulkUpsertAttendanceDto) =>
    apiClient
      .post<void>('/api/v1/classroom-management/attendance/bulk', dto)
      .then(() => undefined),
}
