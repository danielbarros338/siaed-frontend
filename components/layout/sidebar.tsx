'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { cn } from '@/lib/utils'

// ─── Nav items ────────────────────────────────────────────────────────────────

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/pedagogico', label: 'Pedagógico', icon: <GraduationCap className="h-4 w-4" /> },
  { href: '/reports', label: 'Comunicação', icon: <MessageSquare className="h-4 w-4" /> },
  { href: '/students', label: 'Usuários', icon: <Users className="h-4 w-4" /> },
  { href: '/settings', label: 'Configurações', icon: <Settings className="h-4 w-4" />, disabled: true },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { user } = useCurrentUser()
  const logout = useLogout()
  const pathname = usePathname()

  const isAdmin = user?.role === 2 || user?.role === 3

  const roleLabel =
    user?.role === 2
      ? 'Diretor(a)'
      : user?.role === 3
        ? 'Coordenador(a)'
        : 'Professor(a)'

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 min-h-screen relative overflow-hidden bg-[linear-gradient(160deg,#050816_0%,#0b1224_38%,#003a8c_100%)] text-white">
      {/* Decorative overlays — identical to auth-shell */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,224,230,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-white/90 tracking-wide">Siaed</p>
          <p className="text-[10px] text-white/45 leading-none mt-0.5">
            {isAdmin ? 'Gestão Inteligente' : 'Portal Pedagógico'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-2 py-4 space-y-0.5" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

          if (item.disabled) {
            return (
              <span
                key={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/25 cursor-not-allowed select-none"
              >
                {item.icon}
                {item.label}
              </span>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-white/15 text-[#5de0e6] font-medium shadow-[inset_0_0_0_1px_rgba(93,224,230,0.25)]'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="relative z-10 px-2 py-3 border-t border-white/10 space-y-0.5">
        <Link
          href="/support"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Suporte
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {/* User info + branding */}
      <div className="relative z-10 px-4 py-3 border-t border-white/10">
        {user && (
          <div className="mb-2">
            <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
            <p className="text-[10px] text-white/40">{roleLabel}</p>
          </div>
        )}
        <p className="text-[9px] text-white/25 uppercase tracking-widest">
          Powered by Logos Next
        </p>
      </div>
    </aside>
  )
}
