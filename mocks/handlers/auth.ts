import { http, HttpResponse } from 'msw'
import {
  MOCK_ADMIN_ID,
  MOCK_ADMIN_JWT,
  MOCK_PEDAGOG_ID,
  MOCK_PEDAGOG_JWT,
  MOCK_TEACHER_ID,
  MOCK_JWT,
} from '../data/seed'

const USER_DB = [
  {
    email: 'admin@admin.com',
    userId: MOCK_ADMIN_ID,
    name: 'Admin Principal',
    role: 2,
    token: MOCK_ADMIN_JWT,
  },
  {
    email: 'pedagogical@pedagogical.com',
    userId: MOCK_PEDAGOG_ID,
    name: 'Dra. Helena Silva',
    role: 1,
    token: MOCK_PEDAGOG_JWT,
  },
]

export const authHandlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    const found = USER_DB.find((u) => u.email === body.email)
    const user = found ?? {
      userId: MOCK_TEACHER_ID,
      name: 'Professor Demo',
      email: body.email,
      role: 1,
      token: MOCK_JWT,
    }
    return HttpResponse.json({ ...user, expiresAt: '2099-01-01T00:00:00Z' })
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
