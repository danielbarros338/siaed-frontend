'use client'

interface StudentsErrorProps {
  error: Error
  reset: () => void
}

export default function StudentsError({ error, reset }: StudentsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <p className="text-destructive text-sm">
        Erro ao carregar alunos: {error.message}
      </p>
      <button
        onClick={reset}
        className="text-sm underline underline-offset-4 hover:text-primary"
      >
        Tentar novamente
      </button>
    </div>
  )
}
