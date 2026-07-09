import { z } from 'zod'

export const socioemotionalProfileSchema = z.object({
  familyContext: z.string().max(2000, 'Contexto familiar deve ter no máximo 2000 caracteres'),
  engagementLevel: z.coerce.number().int().min(1).max(3),
  behaviorNotes: z.string().max(2000, 'Observações de comportamento deve ter no máximo 2000 caracteres'),
})

export type SocioemotionalProfileFormValues = z.infer<typeof socioemotionalProfileSchema>
