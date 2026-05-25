import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('siaed_token')

  if (token) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5de0e6]/10 to-[#004aad]/10">
      <div className="container-app flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
