'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface LessonPlansEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function LessonPlansEmptyState({ hasFilters, onClearFilters }: LessonPlansEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
      <p className="text-sm text-muted-foreground">Nenhum plano de aula encontrado.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {hasFilters && (
          <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
        <Button asChild size="sm">
          <Link href="/lesson-plans/new">Criar plano manual</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/lesson-plans/generate">Gerar com IA</Link>
        </Button>
      </div>
    </div>
  )
}
