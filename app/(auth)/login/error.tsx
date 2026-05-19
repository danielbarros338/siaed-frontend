'use client'

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <p className="text-destructive text-sm">Erro ao carregar página de login: {error.message}</p>
      <button
        onClick={reset}
        className="text-sm underline underline-offset-4 hover:no-underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}
