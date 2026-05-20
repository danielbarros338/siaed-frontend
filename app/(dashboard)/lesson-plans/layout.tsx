import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface TokenPayload {
  [key: string]: unknown
  role?: number | string
}

const ROLE_CLAIM_KEYS = [
  'role',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role',
] as const

function parseRoleValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  const asNumber = Number(trimmed)

  if (Number.isFinite(asNumber)) {
    return asNumber
  }

  const normalized = trimmed.toLowerCase()
  if (normalized === 'professor') return 1
  if (normalized === 'diretor') return 2
  if (normalized === 'coordenador') return 3

  return null
}

function extractRole(payload: TokenPayload | null): number | null {
  if (!payload) return null

  for (const key of ROLE_CLAIM_KEYS) {
    const parsed = parseRoleValue(payload[key])
    if (parsed !== null) return parsed
  }

  return null
}

function parsePayload(token: string): TokenPayload | null {
  try {
    const base64Payload = token.split('.')[1]
    const padded = base64Payload.padEnd(
      base64Payload.length + (4 - (base64Payload.length % 4)) % 4,
      '=',
    )

    return JSON.parse(Buffer.from(padded, 'base64').toString('utf-8')) as TokenPayload
  } catch {
    return null
  }
}

export default async function LessonPlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('siaed_token')?.value

  if (!token) {
    redirect('/login')
  }

  const payload = parsePayload(token)

  const role = extractRole(payload)

  if (role !== null && role !== 1) {
    redirect('/')
  }

  return <>{children}</>
}
