import { z } from 'zod'

export const createActivitySchema = z.object({
  title: z.string().min(3, 'Titulo deve ter no minimo 3 caracteres').max(150, 'Titulo deve ter no maximo 150 caracteres'),
  description: z.string().min(5, 'Descricao deve ter no minimo 5 caracteres').max(1000, 'Descricao deve ter no maximo 1000 caracteres'),
  subject: z.string().min(2, 'Disciplina deve ter no minimo 2 caracteres').max(100, 'Disciplina deve ter no maximo 100 caracteres'),
  grade: z.string().min(1, 'Serie e obrigatoria').max(60, 'Serie deve ter no maximo 60 caracteres'),
  ageRange: z.string().min(2, 'Faixa etaria e obrigatoria').max(50, 'Faixa etaria deve ter no maximo 50 caracteres'),
  content: z.string().min(10, 'Conteudo deve ter no minimo 10 caracteres'),
  type: z.coerce.number().int().min(1).max(4) as z.ZodType<1 | 2 | 3 | 4>,
  lessonPlanId: z.string().uuid().nullable(),
})

export type CreateActivityFormValues = z.infer<typeof createActivitySchema>

