'use client'

import {
  AlertTriangle,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminDashboard } from '@/features/dashboard/hooks/use-admin-dashboard'
import { cn } from '@/lib/utils'
import type { AiInsightItem, AdminStudentAtRisk } from '@/lib/types/dashboard'
import { EngagementChart } from './engagement-chart'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string
  delta?: string
  deltaLabel?: string
  icon: React.ReactNode
  variant?: 'default' | 'warning'
}

function MetricCard({ label, value, delta, deltaLabel, icon, variant = 'default' }: MetricCardProps) {
  return (
    <Card className={cn(variant === 'warning' && 'border-destructive/40 bg-destructive/5')}>
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn('text-muted-foreground', variant === 'warning' && 'text-destructive')}>
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <p className={cn('text-2xl font-bold', variant === 'warning' && 'text-destructive')}>
          {value}
        </p>
        {(delta || deltaLabel) && (
          <p className="text-xs text-muted-foreground mt-1">
            {delta && (
              <span className="text-green-600 font-medium mr-1">{delta}</span>
            )}
            {deltaLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── AI Insight Item ──────────────────────────────────────────────────────────

const INSIGHT_CONFIG = {
  alto_risco: {
    label: 'Alto Risco',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/30',
    borderClass: 'border-l-destructive',
  },
  atencao_pedagogica: {
    label: 'Atenção Pedagógica',
    icon: <BookOpen className="h-3.5 w-3.5" />,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-300',
    borderClass: 'border-l-amber-400',
  },
  oportunidade: {
    label: 'Oportunidade',
    icon: <Lightbulb className="h-3.5 w-3.5" />,
    badgeClass: 'bg-secondary text-secondary-foreground border-secondary',
    borderClass: 'border-l-primary',
  },
} as const

function InsightItem({ item }: { item: AiInsightItem }) {
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

// ─── At Risk Student ──────────────────────────────────────────────────────────

const RISK_CONFIG = {
  alto: { label: 'Alto Risco', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  medio: { label: 'Atenção', className: 'bg-amber-50 text-amber-700 border-amber-300' },
  baixo: { label: 'Baixo Risco', className: 'bg-green-50 text-green-700 border-green-300' },
} as const

function AtRiskStudentItem({ student }: { student: AdminStudentAtRisk }) {
  const risk = RISK_CONFIG[student.nivelRisco]
  const initials = student.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{student.nome}</p>
        <p className="text-xs text-muted-foreground">{student.turma}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium border', risk.className)}>
          {risk.label}
        </span>
        <span className="text-xs text-muted-foreground">{formatDate(student.ultimaIntervencao)}</span>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-52 rounded-xl" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminDashboardView() {
  const { data, isLoading, isError } = useAdminDashboard()

  if (isLoading) return <DashboardSkeleton />

  if (isError || !data) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="pt-6 text-center text-sm text-destructive">
          Não foi possível carregar o dashboard. Tente novamente mais tarde.
        </CardContent>
      </Card>
    )
  }

  const { metrics } = data
  const trendLabel =
    metrics.produtividadePedagogicaTrend === 'estavel'
      ? 'Estável'
      : metrics.produtividadePedagogicaTrend === 'alta'
        ? 'Em alta'
        : 'Em queda'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da escola</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Taxa de Retenção"
          value={`${metrics.taxaRetencao}%`}
          delta={`+${metrics.taxaRetencaoDelta}%`}
          deltaLabel="vs. mês anterior"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          label="Engajamento dos Pais"
          value={`${metrics.engajamentoPais}%`}
          delta={`+${metrics.engajamentoPaisDelta}%`}
          deltaLabel="vs. mês anterior"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          label="Produtividade Pedagógica"
          value={`${metrics.produtividadePedagogica}%`}
          deltaLabel={trendLabel}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <MetricCard
          label="Alertas Críticos"
          value={String(metrics.alertasCriticos)}
          deltaLabel="Requerem atenção"
          icon={<AlertTriangle className="h-4 w-4" />}
          variant="warning"
        />
      </div>

      {/* AI Insights + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
                IA
              </span>
              Siaed AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.aiInsights.map((item) => (
              <InsightItem key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>

        <EngagementChart
          data={data.chartData}
          title="Evolução de Engajamento e Risco"
          subtitle="Análise comparativa mensal do ecossistema escolar"
        />
      </div>

      {/* At-risk students */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Foco Imediato: Alunos em Risco</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Lista priorizada por nível de criticidade</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.alunosEmRisco.length} alunos
          </Badge>
        </CardHeader>
        <CardContent>
          {data.alunosEmRisco.map((student) => (
            <AtRiskStudentItem key={student.id} student={student} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
