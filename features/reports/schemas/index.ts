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
})

export type GenerateReportFormValues = z.infer<typeof generateReportSchema>

export const updateReportSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  summary: z.string().min(1, 'Resumo é obrigatório'),
  parentCommunication: z.string().min(1, 'Comunicação com os pais é obrigatória'),
})

export type UpdateReportFormValues = z.infer<typeof updateReportSchema>
