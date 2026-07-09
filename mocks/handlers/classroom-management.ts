import { http, HttpResponse } from 'msw'
import {
  MOCK_ATTENDANCE,
  MOCK_CLASS_ROUTINES,
  MOCK_GROUP_DYNAMICS,
  MOCK_INCLUSION_PROFILES,
  MOCK_LEARNING_DIAGNOSTICS,
  MOCK_SOCIOEMOTIONAL_PROFILES,
  MOCK_TEACHER_ID,
} from '../data/seed'
import { makePagedResult } from './utils'

let learningDiagnostics = structuredClone(MOCK_LEARNING_DIAGNOSTICS)
let inclusionProfiles = structuredClone(MOCK_INCLUSION_PROFILES)
let socioemotionalProfiles = structuredClone(MOCK_SOCIOEMOTIONAL_PROFILES)
let groupDynamics = structuredClone(MOCK_GROUP_DYNAMICS)
let classRoutines = structuredClone(MOCK_CLASS_ROUTINES)
let attendanceEntries = structuredClone(MOCK_ATTENDANCE)

export const classroomManagementHandlers = [
  // ─── Diagnóstico de Aprendizagem ───────────────────────────────────────────
  http.get('*/api/v1/classroom-management/learning-diagnostics', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20)
    const studentId = url.searchParams.get('studentId')
    const schoolClassId = url.searchParams.get('schoolClassId')

    let items = learningDiagnostics
    if (studentId) items = items.filter((d) => d.studentId === studentId)
    if (schoolClassId) items = items.filter((d) => d.schoolClassId === schoolClassId)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.post('*/api/v1/classroom-management/learning-diagnostics', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    learningDiagnostics.push({
      id: newId,
      studentId: body.studentId as string,
      schoolClassId: body.schoolClassId as string,
      authorId: MOCK_TEACHER_ID,
      subject: (body.subject as string) ?? '',
      proficiencyLevel: (body.proficiencyLevel as 1 | 2 | 3 | 4) ?? 2,
      identifiedGaps: (body.identifiedGaps as string) ?? '',
      assessmentDate: (body.assessmentDate as string) ?? now,
      notes: (body.notes as string | null) ?? null,
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/classroom-management/learning-diagnostics/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = learningDiagnostics.findIndex((d) => d.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    learningDiagnostics[idx] = {
      ...learningDiagnostics[idx],
      subject: (body.subject as string) ?? learningDiagnostics[idx].subject,
      proficiencyLevel: (body.proficiencyLevel as 1 | 2 | 3 | 4) ?? learningDiagnostics[idx].proficiencyLevel,
      identifiedGaps: (body.identifiedGaps as string) ?? learningDiagnostics[idx].identifiedGaps,
      assessmentDate: (body.assessmentDate as string) ?? learningDiagnostics[idx].assessmentDate,
      notes: (body.notes as string | null) ?? learningDiagnostics[idx].notes,
      updatedAt: new Date().toISOString(),
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Perfil de Inclusão / PEI ───────────────────────────────────────────────
  http.get('*/api/v1/classroom-management/inclusion-profiles/:studentId', ({ params }) => {
    const profile = inclusionProfiles.find((p) => p.studentId === params.studentId)
    if (profile) return HttpResponse.json(profile)
    return HttpResponse.json({
      studentId: params.studentId as string,
      hasSpecialNeeds: false,
      condition: null,
      conditionDescription: null,
      hasMedicalReport: false,
      medicalReportDate: null,
      curricularAdaptations: '',
      needsAEE: false,
      nextPeiReviewDate: null,
      updatedBy: '',
      updatedAt: new Date().toISOString(),
    })
  }),

  http.put('*/api/v1/classroom-management/inclusion-profiles/:studentId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const studentId = params.studentId as string
    const idx = inclusionProfiles.findIndex((p) => p.studentId === studentId)
    const now = new Date().toISOString()
    const updated = {
      studentId,
      hasSpecialNeeds: Boolean(body.hasSpecialNeeds),
      condition: (body.condition as 1 | 2 | 3 | 4 | null) ?? null,
      conditionDescription: (body.conditionDescription as string | null) ?? null,
      hasMedicalReport: Boolean(body.hasMedicalReport),
      medicalReportDate: (body.medicalReportDate as string | null) ?? null,
      curricularAdaptations: (body.curricularAdaptations as string) ?? '',
      needsAEE: Boolean(body.needsAEE),
      nextPeiReviewDate: (body.nextPeiReviewDate as string | null) ?? null,
      updatedBy: MOCK_TEACHER_ID,
      updatedAt: now,
    }
    if (idx === -1) {
      inclusionProfiles.push(updated)
    } else {
      inclusionProfiles[idx] = updated
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Perfil Socioemocional ──────────────────────────────────────────────────
  http.get('*/api/v1/classroom-management/socioemotional-profiles/:studentId', ({ params }) => {
    const profile = socioemotionalProfiles.find((p) => p.studentId === params.studentId)
    if (profile) return HttpResponse.json(profile)
    return HttpResponse.json({
      studentId: params.studentId as string,
      familyContext: '',
      engagementLevel: 2,
      behaviorNotes: '',
      updatedBy: '',
      updatedAt: new Date().toISOString(),
    })
  }),

  http.put('*/api/v1/classroom-management/socioemotional-profiles/:studentId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const studentId = params.studentId as string
    const idx = socioemotionalProfiles.findIndex((p) => p.studentId === studentId)
    const now = new Date().toISOString()
    const updated = {
      studentId,
      familyContext: (body.familyContext as string) ?? '',
      engagementLevel: (body.engagementLevel as 1 | 2 | 3) ?? 2,
      behaviorNotes: (body.behaviorNotes as string) ?? '',
      updatedBy: MOCK_TEACHER_ID,
      updatedAt: now,
    }
    if (idx === -1) {
      socioemotionalProfiles.push(updated)
    } else {
      socioemotionalProfiles[idx] = updated
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Dinâmica de Grupo ──────────────────────────────────────────────────────
  http.get('*/api/v1/classroom-management/group-dynamics/:schoolClassId', ({ params }) => {
    const dynamics = groupDynamics.find((d) => d.schoolClassId === params.schoolClassId)
    if (dynamics) return HttpResponse.json(dynamics)
    return HttpResponse.json({
      schoolClassId: params.schoolClassId as string,
      identifiedLeaders: [],
      conflictsNotes: '',
      workPreference: 3,
      updatedBy: '',
      updatedAt: new Date().toISOString(),
    })
  }),

  http.put('*/api/v1/classroom-management/group-dynamics/:schoolClassId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const schoolClassId = params.schoolClassId as string
    const idx = groupDynamics.findIndex((d) => d.schoolClassId === schoolClassId)
    const now = new Date().toISOString()
    const updated = {
      schoolClassId,
      identifiedLeaders: (body.identifiedLeaders as { studentId: string; studentName: string }[]) ?? [],
      conflictsNotes: (body.conflictsNotes as string) ?? '',
      workPreference: (body.workPreference as 1 | 2 | 3) ?? 3,
      updatedBy: MOCK_TEACHER_ID,
      updatedAt: now,
    }
    if (idx === -1) {
      groupDynamics.push(updated)
    } else {
      groupDynamics[idx] = updated
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Rotina e Combinados ────────────────────────────────────────────────────
  http.get('*/api/v1/classroom-management/class-routines/:schoolClassId', ({ params }) => {
    const routine = classRoutines.find((r) => r.schoolClassId === params.schoolClassId)
    if (routine) return HttpResponse.json(routine)
    return HttpResponse.json({
      schoolClassId: params.schoolClassId as string,
      dailyRoutineDescription: '',
      agreements: [],
      updatedBy: '',
      updatedAt: new Date().toISOString(),
    })
  }),

  http.put('*/api/v1/classroom-management/class-routines/:schoolClassId', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const schoolClassId = params.schoolClassId as string
    const idx = classRoutines.findIndex((r) => r.schoolClassId === schoolClassId)
    const now = new Date().toISOString()
    const updated = {
      schoolClassId,
      dailyRoutineDescription: (body.dailyRoutineDescription as string) ?? '',
      agreements: (body.agreements as string[]) ?? [],
      updatedBy: MOCK_TEACHER_ID,
      updatedAt: now,
    }
    if (idx === -1) {
      classRoutines.push(updated)
    } else {
      classRoutines[idx] = updated
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Frequência Diária ──────────────────────────────────────────────────────
  http.get('*/api/v1/classroom-management/attendance', ({ request }) => {
    const url = new URL(request.url)
    const schoolClassId = url.searchParams.get('schoolClassId')
    const date = url.searchParams.get('date')

    const items = attendanceEntries.filter(
      (a) => a.schoolClassId === schoolClassId && a.date.slice(0, 10) === date?.slice(0, 10),
    )
    return HttpResponse.json(items)
  }),

  http.post('*/api/v1/classroom-management/attendance/bulk', async ({ request }) => {
    const body = (await request.json()) as {
      schoolClassId: string
      date: string
      entries: { studentId: string; status: 1 | 2 | 3; notes?: string | null }[]
    }
    const now = new Date().toISOString()

    for (const entry of body.entries) {
      const idx = attendanceEntries.findIndex(
        (a) =>
          a.schoolClassId === body.schoolClassId &&
          a.studentId === entry.studentId &&
          a.date.slice(0, 10) === body.date.slice(0, 10),
      )
      if (idx === -1) {
        attendanceEntries.push({
          id: crypto.randomUUID(),
          schoolClassId: body.schoolClassId,
          studentId: entry.studentId,
          date: body.date,
          status: entry.status,
          notes: entry.notes ?? null,
          recordedBy: MOCK_TEACHER_ID,
          createdAt: now,
          updatedAt: now,
        })
      } else {
        attendanceEntries[idx] = {
          ...attendanceEntries[idx],
          status: entry.status,
          notes: entry.notes ?? null,
          updatedAt: now,
        }
      }
    }

    return new HttpResponse(null, { status: 204 })
  }),
]
