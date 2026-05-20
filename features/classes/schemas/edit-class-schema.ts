import { z } from 'zod'
import { createClassSchema } from './create-class-schema'

export const editClassSchema = createClassSchema.extend({
	id: z.string().uuid('ID da turma inválido').optional(),
})
