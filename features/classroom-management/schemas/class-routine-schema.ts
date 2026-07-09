import { z } from 'zod'

export const classRoutineSchema = z.object({
  dailyRoutineDescription: z.string().max(2000, 'Estrutura da rotina diária deve ter no máximo 2000 caracteres'),
  agreements: z.array(z.string().min(1, 'Combinado não pode ser vazio')).optional().default([]),
})

export type ClassRoutineFormValues = z.infer<typeof classRoutineSchema>
