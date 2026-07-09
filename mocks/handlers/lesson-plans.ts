import { http, HttpResponse } from 'msw'
import { LP_IDS, MOCK_LESSON_PLANS, MOCK_TEACHER_ID } from '../data/seed'

const STATUS_MAP: Record<string, number> = { Draft: 1, Published: 2, Archived: 3 }

let lessonPlans = structuredClone(MOCK_LESSON_PLANS)

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

function randomId() {
  return crypto.randomUUID()
}

export const lessonPlanHandlers = [
  http.get('*/api/v1/lessonplans', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const status = url.searchParams.get('status')
    const teacherId = url.searchParams.get('teacherId')
    const isAIGenerated = url.searchParams.get('isAIGenerated')

    let items = lessonPlans
    if (teacherId) items = items.filter((lp) => lp.teacherId === teacherId)
    if (status && STATUS_MAP[status]) items = items.filter((lp) => lp.status === STATUS_MAP[status])
    if (isAIGenerated !== null) items = items.filter((lp) => String(lp.isAIGenerated) === isAIGenerated)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/lessonplans/:id', ({ params }) => {
    const lp = lessonPlans.find((x) => x.id === params.id)
    if (!lp) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(lp)
  }),

  http.post('*/api/v1/lessonplans', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = randomId()
    const now = new Date().toISOString()
    lessonPlans.push({
      id: newId,
      teacherId: (body.teacherId as string) ?? MOCK_TEACHER_ID,
      title: (body.title as string) ?? 'Novo Plano de Aula',
      subject: (body.subject as string) ?? '',
      grade: (body.grade as string) ?? '',
      durationMinutes: (body.durationMinutes as number) ?? 50,
      objectives: (body.objectives as string) ?? '',
      content: (body.content as string) ?? '',
      methodology: (body.methodology as string) ?? '',
      resources: (body.resources as string) ?? '',
      evaluation: (body.evaluation as string) ?? '',
      references: (body.references as string) ?? '',
      ageRange: (body.ageRange as string) ?? '',
      isAIGenerated: false,
      status: 1,
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.post('*/api/v1/lessonplans/generate', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = randomId()
    const now = new Date().toISOString()
    const generated = {
      id: newId,
      teacherId: (body.teacherId as string) ?? MOCK_TEACHER_ID,
      title: `Plano Gerado por IA — ${body.subject ?? 'Disciplina'} ${body.grade ?? ''}`.trim(),
      subject: (body.subject as string) ?? '',
      grade: (body.grade as string) ?? '',
      durationMinutes: (body.durationMinutes as number) ?? 50,
      objectives: 'Objetivos gerados pela IA com base nas instruções fornecidas.',
      content: 'Conteúdo detalhado gerado pela IA, incluindo conceitos principais e exemplos práticos.',
      methodology: 'Metodologia ativa com uso de recursos digitais e atividades colaborativas.',
      resources: 'Projetor, computadores, materiais impressos.',
      evaluation: 'Avaliação formativa por meio de observação e produção dos alunos.',
      references: 'Referências geradas pela IA com base no contexto informado.',
      ageRange: (body.ageRange as string) ?? '',
      isAIGenerated: true,
      status: 1 as const,
      createdAt: now,
      updatedAt: now,
    }
    lessonPlans.push(generated)
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/lessonplans/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = lessonPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    lessonPlans[idx] = {
      ...lessonPlans[idx],
      title: (body.title as string) ?? lessonPlans[idx].title,
      objectives: (body.objectives as string) ?? lessonPlans[idx].objectives,
      content: (body.content as string) ?? lessonPlans[idx].content,
      methodology: (body.methodology as string) ?? lessonPlans[idx].methodology,
      resources: (body.resources as string) ?? lessonPlans[idx].resources,
      evaluation: (body.evaluation as string) ?? lessonPlans[idx].evaluation,
      references: (body.references as string) ?? lessonPlans[idx].references,
      updatedAt: new Date().toISOString(),
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/lessonplans/:id/publish', ({ params }) => {
    const idx = lessonPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    lessonPlans[idx].status = 2
    lessonPlans[idx].updatedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/lessonplans/:id/archive', ({ params }) => {
    const idx = lessonPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    lessonPlans[idx].status = 3
    lessonPlans[idx].updatedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/api/v1/lessonplans/:id', ({ params }) => {
    const idx = lessonPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    lessonPlans.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

export { LP_IDS }
