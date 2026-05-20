import { z } from 'zod'

export const createLessonPlanSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(150, 'Título deve ter no máximo 150 caracteres'),
  subject: z.string().min(2, 'Disciplina deve ter no mínimo 2 caracteres').max(100, 'Disciplina deve ter no máximo 100 caracteres'),
  grade: z.string().min(1, 'Série é obrigatória').max(60, 'Série deve ter no máximo 60 caracteres'),
  durationMinutes: z.coerce.number({ invalid_type_error: 'Duração é obrigatória' }).int('Duração deve ser um número inteiro').min(10, 'Duração mínima de 10 minutos').max(600, 'Duração máxima de 600 minutos'),
  objectives: z.string().min(10, 'Objetivos deve ter no mínimo 10 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  methodology: z.string().min(10, 'Metodologia deve ter no mínimo 10 caracteres'),
  resources: z.string().min(10, 'Recursos deve ter no mínimo 10 caracteres'),
  evaluation: z.string().min(10, 'Avaliação deve ter no mínimo 10 caracteres'),
  ageRange: z.string().min(2, 'Faixa etária é obrigatória').max(50, 'Faixa etária deve ter no máximo 50 caracteres'),
})

export type CreateLessonPlanFormValues = z.infer<typeof createLessonPlanSchema>
