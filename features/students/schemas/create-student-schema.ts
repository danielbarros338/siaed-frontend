import { z } from 'zod'

export const createStudentSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200, 'Nome deve ter no máximo 200 caracteres'),
  documentType: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    error: 'Tipo de documento é obrigatório',
  }),
  documentId: z
    .string()
    .min(3, 'Documento deve ter no mínimo 3 caracteres')
    .max(30, 'Documento deve ter no máximo 30 caracteres'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida (use AAAA-MM-DD)'),
  classId: z.string().uuid('Turma inválida'),
  enrollmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de matrícula inválida (use AAAA-MM-DD)'),
  notes: z
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
})

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>
