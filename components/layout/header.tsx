'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/lesson-plans', label: 'Planos de Aula' },
  { href: '/activities', label: 'Atividades' },
  { href: '/classes', label: 'Turmas' },
  { href: '/students', label: 'Estudantes' },
  { href: '/reports', label: 'Relatórios' },
] as const

export function Header() {
  const { user } = useCurrentUser()
  const logout = useLogout()
  const pathname = usePathname()

  return (
    <header
      className="bg-[linear-gradient(135deg,#0066cc_0%,#004aad_100%)] px-4 py-3 sm:px-6"
    >
      <div className="container-app flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="font-bold text-lg text-white transition-colors hover:text-white/80"
            aria-label="Ir para a dashboard"
          >
            SIAED
          </Link>
          <nav className="max-w-[60vw] overflow-x-auto" aria-label="Navegação principal">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'inline-flex rounded-md px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-white/80">
            Olá, <span className="font-medium text-white">{user.name}</span>
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          aria-label="Sair"
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <LogOut className="mr-2 size-4" />
          Sair
        </Button>
      </div>
      </div>
    </header>
  )
}
