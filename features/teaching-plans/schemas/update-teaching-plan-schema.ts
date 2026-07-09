import { z } from 'zod'

export const updateTeachingPlanSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(150, 'Título deve ter no máximo 150 caracteres'),
  syllabus: z.string().min(10, 'Ementa deve ter no mínimo 10 caracteres'),
  generalObjectives: z.string().min(10, 'Objetivos gerais deve ter no mínimo 10 caracteres'),
  specificObjectives: z.string().min(10, 'Objetivos específicos deve ter no mínimo 10 caracteres'),
  programContent: z.string().min(10, 'Conteúdo programático deve ter no mínimo 10 caracteres'),
  methodology: z.string().min(10, 'Estratégias metodológicas deve ter no mínimo 10 caracteres'),
  evaluationCriteria: z.string().min(10, 'Critérios de avaliação deve ter no mínimo 10 caracteres'),
  schedule: z.string().min(10, 'Cronograma deve ter no mínimo 10 caracteres'),
  basicBibliography: z.string().min(10, 'Bibliografia básica deve ter no mínimo 10 caracteres'),
  complementaryBibliography: z.string().min(10, 'Bibliografia complementar deve ter no mínimo 10 caracteres'),
})

export type UpdateTeachingPlanFormValues = z.infer<typeof updateTeachingPlanSchema>
