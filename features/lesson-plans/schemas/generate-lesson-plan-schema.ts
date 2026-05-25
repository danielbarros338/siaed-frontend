import { z } from 'zod'

export const generateLessonPlanSchema = z.object({
  subject: z.string().min(2, 'Disciplina deve ter no mínimo 2 caracteres').max(100, 'Disciplina deve ter no máximo 100 caracteres'),
  grade: z.string().min(1, 'Série é obrigatória').max(60, 'Série deve ter no máximo 60 caracteres'),
  ageRange: z.string().min(2, 'Faixa etária é obrigatória').max(50, 'Faixa etária deve ter no máximo 50 caracteres'),
  durationMinutes: z.coerce.number({ error: 'Duração é obrigatória' }).int('Duração deve ser um número inteiro').min(10, 'Duração mínima de 10 minutos').max(600, 'Duração máxima de 600 minutos'),
  additionalInstructions: z.string().max(2000, 'Instruções adicionais devem ter no máximo 2000 caracteres').optional(),
})

export type GenerateLessonPlanFormValues = z.infer<typeof generateLessonPlanSchema>
