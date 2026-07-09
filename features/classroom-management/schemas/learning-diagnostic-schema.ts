import { z } from 'zod'

export const learningDiagnosticSchema = z.object({
  studentId: z.string().uuid('Aluno inválido'),
  subject: z.string().min(2, 'Disciplina deve ter no mínimo 2 caracteres').max(100, 'Disciplina deve ter no máximo 100 caracteres'),
  proficiencyLevel: z.coerce.number().int().min(1).max(4),
  identifiedGaps: z.string().max(2000, 'Lacunas identificadas deve ter no máximo 2000 caracteres'),
  assessmentDate: z.string().min(1, 'Data da avaliação é obrigatória'),
  notes: z.string().max(2000, 'Observações deve ter no máximo 2000 caracteres').optional().nullable(),
})

export type LearningDiagnosticFormValues = z.infer<typeof learningDiagnosticSchema>
