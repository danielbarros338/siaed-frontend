import { z } from 'zod'

export const inclusionProfileSchema = z.object({
  hasSpecialNeeds: z.boolean(),
  condition: z.coerce.number().int().min(1).max(4).nullable(),
  conditionDescription: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional().nullable(),
  hasMedicalReport: z.boolean(),
  medicalReportDate: z.string().optional().nullable(),
  curricularAdaptations: z.string().max(2000, 'Adaptações curriculares deve ter no máximo 2000 caracteres'),
  needsAEE: z.boolean(),
  nextPeiReviewDate: z.string().optional().nullable(),
})

export type InclusionProfileFormValues = z.infer<typeof inclusionProfileSchema>
