import type { DocumentType } from '@/lib/types'
import { http, HttpResponse } from 'msw'
import { CLASS_1_ID, MOCK_STUDENT_LIST, MOCK_STUDENTS } from '../data/seed'
import { makePagedResult } from './utils'

let students = structuredClone(MOCK_STUDENTS)
let studentList = structuredClone(MOCK_STUDENT_LIST)

function syncList() {
  studentList = students.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    documentIdMasked: s.documentIdMasked,
    classId: s.classId,
    className: s.className,
    status: s.status,
  }))
}

export const studentHandlers = [
  http.get('*/api/v1/students', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')
    const classId = url.searchParams.get('classId')

    let items = studentList
    if (search) items = items.filter((s) => s.fullName.toLowerCase().includes(search))
    if (status) items = items.filter((s) => s.status === Number(status))
    if (classId) items = items.filter((s) => s.classId === classId)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/students/:id', ({ params }) => {
    const student = students.find((x) => x.id === params.id)
    if (!student) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(student)
  }),

  http.post('*/api/v1/students', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    const newStudent = {
      id: newId,
      fullName: (body.fullName as string) ?? 'Novo Aluno',
      documentType: ((body.documentType as number) ?? 1) as DocumentType,
      documentIdMasked: '***.***.***-**',
      birthDate: (body.birthDate as string) ?? now,
      classId: (body.classId as string) ?? CLASS_1_ID,
      className: 'Turma',
      status: 1 as const,
      enrollmentDate: (body.enrollmentDate as string) ?? now,
      notes: (body.notes as string) ?? null,
      createdAt: now,
    }
    students.push(newStudent)
    syncList()
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/students/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = students.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    students[idx] = {
      ...students[idx],
      fullName: (body.fullName as string) ?? students[idx].fullName,
      documentType: ((body.documentType as number) ?? students[idx].documentType) as DocumentType,
      notes: (body.notes as string) ?? students[idx].notes,
    }
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/students/:id/transfer', async ({ params, request }) => {
    const body = (await request.json()) as { newClassId: string }
    const idx = students.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    students[idx].classId = body.newClassId
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/students/:id/deactivate', async ({ params, request }) => {
    const body = (await request.json()) as { status: 2 | 3 }
    const idx = students.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    students[idx].status = body.status
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/students/:id/reactivate', async ({ params, request }) => {
    const body = (await request.json()) as { classId: string }
    const idx = students.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    students[idx].status = 1
    students[idx].classId = body.classId
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('*/api/v1/students/import', () => {
    return HttpResponse.json({ imported: 5, skipped: 1, errors: [] }, { status: 201 })
  }),
]
