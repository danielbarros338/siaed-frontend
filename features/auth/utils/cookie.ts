const COOKIE_NAME = 'siaed_token'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 horas em segundos

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))

  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return

  const isSecure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
  const secureFlag = isSecure ? '; Secure' : ''

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}; Path=/${secureFlag}`
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return

  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`
}
