'use client'

import { Button } from '@/components/ui/button'
import { ClipboardList } from 'lucide-react'
import Link from 'next/link'

interface LessonPlansEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function LessonPlansEmptyState({ hasFilters, onClearFilters }: LessonPlansEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
        <ClipboardList className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Nenhum plano de aula encontrado.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {hasFilters && (
          <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
        <Button asChild size="sm" variant="outline" className="hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
          <Link href="/lesson-plans/generate">Gerar com IA</Link>
        </Button>
        <Button asChild size="sm" className="text-white bg-[linear-gradient(135deg,#7c3aed_0%,#5b21b6_100%)] border-0 hover:opacity-90">
          <Link href="/lesson-plans/new">Criar plano manual</Link>
        </Button>
      </div>
    </div>
  )
}
