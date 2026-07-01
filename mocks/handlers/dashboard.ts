import { http, HttpResponse } from 'msw'
import type { AdminDashboardData, TeacherDashboardData } from '@/lib/types/dashboard'

const CHART_DATA = [
  { month: 'JAN', engajamento: 72, risco: 28 },
  { month: 'FEV', engajamento: 75, risco: 26 },
  { month: 'MAR', engajamento: 78, risco: 22 },
  { month: 'ABR', engajamento: 74, risco: 25 },
  { month: 'MAI', engajamento: 80, risco: 19 },
  { month: 'JUN', engajamento: 78, risco: 21 },
]

const ADMIN_MOCK: AdminDashboardData = {
  metrics: {
    taxaRetencao: 94.2,
    taxaRetencaoDelta: 2.4,
    engajamentoPais: 78.5,
    engajamentoPaisDelta: 15,
    produtividadePedagogica: 82.0,
    produtividadePedagogicaTrend: 'estavel',
    alertasCriticos: 12,
  },
  aiInsights: [
    {
      id: '1',
      tipo: 'alto_risco',
      titulo: 'Alto Risco de Evasão',
      descricao: '3 alunos do 7º Ano C com frequência abaixo de 60% nas últimas 4 semanas.',
    },
    {
      id: '2',
      tipo: 'atencao_pedagogica',
      titulo: 'Atenção Pedagógica',
      descricao: 'Turma 6º Ano B com queda de 12% no desempenho em Matemática no último bimestre.',
    },
    {
      id: '3',
      tipo: 'oportunidade',
      titulo: 'Oportunidade de Engajamento',
      descricao: '5º Ano A com alto índice de participação — candidatos a projetos de extensão.',
    },
  ],
  chartData: CHART_DATA,
  alunosEmRisco: [
    {
      id: 'dddddddd-0007-0007-0007-dddddddddddd',
      nome: 'Helena Rodrigues',
      turma: '7º Ano C',
      nivelRisco: 'alto',
      ultimaIntervencao: '2025-06-10T00:00:00Z',
    },
    {
      id: 'dddddddd-0001-0001-0001-dddddddddddd',
      nome: 'Beatriz Almeida',
      turma: '5º Ano A',
      nivelRisco: 'medio',
      ultimaIntervencao: '2025-06-15T00:00:00Z',
    },
    {
      id: 'dddddddd-0002-0002-0002-dddddddddddd',
      nome: 'Carlos Eduardo Mendes',
      turma: '5º Ano A',
      nivelRisco: 'medio',
      ultimaIntervencao: '2025-06-12T00:00:00Z',
    },
  ],
}

const TEACHER_MOCK: TeacherDashboardData = {
  metrics: {
    mediaFrequencia: 94.2,
    desempenhoGeral: 8.4,
    alunosEmRisco: 12,
    planosAulaPendentes: 5,
  },
  aiInsights: [
    {
      id: '1',
      tipo: 'critico',
      titulo: 'Frequência Crítica',
      descricao: 'Carlos Eduardo Mendes faltou 40% das aulas do mês.',
    },
    {
      id: '2',
      tipo: 'atencao',
      titulo: 'Desempenho em Queda',
      descricao: '3 alunos do 6º Ano B com desempenho abaixo de 6,0 em Matemática.',
    },
    {
      id: '3',
      tipo: 'positivo',
      titulo: 'Evolução Positiva',
      descricao: 'Fernanda Costa melhorou 2,0 pontos desde o início do trimestre.',
    },
    {
      id: '4',
      tipo: 'comportamental',
      titulo: 'Clima de Sala Tenso — 5º Ano A',
      descricao: 'Registrados 3 episódios de conflito interpessoal nos últimos encontros. Considere dinâmicas de integração antes da próxima avaliação.',
    },
  ],
  chartData: CHART_DATA,
  alunosEmRisco: [
    {
      id: 'dddddddd-0002-0002-0002-dddddddddddd',
      nome: 'Carlos Eduardo Mendes',
      turma: '5º Ano A',
      nivelRisco: 'alto',
      ultimaIntervencao: '2025-06-12T00:00:00Z',
    },
    {
      id: 'dddddddd-0004-0004-0004-dddddddddddd',
      nome: 'Eduardo Lima',
      turma: '6º Ano B',
      nivelRisco: 'medio',
      ultimaIntervencao: '2025-06-01T00:00:00Z',
    },
    {
      id: 'dddddddd-0007-0007-0007-dddddddddddd',
      nome: 'Helena Rodrigues',
      turma: '7º Ano C',
      nivelRisco: 'alto',
      ultimaIntervencao: '2025-06-10T00:00:00Z',
    },
    {
      id: 'dddddddd-0001-0001-0001-dddddddddddd',
      nome: 'Beatriz Almeida',
      turma: '5º Ano A',
      nivelRisco: 'medio',
      ultimaIntervencao: '2025-06-15T00:00:00Z',
    },
  ],
}

export const dashboardHandlers = [
  http.get('*/api/v1/dashboard/admin', () => HttpResponse.json(ADMIN_MOCK)),
  http.get('*/api/v1/dashboard/teacher', () => HttpResponse.json(TEACHER_MOCK)),
]
