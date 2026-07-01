'use client'

import { Button } from '@/components/ui/button'

export default function PedagogicoError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="space-y-3 rounded-md border p-6">
      <p className="text-sm font-medium text-destructive">Erro ao carregar o módulo pedagógico.</p>
      <p className="text-sm text-muted-foreground">{error.message || 'Tente novamente em instantes.'}</p>
      <Button type="button" variant="outline" size="sm" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  )
}
