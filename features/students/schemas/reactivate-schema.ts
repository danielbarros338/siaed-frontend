import { z } from 'zod'

export const reactivateSchema = z.object({
  classId: z.string().uuid('Selecione uma turma válida'),
})

export type ReactivateFormValues = z.infer<typeof reactivateSchema>
