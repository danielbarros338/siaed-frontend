import { http, HttpResponse } from 'msw'
import { MOCK_TEACHERS } from '../data/seed'

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

export const teacherHandlers = [
  http.get('*/api/v1/teachers', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20)
    const search = url.searchParams.get('search')?.toLowerCase()

    let items = MOCK_TEACHERS
    if (search) items = items.filter((t) => t.name.toLowerCase().includes(search) || (t.subject?.toLowerCase().includes(search) ?? false))

    return HttpResponse.json(makePagedResult(items, page, pageSize))
  }),
]
