'use client'

import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface ClassesEmptyStateProps {
  canWrite: boolean
}

export function ClassesEmptyState({ canWrite }: ClassesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
        <BookOpen className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Nenhuma turma encontrada.</p>
      {canWrite && (
        <Button
          asChild
          size="sm"
          className="mt-4 text-white bg-[linear-gradient(135deg,#d97706_0%,#b45309_100%)] border-0 hover:opacity-90"
        >
          <Link href="/classes/new">Inserir turma</Link>
        </Button>
      )}
    </div>
  )
}
