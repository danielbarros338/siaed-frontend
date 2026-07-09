import { http, HttpResponse } from 'msw'
import { MOCK_TEACHER_ID, MOCK_TEACHING_PLANS, TP_IDS } from '../data/seed'

const STATUS_MAP: Record<string, number> = { Draft: 1, Published: 2, Archived: 3 }

let teachingPlans = structuredClone(MOCK_TEACHING_PLANS)

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

export const teachingPlanHandlers = [
  http.get('*/api/v1/teachingplans', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const status = url.searchParams.get('status')
    const authorId = url.searchParams.get('authorId')
    const isAIGenerated = url.searchParams.get('isAIGenerated')

    let items = teachingPlans
    if (authorId) items = items.filter((tp) => tp.authorId === authorId)
    if (status && STATUS_MAP[status]) items = items.filter((tp) => tp.status === STATUS_MAP[status])
    if (isAIGenerated !== null) items = items.filter((tp) => String(tp.isAIGenerated) === isAIGenerated)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/teachingplans/:id', ({ params }) => {
    const tp = teachingPlans.find((x) => x.id === params.id)
    if (!tp) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(tp)
  }),

  http.post('*/api/v1/teachingplans', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = randomId()
    const now = new Date().toISOString()
    teachingPlans.push({
      id: newId,
      authorId: (body.authorId as string) ?? MOCK_TEACHER_ID,
      title: (body.title as string) ?? 'Novo Plano de Ensino',
      subject: (body.subject as string) ?? '',
      course: (body.course as string) ?? '',
      grade: (body.grade as string) ?? '',
      academicPeriod: (body.academicPeriod as string) ?? '',
      workloadHours: (body.workloadHours as number) ?? 80,
      syllabus: (body.syllabus as string) ?? '',
      generalObjectives: (body.generalObjectives as string) ?? '',
      specificObjectives: (body.specificObjectives as string) ?? '',
      programContent: (body.programContent as string) ?? '',
      methodology: (body.methodology as string) ?? '',
      evaluationCriteria: (body.evaluationCriteria as string) ?? '',
      schedule: (body.schedule as string) ?? '',
      basicBibliography: (body.basicBibliography as string) ?? '',
      complementaryBibliography: (body.complementaryBibliography as string) ?? '',
      isAIGenerated: false,
      status: 1,
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.post('*/api/v1/teachingplans/generate', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = randomId()
    const now = new Date().toISOString()
    const generated = {
      id: newId,
      authorId: (body.authorId as string) ?? MOCK_TEACHER_ID,
      title: `Plano de Ensino Gerado por IA — ${body.subject ?? 'Disciplina'} ${body.grade ?? ''}`.trim(),
      subject: (body.subject as string) ?? '',
      course: (body.course as string) ?? '',
      grade: (body.grade as string) ?? '',
      academicPeriod: (body.academicPeriod as string) ?? '',
      workloadHours: (body.workloadHours as number) ?? 80,
      syllabus: 'Ementa gerada pela IA com base no contexto informado.',
      generalObjectives: 'Objetivos gerais gerados pela IA com base no contexto informado.',
      specificObjectives: 'Objetivos específicos gerados pela IA com base no contexto informado.',
      programContent: 'Conteúdo programático gerado pela IA, organizado em unidades de estudo.',
      methodology: 'Estratégias metodológicas ativas geradas pela IA, adaptadas ao contexto informado.',
      evaluationCriteria: 'Critérios e instrumentos de avaliação gerados pela IA com base no contexto informado.',
      schedule: 'Cronograma gerado pela IA distribuindo o conteúdo ao longo do período letivo.',
      basicBibliography: 'Bibliografia básica gerada pela IA com base no contexto informado.',
      complementaryBibliography: 'Bibliografia complementar gerada pela IA com base no contexto informado.',
      isAIGenerated: true,
      status: 1 as const,
      createdAt: now,
      updatedAt: now,
    }
    teachingPlans.push(generated)
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/teachingplans/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = teachingPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    teachingPlans[idx] = {
      ...teachingPlans[idx],
      title: (body.title as string) ?? teachingPlans[idx].title,
      syllabus: (body.syllabus as string) ?? teachingPlans[idx].syllabus,
      generalObjectives: (body.generalObjectives as string) ?? teachingPlans[idx].generalObjectives,
      specificObjectives: (body.specificObjectives as string) ?? teachingPlans[idx].specificObjectives,
      programContent: (body.programContent as string) ?? teachingPlans[idx].programContent,
      methodology: (body.methodology as string) ?? teachingPlans[idx].methodology,
      evaluationCriteria: (body.evaluationCriteria as string) ?? teachingPlans[idx].evaluationCriteria,
      schedule: (body.schedule as string) ?? teachingPlans[idx].schedule,
      basicBibliography: (body.basicBibliography as string) ?? teachingPlans[idx].basicBibliography,
      complementaryBibliography: (body.complementaryBibliography as string) ?? teachingPlans[idx].complementaryBibliography,
      updatedAt: new Date().toISOString(),
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/teachingplans/:id/publish', ({ params }) => {
    const idx = teachingPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    teachingPlans[idx].status = 2
    teachingPlans[idx].updatedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('*/api/v1/teachingplans/:id/archive', ({ params }) => {
    const idx = teachingPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    teachingPlans[idx].status = 3
    teachingPlans[idx].updatedAt = new Date().toISOString()
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/api/v1/teachingplans/:id', ({ params }) => {
    const idx = teachingPlans.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    teachingPlans.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

export { TP_IDS }
