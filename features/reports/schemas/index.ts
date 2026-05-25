import { z } from 'zod'

export const createReportSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  parentCommunication: z.string().min(1, 'Comunicação com os pais é obrigatória'),
})

export type CreateReportFormValues = z.infer<typeof createReportSchema>

export const generateReportSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  additionalInstructions: z.string().optional(),
  useHistoricalReports: z.boolean().default(false),
  historicalReportCount: z.coerce.number().int().min(0).default(0),
}).superRefine((values, ctx) => {
  if (values.useHistoricalReports && values.historicalReportCount < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['historicalReportCount'],
      message: 'Informe pelo menos 1 relatório anterior.',
    })
  }

  if (!values.useHistoricalReports && values.historicalReportCount !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['historicalReportCount'],
      message: 'Desative o histórico para enviar 0.',
    })
  }
})

export type GenerateReportFormValues = z.infer<typeof generateReportSchema>

export const updateReportSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  parentCommunication: z.string().min(1, 'Comunicação com os pais é obrigatória'),
})

export type UpdateReportFormValues = z.infer<typeof updateReportSchema>
