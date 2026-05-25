'use client'

import { AIReportForm } from '@/features/reports/components/ai-report-form'
import { ManualReportForm } from '@/features/reports/components/manual-report-form'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Tab = 'manual' | 'ai'

export default function NewReportPage() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId') ?? undefined
  const [activeTab, setActiveTab] = useState<Tab>('manual')

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo Relatório</h1>
        <p className="text-sm text-muted-foreground">
          Crie um relatório manualmente ou deixe a IA gerar automaticamente.
        </p>
      </div>

      <div className="flex rounded-lg border p-1 gap-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Manual
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === 'ai'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Gerar com IA
        </button>
      </div>

      <div className="rounded-lg border p-6">
        {activeTab === 'manual' ? (
          <ManualReportForm prefilledStudentId={studentId} />
        ) : (
          <AIReportForm prefilledStudentId={studentId} />
        )}
      </div>
    </div>
  )
}
