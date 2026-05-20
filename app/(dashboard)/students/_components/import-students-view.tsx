'use client'

import { ImportCsvForm } from '@/features/students/components/import-csv-form'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import Link from 'next/link'

export function ImportStudentsView() {
  const { user } = useCurrentUser()
  const canWrite = user?.role === 2 || user?.role === 3

  if (!canWrite) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Apenas coordenadores e diretores podem importar alunos.
        </p>
        <Link href="/students" className="text-sm underline underline-offset-4 hover:text-primary">
          Voltar para a listagem
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/students"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Alunos
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Importar Alunos</h1>
        <p className="text-muted-foreground">Importe múltiplos alunos de uma vez via arquivo CSV.</p>
      </div>

      <ImportCsvForm />
    </div>
  )
}
