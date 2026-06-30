import { http, HttpResponse } from 'msw'
import { MOCK_GRADES } from '../data/seed'

let grades = structuredClone(MOCK_GRADES)

function makePagedResult<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  return {
    items: paged,
    totalCount: items.length,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

export const gradeHandlers = [
  http.get('*/api/v1/grades', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20)
    const activityId = url.searchParams.get('activityId')
    const schoolClassId = url.searchParams.get('schoolClassId')
    const teacherId = url.searchParams.get('teacherId')

    let items = grades
    if (activityId) items = items.filter((g) => g.activityId === activityId)
    if (schoolClassId) items = items.filter((g) => g.schoolClassId === schoolClassId)
    if (teacherId) items = items.filter((g) => g.teacherId === teacherId)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/grades/:id', ({ params }) => {
    const grade = grades.find((x) => x.id === params.id)
    if (!grade) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(grade)
  }),

  http.post('*/api/v1/grades', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    grades.push({
      id: newId,
      activityId: (body.activityId as string) ?? '',
      studentId: (body.studentId as string) ?? '',
      schoolClassId: (body.schoolClassId as string) ?? '',
      teacherId: (body.teacherId as string) ?? '',
      gradeValue: (body.gradeValue as string) ?? '0',
      conventionKey: (body.conventionKey as string) ?? 'numerical',
      version: '1',
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/grades/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = grades.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    grades[idx] = {
      ...grades[idx],
      gradeValue: (body.gradeValue as string) ?? grades[idx].gradeValue,
      conventionKey: (body.conventionKey as string) ?? grades[idx].conventionKey,
      version: String(Number(grades[idx].version) + 1),
      updatedAt: new Date().toISOString(),
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/api/v1/grades/:id', ({ params }) => {
    const idx = grades.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    grades.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
