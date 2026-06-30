import { http, HttpResponse } from 'msw'
import { MOCK_REPORTS, MOCK_TEACHER_ID, STUDENT_IDS } from '../data/seed'

let reports = structuredClone(MOCK_REPORTS)

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

export const reportHandlers = [
  http.get('*/api/v1/Reports', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const userId = url.searchParams.get('userId')
    const studentId = url.searchParams.get('studentId')
    const isAIGenerated = url.searchParams.get('isAIGenerated')

    let items = reports
    if (userId) items = items.filter((r) => r.userId === userId)
    if (studentId) items = items.filter((r) => r.studentId === studentId)
    if (isAIGenerated !== null) items = items.filter((r) => String(r.isAIGenerated) === isAIGenerated)

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),

  http.get('*/api/v1/Reports/:id', ({ params }) => {
    const report = reports.find((x) => x.id === params.id)
    if (!report) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(report)
  }),

  http.post('*/api/v1/Reports', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    reports.push({
      id: newId,
      userId: (body.userId as string) ?? MOCK_TEACHER_ID,
      studentId: (body.studentId as string) ?? STUDENT_IDS[0],
      studentName: 'Aluno',
      content: (body.content as string) ?? '',
      summary: (body.summary as string) ?? '',
      parentCommunication: (body.parentCommunication as string) ?? '',
      isAIGenerated: false,
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.post('*/api/v1/Reports/generate', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    reports.push({
      id: newId,
      userId: (body.userId as string) ?? MOCK_TEACHER_ID,
      studentId: (body.studentId as string) ?? STUDENT_IDS[0],
      studentName: 'Aluno',
      content: 'Relatório gerado por IA com base no histórico do aluno. O aluno demonstra progresso consistente nas disciplinas avaliadas, com pontos de atenção em participação oral e entrega de atividades.',
      summary: 'Relatório de desempenho gerado por IA. Progresso consistente identificado.',
      parentCommunication: 'Prezados pais, com base na análise do desempenho do aluno, identificamos áreas de evolução e pontos que merecem atenção. Recomendamos acompanhamento próximo das atividades escolares.',
      isAIGenerated: true,
      createdAt: now,
      updatedAt: now,
    })
    return HttpResponse.json({ id: newId }, { status: 201 })
  }),

  http.put('*/api/v1/Reports/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = reports.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    reports[idx] = {
      ...reports[idx],
      content: (body.content as string) ?? reports[idx].content,
      summary: (body.summary as string) ?? reports[idx].summary,
      parentCommunication: (body.parentCommunication as string) ?? reports[idx].parentCommunication,
      updatedAt: new Date().toISOString(),
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/api/v1/Reports/:id', ({ params }) => {
    const idx = reports.findIndex((x) => x.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    reports.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
