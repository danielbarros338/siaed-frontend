import { z } from 'zod'

export const createClassSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(120, 'Nome deve ter no máximo 120 caracteres'),
  grade: z
    .string()
    .min(2, 'Série deve ter no mínimo 2 caracteres')
    .max(60, 'Série deve ter no máximo 60 caracteres'),
  schoolYear: z.coerce
    .number({ error: 'Ano letivo é obrigatório' })
    .int('Ano letivo inválido')
    .min(2000, 'Ano letivo deve ser maior ou igual a 2000')
    .max(2100, 'Ano letivo deve ser menor ou igual a 2100'),
  teacherIds: z.array(z.string().uuid('Professor inválido')).optional().default([]),
})

export type CreateClassFormValues = z.infer<typeof createClassSchema>
