import { z } from 'zod'

export const updateActivitySchema = z.object({
  title: z.string().min(3, 'Titulo deve ter no minimo 3 caracteres').max(150, 'Titulo deve ter no maximo 150 caracteres'),
  description: z.string().min(5, 'Descricao deve ter no minimo 5 caracteres').max(1000, 'Descricao deve ter no maximo 1000 caracteres'),
  content: z.string().min(10, 'Conteudo deve ter no minimo 10 caracteres'),
})

export type UpdateActivityFormValues = z.infer<typeof updateActivitySchema>

