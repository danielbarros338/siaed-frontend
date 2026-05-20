import { ClassForm } from '@/features/classes/components/class-form'
import { ClassesTable } from '@/features/classes/components/classes-table'
import { render, screen } from '@testing-library/react'

describe('classes ui', () => {
  it('renderiza empty state da tabela', () => {
    render(<ClassesTable data={[]} isLoading={false} canWrite={true} />)

    expect(screen.getByText('Nenhuma turma encontrada.')).toBeInTheDocument()
  })

  it('renderiza campos principais do formulario', () => {
    render(
      <ClassForm
        mode="create"
        isSubmitting={false}
        onSubmit={() => undefined}
      />,
    )

    expect(screen.getByLabelText('Nome da turma')).toBeInTheDocument()
    expect(screen.getByLabelText('Série')).toBeInTheDocument()
    expect(screen.getByLabelText('Ano letivo')).toBeInTheDocument()
  })
})
