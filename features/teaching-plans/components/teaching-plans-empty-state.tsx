'use client'

import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'
import Link from 'next/link'

interface TeachingPlansEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function TeachingPlansEmptyState({ hasFilters, onClearFilters }: TeachingPlansEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0066cc]/10 text-[#0066cc]">
        <GraduationCap className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Nenhum plano de ensino encontrado.</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {hasFilters && (
          <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        )}
        <Button asChild size="sm" variant="outline" className="hover:border-[#0066cc]/40 hover:bg-[#0066cc]/5 hover:text-[#0066cc]">
          <Link href="/teaching-plan/generate">Gerar com IA</Link>
        </Button>
        <Button asChild size="sm" className="text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] border-0 hover:opacity-90">
          <Link href="/teaching-plan/new">Criar plano manual</Link>
        </Button>
      </div>
    </div>
  )
}
