'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { LogOut } from 'lucide-react'

export function Header() {
  const { user } = useCurrentUser()
  const logout = useLogout()

  return (
    <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
      <span className="font-semibold text-lg">SIAED</span>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-muted-foreground">
            Olá, <span className="font-medium text-foreground">{user.name}</span>
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          aria-label="Sair"
        >
          <LogOut className="mr-2 size-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}
