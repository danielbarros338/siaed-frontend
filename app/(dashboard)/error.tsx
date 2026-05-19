'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-destructive">Ocorreu um erro: {error.message}</p>
      <button
        onClick={reset}
        className="text-sm underline underline-offset-4 hover:no-underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}
