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
    <div
      className="relative min-h-screen overflow-hidden bg-[#f5f7fb] px-4 py-4 sm:px-6 lg:px-8 lg:py-6"
      style={{
        backgroundImage:
          'radial-gradient(circle at top left, rgba(93, 224, 230, 0.18), transparent 30%), radial-gradient(circle at 80% 15%, rgba(0, 74, 173, 0.14), transparent 28%), linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)',
      }}
    >
      <div className="container-app flex min-h-[calc(100vh-2rem)] items-center justify-center">
        {children}
      </div>
    </div>
  )
}
