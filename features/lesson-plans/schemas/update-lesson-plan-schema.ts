import { z } from 'zod'

export const updateLessonPlanSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(150, 'Título deve ter no máximo 150 caracteres'),
  objectives: z.string().min(10, 'Objetivos deve ter no mínimo 10 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  methodology: z.string().min(10, 'Metodologia deve ter no mínimo 10 caracteres'),
  resources: z.string().min(10, 'Recursos deve ter no mínimo 10 caracteres'),
  evaluation: z.string().min(10, 'Avaliação deve ter no mínimo 10 caracteres'),
})

export type UpdateLessonPlanFormValues = z.infer<typeof updateLessonPlanSchema>
