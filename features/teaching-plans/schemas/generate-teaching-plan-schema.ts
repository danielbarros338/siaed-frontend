import { z } from 'zod'

export const generateTeachingPlanSchema = z.object({
  subject: z.string().min(2, 'Disciplina deve ter no mínimo 2 caracteres').max(100, 'Disciplina deve ter no máximo 100 caracteres'),
  course: z.string().min(2, 'Curso/segmento deve ter no mínimo 2 caracteres').max(100, 'Curso/segmento deve ter no máximo 100 caracteres'),
  grade: z.string().min(1, 'Série é obrigatória').max(60, 'Série deve ter no máximo 60 caracteres'),
  academicPeriod: z.string().min(1, 'Período letivo é obrigatório').max(30, 'Período letivo deve ter no máximo 30 caracteres'),
  workloadHours: z.coerce.number({ error: 'Carga horária é obrigatória' }).int('Carga horária deve ser um número inteiro').min(1, 'Carga horária mínima de 1 hora').max(2000, 'Carga horária máxima de 2000 horas'),
  additionalInstructions: z.string().max(2000, 'Instruções adicionais devem ter no máximo 2000 caracteres').optional(),
})

export type GenerateTeachingPlanFormValues = z.infer<typeof generateTeachingPlanSchema>
