'use client'

import { ImportCsvForm } from '@/features/students/components/import-csv-form'
import Link from 'next/link'

export function ImportStudentsView() {
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
