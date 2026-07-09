'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ClipboardList, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function PlansView() {
  return (
    <div className="space-y-6">
      <Link href="/pedagogico" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Pedagógico
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Planos</h1>
        <p className="text-sm text-muted-foreground">
          Escolha o tipo de plano pedagógico que deseja gerenciar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0066cc]/10 text-[#0066cc]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <CardTitle className="mt-3">Plano de Ensino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Documento curricular da disciplina para o semestre ou ano letivo: ementa, objetivos gerais e
              específicos, conteúdo programático, estratégias metodológicas, critérios de avaliação, cronograma
              e bibliografia.
            </p>
            <Button asChild>
              <Link href="/teaching-plan">Acessar Planos de Ensino</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle className="mt-3">Plano de Aula</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Planejamento detalhado de uma aula específica: objetivos, conteúdo, metodologia, recursos didáticos
              e avaliação.
            </p>
            <Button asChild>
              <Link href="/lesson-plans">Acessar Planos de Aula</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
