import { createClassSchema } from '@/features/classes/schemas/create-class-schema'

describe('createClassSchema', () => {
  it('valida payload correto', () => {
    const result = createClassSchema.safeParse({
      name: 'Turma A',
      grade: '5º Ano',
      schoolYear: 2026,
    })

    expect(result.success).toBe(true)
  })

  it('rejeita ano letivo fora do intervalo', () => {
    const result = createClassSchema.safeParse({
      name: 'Turma A',
      grade: '5º Ano',
      schoolYear: 1800,
    })

    expect(result.success).toBe(false)
  })
})
