import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    role: z.union([z.literal(1), z.literal(2), z.literal(3)], {
      error: () => ({ message: 'Selecione um perfil' }),
    }),
    subject: z.string().optional(),
    schoolId: z
      .string()
      .optional()
      .transform((val) => (val === '' ? undefined : val)),
  })
  .superRefine((data, ctx) => {
    if (data.role === 1 && !data.subject) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Disciplina é obrigatória para professores',
        path: ['subject'],
      })
    }
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
