export type RiskLevel = 'alto' | 'medio' | 'baixo'
export type DateFilterPeriod = '30d' | 'trimestre' | 'ano'

export interface ChartDataPoint {
  month: string
  engajamento: number
  risco: number
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export interface AdminMetrics {
  taxaRetencao: number
  taxaRetencaoDelta: number
  engajamentoPais: number
  engajamentoPaisDelta: number
  produtividadePedagogica: number
  produtividadePedagogicaTrend: 'alta' | 'estavel' | 'baixa'
  alertasCriticos: number
}

export interface AiInsightItem {
  id: string
  tipo: 'alto_risco' | 'atencao_pedagogica' | 'oportunidade'
  titulo: string
  descricao: string
}

export interface AdminStudentAtRisk {
  id: string
  nome: string
  turma: string
  nivelRisco: RiskLevel
  ultimaIntervencao: string
}

export interface AdminDashboardData {
  metrics: AdminMetrics
  aiInsights: AiInsightItem[]
  chartData: ChartDataPoint[]
  alunosEmRisco: AdminStudentAtRisk[]
}

// ─── Teacher Dashboard ────────────────────────────────────────────────────────

export interface TeacherMetrics {
  mediaFrequencia: number
  desempenhoGeral: number
  alunosEmRisco: number
  planosAulaPendentes: number
}

export interface TeacherAiInsight {
  id: string
  tipo: 'critico' | 'atencao' | 'positivo'
  titulo: string
  descricao: string
}

export interface TeacherStudentAtRisk {
  id: string
  nome: string
  turma: string
  nivelRisco: RiskLevel
  ultimaIntervencao: string
}

export interface TeacherDashboardData {
  metrics: TeacherMetrics
  aiInsights: TeacherAiInsight[]
  chartData: ChartDataPoint[]
  alunosEmRisco: TeacherStudentAtRisk[]
}
