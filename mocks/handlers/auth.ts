import { http, HttpResponse } from 'msw'
import { MOCK_JWT, MOCK_TEACHER_ID } from '../data/seed'

export const authHandlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    return HttpResponse.json({
      userId: MOCK_TEACHER_ID,
      name: 'Professor Demo',
      email: body.email,
      role: 1,
      token: MOCK_JWT,
      expiresAt: '2099-01-01T00:00:00Z',
    })
  }),

  http.post('*/api/v1/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string; name?: string }
    return HttpResponse.json({
      userId: MOCK_TEACHER_ID,
      name: body.name ?? 'Novo Usuário',
      email: body.email,
      role: 1,
      token: MOCK_JWT,
      expiresAt: '2099-01-01T00:00:00Z',
    })
  }),

  http.post('*/api/v1/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
