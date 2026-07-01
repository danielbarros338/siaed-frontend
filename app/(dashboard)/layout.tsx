import { Sidebar } from '@/components/layout/sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function isTokenExpired(token: string): boolean {
  try {
    const base64Payload = token.split('.')[1]
    const padded = base64Payload.padEnd(
      base64Payload.length + (4 - (base64Payload.length % 4)) % 4,
      '='
    )
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8')) as {
      exp?: number
    }
    if (!payload.exp) return false
    return payload.exp < Date.now() / 1000
  } catch {
    return true
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('siaed_token')

  if (!tokenCookie || isTokenExpired(tokenCookie.value)) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
