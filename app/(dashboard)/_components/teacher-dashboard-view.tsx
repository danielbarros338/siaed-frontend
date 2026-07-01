'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ClipboardList,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTeacherDashboard } from '@/features/dashboard/hooks/use-teacher-dashboard'
import { cn } from '@/lib/utils'
import type { DateFilterPeriod, TeacherAiInsight, TeacherStudentAtRisk } from '@/lib/types/dashboard'
import { EngagementChart } from './engagement-chart'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

// ─── Date filter tabs ─────────────────────────────────────────────────────────

const DATE_FILTERS: { value: DateFilterPeriod; label: string }[] = [
  { value: '30d', label: 'Últimas 30 dias' },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'ano', label: 'Ano Letivo' },
]

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: string
  deltaLabel?: string
  icon: React.ReactNode
  variant?: 'default' | 'warning'
}

function MetricCard({ label, value, deltaLabel, icon, variant = 'default' }: MetricCardProps) {
  return (
    <Card className={cn(variant === 'warning' && 'border-amber-300/60 bg-amber-50/50')}>
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn('text-muted-foreground', variant === 'warning' && 'text-amber-600')}>
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <p className={cn('text-2xl font-bold', variant === 'warning' && 'text-amber-700')}>
          {value}
        </p>
        {deltaLabel && (
          <p className="text-xs text-muted-foreground mt-1">{deltaLabel}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── AI Insight Item ──────────────────────────────────────────────────────────

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
} as const

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

// ─── Risk Badge ───────────────────────────────────────────────────────────────

const RISK_CONFIG = {
  alto: { label: 'Crítico', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  medio: { label: 'Atenção', className: 'bg-amber-50 text-amber-700 border-amber-300' },
  baixo: { label: 'Baixo', className: 'bg-green-50 text-green-700 border-green-300' },
} as const

function RiskBadge({ level }: { level: TeacherStudentAtRisk['nivelRisco'] }) {
  const config = RISK_CONFIG[level]
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium border', config.className)}>
      {config.label}
    </span>
  )
}

// ─── Student initials avatar ──────────────────────────────────────────────────

function StudentAvatar({ nome }: { nome: string }) {
  const initials = nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
  return (
    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
      {initials}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <Skeleton className="h-9 w-64 rounded-xl" />
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
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeacherDashboardView() {
  const [period, setPeriod] = useState<DateFilterPeriod>('30d')
  const { data, isLoading, isError } = useTeacherDashboard(period)

  if (isLoading && !data) return <DashboardSkeleton />

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

  return (
    <div className="space-y-6">
      {/* Header + date filter */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel Pedagógico</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do desempenho acadêmico</p>
        </div>
        <div className="flex gap-1 rounded-xl border p-1 bg-muted">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPeriod(f.value)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition-colors',
                period === f.value
                  ? 'bg-background text-foreground shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Média de Frequência"
          value={`${metrics.mediaFrequencia}%`}
          deltaLabel="das aulas no período"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          label="Desempenho Geral"
          value={metrics.desempenhoGeral.toFixed(1)}
          deltaLabel="Média das turmas"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <MetricCard
          label="Alunos em Risco"
          value={String(metrics.alunosEmRisco)}
          deltaLabel="Requerem atenção"
          icon={<Users className="h-4 w-4" />}
          variant="warning"
        />
        <MetricCard
          label="Planos de Aula Pendentes"
          value={String(metrics.planosAulaPendentes).padStart(2, '0')}
          deltaLabel="Aguardam revisão"
          icon={<ClipboardList className="h-4 w-4" />}
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
              Insights da IA Educacional
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
          title="Evolução do Engajamento"
          subtitle="Análise acadêmica e risco de evasão no período"
        />
      </div>

      {/* At-risk students table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Ação Prioritária: Alunos em Risco</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Lista priorizada por comportamento e desempenho</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.alunosEmRisco.length} alunos
          </Badge>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Nível de Risco</TableHead>
                <TableHead className="pr-6">Última Intervenção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.alunosEmRisco.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <StudentAvatar nome={student.nome} />
                      <span className="font-medium text-sm">{student.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{student.turma}</TableCell>
                  <TableCell>
                    <RiskBadge level={student.nivelRisco} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground pr-6">
                    {formatDate(student.ultimaIntervencao)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
