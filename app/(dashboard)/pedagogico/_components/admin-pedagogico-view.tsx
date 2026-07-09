'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  BookOpen,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminDashboard } from '@/features/dashboard/hooks/use-admin-dashboard'
import { cn } from '@/lib/utils'
import type { AdminStudentAtRisk } from '@/lib/types/dashboard'

// ─── Risk badge ───────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  alto: { label: 'Urgente', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  medio: { label: 'Atenção', className: 'bg-amber-50 text-amber-700 border-amber-300' },
  baixo: { label: 'Estável', className: 'bg-green-50 text-green-700 border-green-300' },
} as const

function RiskBadge({ level }: { level: AdminStudentAtRisk['nivelRisco'] }) {
  const config = RISK_CONFIG[level]
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium border', config.className)}>
      {config.label}
    </span>
  )
}

function studentInitials(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PedagogicoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-44" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminPedagogicoView() {
  const { data, isLoading, isError } = useAdminDashboard()

  if (isLoading) return <PedagogicoSkeleton />

  if (isError || !data) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="pt-6 text-center text-sm text-destructive">
          Não foi possível carregar o módulo pedagógico. Tente novamente mais tarde.
        </CardContent>
      </Card>
    )
  }

  const { metrics, aiInsights, alunosEmRisco } = data

  const alertaRisco = aiInsights.find((i) => i.tipo === 'alto_risco')
  const alertaAtencao = aiInsights.find((i) => i.tipo === 'atencao_pedagogica')
  const alertaOportunidade = aiInsights.find((i) => i.tipo === 'oportunidade')

  const healthPct = metrics.produtividadePedagogica
  const freqPct = metrics.taxaRetencao

  const trendIcon =
    metrics.produtividadePedagogicaTrend === 'alta' ? (
      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
    ) : metrics.produtividadePedagogicaTrend === 'baixa' ? (
      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
    ) : null

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Gestão Pedagógica Administrativa</h1>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold tracking-wider uppercase border-[#0066cc]/30 text-[#0066cc] bg-[#0066cc]/5"
            >
              Institutional Result
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Visão executiva de resultado pedagógico e operacional da instituição. Acompanhe os principais indicadores de conformidade.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="text-xs">
            Gerar Auditoria
          </Button>
          <Button
            size="sm"
            className="text-xs text-white bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] hover:opacity-90 transition-opacity border-0"
          >
            Nova Meta Operacional
          </Button>
        </div>
      </div>

      {/* ── Alertas Críticos ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Alertas Críticos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Risco de Evasão */}
          <Link href="/students" className="block group">
            <Card className="cursor-pointer transition-all hover:border-orange-300 hover:shadow-sm group-hover:bg-orange-50/40">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 mb-0.5">
                      Risco de Evasão
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {alertaRisco?.titulo ?? `${metrics.alertasCriticos} alertas identificados com comportamento de risco`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Absenteísmo Crítico */}
          <Link href="/students" className="block group">
            <Card className="cursor-pointer transition-all hover:border-amber-300 hover:shadow-sm group-hover:bg-amber-50/40">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-0.5">
                      Absenteísmo Crítico
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {alertaAtencao?.titulo ?? 'Faltas não justificadas acima da média esperada'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Produtividade Docente */}
          <Link href="/reports" className="block group">
            <Card className="cursor-pointer transition-all hover:border-purple-300 hover:shadow-sm group-hover:bg-purple-50/40">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 mb-0.5">
                      Produtividade Docente
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {alertaOportunidade?.titulo ?? 'Engajamento pedagógico abaixo da meta'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* ── Planos de Aula + Saúde Operacional ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Planos Pedagógicos */}
        <Link href="/plans" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm h-full">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0066cc]/10 text-[#0066cc]">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-semibold">Planos Pedagógicos</CardTitle>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Gestão do cronograma pedagógico</p>
              <div className="flex items-end gap-4 mb-3">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {metrics.produtividadePedagogica}
                    <span className="text-base font-normal text-muted-foreground">%</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">TOTAL DE PLANOS</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0066cc,#5de0e6)]"
                  style={{ width: `${healthPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                <span>Aprovados</span>
                <span>Pendentes</span>
                <span>Arquivados</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Saúde Operacional */}
        <Link href="/reports" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm h-full bg-[#050816] text-white overflow-hidden relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(93,224,230,0.15),transparent_50%)]" />
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-sm font-semibold text-white/80">Saúde Operacional</CardTitle>
              <p className="text-xs text-white/50">Índice ponderado de desempenho administrativo e pedagógico.</p>
            </CardHeader>
            <CardContent className="relative z-10 flex items-center justify-between gap-4">
              {/* Ring */}
              <div
                className="h-24 w-24 shrink-0 rounded-full flex items-center justify-center text-center"
                style={{
                  background: `conic-gradient(#5de0e6 ${healthPct * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                }}
              >
                <div className="h-[68px] w-[68px] rounded-full bg-[#050816] flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white">{healthPct}%</span>
                  <span className="text-[9px] text-[#5de0e6] uppercase tracking-wider">
                    {metrics.produtividadePedagogicaTrend === 'alta'
                      ? 'excelente'
                      : metrics.produtividadePedagogicaTrend === 'estavel'
                        ? 'estável'
                        : 'atenção'}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Engajamento Pais</span>
                  <span className="text-xs font-semibold text-white">{metrics.engajamentoPais}%</span>
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Retenção</span>
                  <span className="text-xs font-semibold text-white">{metrics.taxaRetencao}%</span>
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Tendência</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-white">
                    {trendIcon}
                    {metrics.produtividadePedagogicaTrend === 'alta'
                      ? 'Em alta'
                      : metrics.produtividadePedagogicaTrend === 'estavel'
                        ? 'Estável'
                        : 'Em queda'}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-1 text-xs bg-white/10 text-white hover:bg-white/20 border-0"
                >
                  Ver Relatório Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ── Frequência + Alunos em Risco ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Frequência Escolar */}
        <Link href="/students" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm h-full">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold">Frequência Escolar</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Média institucional (últimos 7 dias)</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">{freqPct}%</span>
                <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  +{metrics.taxaRetencaoDelta}%
                </span>
              </div>
              {/* Bar chart simulation */}
              <div className="flex items-end gap-1.5 h-16">
                {[72, 68, 75, 80, 78, freqPct, freqPct + 1].map((v, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 rounded-t-sm',
                      i === 5 ? 'bg-[#0066cc]' : 'bg-muted-foreground/20'
                    )}
                    style={{ height: `${(v / 100) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'HOJE'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Alunos em Risco */}
        <Link href="/students" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm h-full">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold">Alunos em Risco</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Intervenção prioritária (Top 3)</p>
              </div>
              <span className="text-xs font-medium text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Todos →
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              {alunosEmRisco.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                  <div className="h-8 w-8 rounded-full bg-[#0066cc]/10 flex items-center justify-center text-[#0066cc] text-xs font-semibold shrink-0">
                    {studentInitials(student.nome)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.nome}</p>
                    <p className="text-xs text-muted-foreground">{student.turma}</p>
                  </div>
                  <RiskBadge level={student.nivelRisco} />
                </div>
              ))}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ── Docentes + Turmas ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/students" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066cc]/10 text-[#0066cc]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Docentes</p>
                  <p className="text-[10px] text-muted-foreground">com métricas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/classes" className="block group">
          <Card className="cursor-pointer transition-all hover:border-[#0066cc]/40 hover:shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Turmas</p>
                  <p className="text-[10px] text-amber-600">em formação</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
