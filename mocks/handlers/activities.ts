import type { ActivityStatus, ActivityType } from '@/lib/types'
import { http, HttpResponse } from 'msw'
import { MOCK_ACTIVITIES, MOCK_TEACHER_ID } from '../data/seed'

const STATUS_MAP: Record<string, number> = { Draft: 1, Published: 2, Archived: 3 }

let activities = structuredClone(MOCK_ACTIVITIES)

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

export const activityHandlers = [
  http.get('*/api/v1/activities', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const status = url.searchParams.get('status')
    const teacherId = url.searchParams.get('teacherId')
    const isAIGenerated = url.searchParams.get('isAIGenerated')
    const type = url.searchParams.get('type')
    const lessonPlanId = url.searchParams.get('lessonPlanId')

    let items = activities
    if (teacherId) items = items.filter((a) => a.teacherId === teacherId)
    if (status && STATUS_MAP[status]) items = items.filter((a) => a.status === STATUS_MAP[status])
    if (isAIGenerated !== null) items = items.filter((a) => String(a.isAIGenerated) === isAIGenerated)
    if (type) items = items.filter((a) => a.type === Number(type))
    if (lessonPlanId) items = items.filter((a) => a.lessonPlanId === lessonPlanId)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/activities/:id', ({ params }) => {
    const activity = activities.find((x) => x.id === params.id)
    if (!activity) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(activity)
  }),

  http.post('*/api/v1/activities', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    activities.push({
      id: newId,
      teacherId: (body.teacherId as string) ?? MOCK_TEACHER_ID,
      lessonPlanId: (body.lessonPlanId as string) ?? '',
      title: (body.title as string) ?? 'Nova Atividade',
      description: (body.description as string) ?? '',
      subject: (body.subject as string) ?? '',
      grade: (body.grade as string) ?? '',
      ageRange: (body.ageRange as string) ?? '',
      content: (body.content as string) ?? '',
      answerKey: null,
      simplifiedVersion: null,
      type: ((body.type as number) ?? 1) as ActivityType,
      isAIGenerated: false,
      status: 1,
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.post('*/api/v1/activities/generate', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    const typeMap: Record<number, string> = { 1: 'Exercício', 2: 'Quiz', 3: 'Projeto', 4: 'Tarefa de Casa' }
    const typeNum = ((body.type as number) ?? 1) as ActivityType
    const generated = {
      id: newId,
      teacherId: (body.teacherId as string) ?? MOCK_TEACHER_ID,
      lessonPlanId: (body.lessonPlanId as string) ?? '',
      title: `${typeMap[typeNum] ?? 'Atividade'} Gerado por IA — ${body.subject ?? ''}`,
      description: `Atividade gerada automaticamente para a disciplina de ${body.subject ?? 'disciplina'}.`,
      subject: (body.subject as string) ?? '',
      grade: (body.grade as string) ?? '',
      ageRange: (body.ageRange as string) ?? '',
      content: `Questão 1: [Gerado pela IA]\nQuestão 2: [Gerado pela IA]\nQuestão 3: [Gerado pela IA]`,
      answerKey: 'Gabarito gerado pela IA.',
      simplifiedVersion: null,
      type: typeNum,
      isAIGenerated: true,
      status: 1 as ActivityStatus,
      createdAt: now,
      updatedAt: now,
    }
    activities.push(generated)
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/activities/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = activities.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    activities[idx] = {
      ...activities[idx],
      title: (body.title as string) ?? activities[idx].title,
      description: (body.description as string) ?? activities[idx].description,
      content: (body.content as string) ?? activities[idx].content,
      updatedAt: new Date().toISOString(),
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/activities/:id/publish', ({ params }) => {
    const idx = activities.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    activities[idx].status = 2
    activities[idx].updatedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/activities/:id/archive', ({ params }) => {
    const idx = activities.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    activities[idx].status = 3
    activities[idx].updatedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/api/v1/activities/:id', ({ params }) => {
    const idx = activities.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    activities.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
