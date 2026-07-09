import { http, HttpResponse } from 'msw'
import { MOCK_CLASS_LIST, MOCK_CLASSES, MOCK_TEACHER_ID } from '../data/seed'
import { makePagedResult } from './utils'

let classes = structuredClone(MOCK_CLASSES)
let classesList = structuredClone(MOCK_CLASS_LIST)

function syncList() {
  classesList = classes.map((c) => ({
    id: c.id,
    name: c.name,
    grade: c.grade,
    schoolYear: c.schoolYear,
    status: c.status,
    createdBy: c.createdBy,
  }))
}

function isOwnershipViolation(requestUrl: URL, createdBy: string) {
  const requestingRole = Number(requestUrl.searchParams.get('requestingRole') ?? 0)
  const requestingUserId = requestUrl.searchParams.get('requestingUserId') ?? ''
  return requestingRole === 1 && createdBy !== requestingUserId
}

export const classHandlers = [
  http.get('*/api/v1/classes', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20)
    const search = url.searchParams.get('search')?.toLowerCase()
    const teacherId = url.searchParams.get('teacherId')

    let items = classesList
    if (teacherId) {
      const allowedIds = new Set(
        classes.filter((c) => c.teacherIds?.includes(teacherId)).map((c) => c.id),
      )
      items = items.filter((c) => allowedIds.has(c.id))
    }
    if (search) items = items.filter((c) => c.name.toLowerCase().includes(search) || c.grade.toLowerCase().includes(search))

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/classes/:id', ({ params }) => {
    const cls = classes.find((x) => x.id === params.id)
    if (!cls) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(cls)
  }),

  http.post('*/api/v1/classes', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const url = new URL(request.url)
    const newId = crypto.randomUUID()
    const newClass = {
      id: newId,
      name: (body.name as string) ?? 'Nova Turma',
      grade: (body.grade as string) ?? '',
      schoolYear: (body.schoolYear as number) ?? new Date().getFullYear(),
      status: 1 as const,
      createdAt: new Date().toISOString(),
      createdBy: url.searchParams.get('requestingUserId') || MOCK_TEACHER_ID,
      teacherIds: (body.teacherIds as string[]) ?? [],
      teachers: [],
    }
    classes.push(newClass)
    syncList()
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/classes/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const url = new URL(request.url)
    const idx = classes.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    if (isOwnershipViolation(url, classes[idx].createdBy)) {
      return new HttpResponse(null, { status: 403 })
    }
    classes[idx] = {
      ...classes[idx],
      name: (body.name as string) ?? classes[idx].name,
      grade: (body.grade as string) ?? classes[idx].grade,
      schoolYear: (body.schoolYear as number) ?? classes[idx].schoolYear,
      teacherIds: (body.teacherIds as string[]) ?? classes[idx].teacherIds,
    }
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/api/v1/classes/:id', ({ params, request }) => {
    const url = new URL(request.url)
    const idx = classes.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    if (isOwnershipViolation(url, classes[idx].createdBy)) {
      return new HttpResponse(null, { status: 403 })
    }
    classes.splice(idx, 1)
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/classes/:id/reactivate', ({ params, request }) => {
    const url = new URL(request.url)
    const idx = classes.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    if (isOwnershipViolation(url, classes[idx].createdBy)) {
      return new HttpResponse(null, { status: 403 })
    }
    classes[idx].status = 1
    syncList()
    return new HttpResponse(null, { status: 204 })
  }),
]
