'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeacherDashboard } from '@/features/dashboard/hooks/use-teacher-dashboard'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import type { SaudeComportamental, TeacherAiInsight } from '@/lib/types/dashboard'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  MessageSquare,
  Sparkles,
  TrendingDown,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// ─── AI Insight config ────────────────────────────────────────────────────────

const INSIGHT_CONFIG = {
  critico: {
    label: 'Alerta Crítico',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/30',
    borderClass: 'border-l-destructive',
  },
  atencao: {
    label: 'Atenção',
    icon: <BookOpen className="h-3.5 w-3.5" />,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
    borderClass: 'border-l-amber-400',
  },
  positivo: {
    label: 'Destaque',
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    badgeClass: 'bg-green-50 text-green-700 border-green-300',
    borderClass: 'border-l-green-500',
  },
  comportamental: {
    label: 'Saúde Comportamental',
    icon: <Brain className="h-3.5 w-3.5" />,
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-300',
    borderClass: 'border-l-violet-500',
  },
} as const

// ─── Saúde comportamental config ──────────────────────────────────────────────

const COMPORTAMENTAL_CONFIG: Record<SaudeComportamental, { label: string; dot: string; text: string; bg: string }> = {
  positivo: { label: 'Clima Positivo',  dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  neutro:   { label: 'Clima Neutro',    dot: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  tenso:    { label: 'Clima Tenso',     dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  critico:  { label: 'Atenção Urgente', dot: 'bg-destructive', text: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20' },
}

function InsightItem({ item }: { item: TeacherAiInsight }) {
  const config = INSIGHT_CONFIG[item.tipo]
  return (
    <div className={cn('pl-3 border-l-2', config.borderClass)}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', config.badgeClass)}>
          {config.icon}
          {config.label}
        </span>
      </div>
      <p className="text-xs font-medium">{item.titulo}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{item.descricao}</p>
    </div>
  )
}

// ─── Static class data (mirrors seed) ────────────────────────────────────────

const MY_CLASSES: Array<{
  id: string
  nome: string
  materia: string
  codigo: string
  desempenho: number
  presenca: number
  risco: number
  saudeComportamental: SaudeComportamental
  notaComportamental: string
}> = [
  {
    id: '1',
    nome: '5º Ano A',
    materia: 'Matemática',
    codigo: 'MAT-504',
    desempenho: 78,
    presenca: 92,
    risco: 4,
    saudeComportamental: 'tenso',
    notaComportamental: 'Conflitos interpessoais recentes. Requer atenção nas dinâmicas de grupo.',
  },
  {
    id: '2',
    nome: '6º Ano B',
    materia: 'Ciências',
    codigo: 'CIE-601',
    desempenho: 85,
    presenca: 96,
    risco: 0,
    saudeComportamental: 'positivo',
    notaComportamental: 'Turma colaborativa e engajada. Boa receptividade a novas atividades.',
  },
]

// ─── Static agenda ────────────────────────────────────────────────────────────

const TODAY_AGENDA = [
  { time: '08:00 – 09:40', subject: 'Matemática – 5º Ano A', location: 'Lab. de Informática • Bloco B' },
  { time: '10:00 – 11:40', subject: 'Ciências – 6º Ano B', location: 'Sala 12 • Prédio Central' },
  { time: '14:00 – 15:40', subject: 'Matemática – 7º Ano C', location: 'Sala 04 • Bloco A' },
]

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PedagogicoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-52 rounded-xl" />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TeacherPedagogicoView() {
  const { user } = useCurrentUser()
  const { data, isLoading, isError } = useTeacherDashboard('30d')

  if (isLoading && !data) return <PedagogicoSkeleton />

  if (isError || !data) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="pt-6 text-center text-sm text-destructive">
          Não foi possível carregar o painel pedagógico. Tente novamente mais tarde.
        </CardContent>
      </Card>
    )
  }

  const { metrics, aiInsights } = data

  const firstName = user?.name?.split(' ')[0] ?? 'Professor'
  const [insightsMinimized, setInsightsMinimized] = useState(false)

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel do Professor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Olá, Prof. {firstName}. Veja o resumo das suas turmas hoje.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            disabled
            size="sm"
            className="text-xs text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] border-0 opacity-50 cursor-not-allowed"
          >
            <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
            Lançar Frequência
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/lesson-plans/new">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Registrar Aula
            </Link>
          </Button>
        </div>
      </div>

      {/* ── AI Insights ─────────────────────────────────────────────────────── */}
      <Card className="text-white border-[#0066cc]/20 overflow-hidden relative bg-[linear-gradient(160deg,#050816_0%,#0b1224_38%,#003a8c_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,224,230,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="relative z-10 flex items-center gap-2 px-4 pt-4 pb-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#5de0e6]/20 text-[#5de0e6]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 text-sm font-semibold text-white/90">
            Insights da IA Educacional
          </span>
          <button
            onClick={() => setInsightsMinimized((v) => !v)}
            className="flex items-center justify-center h-6 w-6 rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white/90"
            aria-label={insightsMinimized ? 'Expandir insights' : 'Minimizar insights'}
          >
            {insightsMinimized ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
        {!insightsMinimized && (
          <CardContent className="relative z-10 px-4 pb-4">
            {aiInsights.length > 0 ? (
              <div className="space-y-4">
                {aiInsights.map((item) => (
                  <div key={item.id} className={cn('pl-3 border-l-2', INSIGHT_CONFIG[item.tipo].borderClass)}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border', INSIGHT_CONFIG[item.tipo].badgeClass)}>
                        {INSIGHT_CONFIG[item.tipo].icon}
                        {INSIGHT_CONFIG[item.tipo].label}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white/90">{item.titulo}</p>
                    <p className="text-xs text-white/50 mt-0.5">{item.descricao}</p>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm" className="text-xs bg-white text-[#050816] hover:bg-white/90 border-0">
                    <Link href="/lesson-plans">Ver Plano Sugerido</Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs text-white/60 hover:text-white hover:bg-white/10">
                    Descartar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/50">Nenhum insight disponível no momento.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Notification alert cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Documentação */}
        <Link href="/plans" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm h-full">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0066cc]/10 text-[#0066cc]">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0066cc] mb-0.5">
                    Planos
                  </p>
                  <p className="text-sm font-semibold">
                    {metrics.planosAulaPendentes} Planos Pendentes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Alerta Crítico */}
        <Link href="/students" className="block group">
          <Card className="cursor-pointer transition-all hover:border-destructive/40 hover:shadow-sm h-full border-destructive/20 bg-destructive/3">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive mb-0.5">
                    Alerta Crítico
                  </p>
                  <p className="text-sm font-semibold">
                    Evasão — {metrics.alunosEmRisco} Aluno{metrics.alunosEmRisco !== 1 ? 's' : ''} em Risco
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Comunicação */}
        <Link href="/reports" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm h-full">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                    Comunicação
                  </p>
                  <p className="text-sm font-semibold">2 Mensagens de Pais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ── Minhas Turmas + Agenda ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Minhas Turmas */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">Minhas Turmas</CardTitle>
            <Link href="/classes" className="text-xs text-[#0066cc] hover:underline font-medium">
              Ver Todas →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {MY_CLASSES.map((cls) => (
              <Link key={cls.id} href="/classes" className="block group">
                <div className="rounded-lg border p-3 cursor-pointer transition-all hover:border-[#0066cc]/40 hover:bg-[#0066cc]/3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold">{cls.nome}</p>
                      <p className="text-xs text-[#0066cc] font-medium">{cls.materia}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground border rounded px-1.5 py-0.5">
                      {cls.codigo}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
                    <div>
                      <p className="text-sm font-bold text-foreground">{cls.desempenho}%</p>
                      <p className="text-[10px] text-muted-foreground">Desempenho</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{cls.presenca}%</p>
                      <p className="text-[10px] text-muted-foreground">Presença</p>
                    </div>
                    <div>
                      <p className={cn('text-sm font-bold', cls.risco > 0 ? 'text-destructive' : 'text-green-600')}>
                        {cls.risco}
                        {cls.risco > 0 && <TrendingDown className="h-3 w-3 inline ml-0.5" />}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Risco</p>
                    </div>
                  </div>
                  {/* Indicador comportamental */}
                  <div className={cn('flex items-center gap-1.5 rounded-md border px-2 py-1', COMPORTAMENTAL_CONFIG[cls.saudeComportamental].bg)}>
                    <Brain className={cn('h-3 w-3 shrink-0', COMPORTAMENTAL_CONFIG[cls.saudeComportamental].text)} />
                    <span className={cn('text-[10px] font-semibold', COMPORTAMENTAL_CONFIG[cls.saudeComportamental].text)}>
                      {COMPORTAMENTAL_CONFIG[cls.saudeComportamental].label}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-0.5 truncate">— {cls.notaComportamental}</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Agenda de Hoje */}
        <Card>
          <CardHeader className="pb-3 flex-row items-center gap-2 space-y-0">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Agenda de Hoje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TODAY_AGENDA.map((slot, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 shrink-0 w-20">
                  {slot.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{slot.subject}</p>
                  <p className="text-[10px] text-muted-foreground">{slot.location}</p>
                  <Link href="/lesson-plans">
                    <button className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#0066cc] hover:underline">
                      <Sparkles className="h-3 w-3" />
                      Acessar Diário
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Relatórios Pedagógicos ──────────────────────────────────────────── */}
      <Link href="/reports" className="block group">
        <Card className="cursor-pointer transition-all hover:border-violet-300 hover:shadow-sm">
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Relatórios Pedagógicos</span>
            </div>
            <span className="text-xs font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Ver Relatórios →
            </span>
          </div>
          <CardContent className="pt-0 pb-5">
            <p className="text-xs text-muted-foreground mb-3">
              Avaliação comportamental individual e coletiva das turmas — base para decisões pedagógicas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MY_CLASSES.map((cls) => {
                const comp = COMPORTAMENTAL_CONFIG[cls.saudeComportamental]
                return (
                  <div key={cls.id} className={cn('rounded-lg border p-3', comp.bg)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-semibold">{cls.nome}</span>
                        <span className="text-[10px] text-muted-foreground ml-1.5">{cls.materia}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('h-2 w-2 rounded-full', comp.dot)} />
                        <span className={cn('text-[10px] font-semibold', comp.text)}>{comp.label}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug">{cls.notaComportamental}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* ── Aniversariantes ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2 flex-row items-center gap-2 space-y-0">
          <Users className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Aniversariantes do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {['MA', 'JO', 'RI'].map((initials) => (
              <div
                key={initials}
                className="h-8 w-8 rounded-full bg-[#0066cc]/10 flex items-center justify-center text-[#0066cc] text-xs font-semibold"
              >
                {initials}
              </div>
            ))}
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
              +2
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              Lembre-se de parabenizá-los hoje!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
