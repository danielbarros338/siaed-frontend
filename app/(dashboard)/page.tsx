import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | SIAED',
}

export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Bem-vindo ao Sistema Integrado de Apoio Educacional.
      </p>
    </main>
  )
}
