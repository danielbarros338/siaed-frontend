import { z } from 'zod'

export const createTeachingPlanSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(150, 'Título deve ter no máximo 150 caracteres'),
  subject: z.string().min(2, 'Disciplina deve ter no mínimo 2 caracteres').max(100, 'Disciplina deve ter no máximo 100 caracteres'),
  course: z.string().min(2, 'Curso/segmento deve ter no mínimo 2 caracteres').max(100, 'Curso/segmento deve ter no máximo 100 caracteres'),
  grade: z.string().min(1, 'Série é obrigatória').max(60, 'Série deve ter no máximo 60 caracteres'),
  academicPeriod: z.string().min(1, 'Período letivo é obrigatório').max(30, 'Período letivo deve ter no máximo 30 caracteres'),
  workloadHours: z.coerce.number({ error: 'Carga horária é obrigatória' }).int('Carga horária deve ser um número inteiro').min(1, 'Carga horária mínima de 1 hora').max(2000, 'Carga horária máxima de 2000 horas'),
  syllabus: z.string().min(10, 'Ementa deve ter no mínimo 10 caracteres'),
  generalObjectives: z.string().min(10, 'Objetivos gerais deve ter no mínimo 10 caracteres'),
  specificObjectives: z.string().min(10, 'Objetivos específicos deve ter no mínimo 10 caracteres'),
  programContent: z.string().min(10, 'Conteúdo programático deve ter no mínimo 10 caracteres'),
  methodology: z.string().min(10, 'Estratégias metodológicas deve ter no mínimo 10 caracteres'),
  evaluationCriteria: z.string().min(10, 'Critérios de avaliação deve ter no mínimo 10 caracteres'),
  schedule: z.string().min(10, 'Cronograma deve ter no mínimo 10 caracteres'),
  basicBibliography: z.string().min(10, 'Bibliografia básica deve ter no mínimo 10 caracteres'),
  complementaryBibliography: z.string().min(10, 'Bibliografia complementar deve ter no mínimo 10 caracteres'),
})

export type CreateTeachingPlanFormValues = z.infer<typeof createTeachingPlanSchema>
