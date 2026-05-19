import { z } from 'zod'

export const transferSchema = z.object({
  newClassId: z.string().uuid('Selecione uma turma válida'),
})

export type TransferFormValues = z.infer<typeof transferSchema>
