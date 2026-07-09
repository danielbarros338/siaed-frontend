import { z } from 'zod'

export const groupDynamicsSchema = z.object({
  identifiedLeaders: z
    .array(z.object({ studentId: z.string().uuid(), studentName: z.string() }))
    .optional()
    .default([]),
  conflictsNotes: z.string().max(2000, 'Conflitos/bullying mapeados deve ter no máximo 2000 caracteres'),
  workPreference: z.coerce.number().int().min(1).max(3),
})

export type GroupDynamicsFormValues = z.infer<typeof groupDynamicsSchema>
