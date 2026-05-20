import { z } from 'zod'

export const generateActivitySchema = z.object({
  lessonPlanId: z.string().uuid('Selecione um plano de aula valido'),
  subject: z.string().min(2, 'Disciplina deve ter no minimo 2 caracteres').max(100, 'Disciplina deve ter no maximo 100 caracteres'),
  grade: z.string().min(1, 'Serie e obrigatoria').max(60, 'Serie deve ter no maximo 60 caracteres'),
  ageRange: z.string().min(2, 'Faixa etaria e obrigatoria').max(50, 'Faixa etaria deve ter no maximo 50 caracteres'),
  type: z.coerce.number().int().min(1).max(4) as z.ZodType<1 | 2 | 3 | 4>,
  numberOfQuestions: z.coerce.number().int().min(1, 'Quantidade de questoes deve ser maior que zero').max(100, 'Quantidade de questoes deve ser no maximo 100'),
  additionalInstructions: z.string().max(2000, 'Instrucoes adicionais devem ter no maximo 2000 caracteres').optional(),
})

export type GenerateActivityFormValues = z.infer<typeof generateActivitySchema>

