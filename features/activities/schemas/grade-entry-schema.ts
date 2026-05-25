import {
    conventionValidationMessage,
    isValidGradeForConvention,
    normalizeConventionKey,
} from '@/features/activities/utils/grade-convention'
import { z } from 'zod'

export const gradeEntrySchema = z
  .object({
    studentId: z.string().uuid('Aluno invalido'),
    gradeValue: z.string().min(1, 'Nota e obrigatoria'),
    conventionKey: z.string().min(1, 'Convencao e obrigatoria'),
    version: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const conventionKey = normalizeConventionKey(value.conventionKey)
    if (!isValidGradeForConvention(value.gradeValue, conventionKey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: conventionValidationMessage(conventionKey),
        path: ['gradeValue'],
      })
    }
  })

export type GradeEntryFormValues = z.infer<typeof gradeEntrySchema>
