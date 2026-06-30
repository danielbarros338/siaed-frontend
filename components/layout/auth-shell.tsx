'use client'

import { cn } from '@/lib/utils'
import { GraduationCap } from 'lucide-react'
import type { ReactNode } from 'react'

type AuthShellProps = {
  eyebrow?: string
  title: string
  description: string
  children: ReactNode
  className?: string
  customAside?: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  className,
  customAside,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        'grid w-full overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] lg:min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]',
        className
      )}
    >
      {/* Left panel */}
      <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#050816_0%,#0b1224_38%,#003a8c_100%)] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-10">
        {customAside ?? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,224,230,0.2),transparent_32%),radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%)]" />
            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[48px_48px]" />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur">
                <GraduationCap className="size-5" />
              </div>
              <p className="text-sm font-semibold tracking-wide text-white/90">Siaed</p>
            </div>

            {/* Headline */}
            <div className="relative z-10 max-w-xl space-y-5">
              <h1 className="text-balance text-5xl font-semibold leading-none tracking-tight xl:text-6xl">
                O Futuro da{' '}
                <span className="text-[#5de0e6]">Educação</span>
                {' '}é Inteligente.
              </h1>
              <p className="max-w-md text-base leading-7 text-slate-300">
                Potencialize a gestão pedagógica e administrativa da sua instituição com o poder da Inteligência Artificial Generativa.
              </p>
            </div>

            {/* Insight card */}
            <div className="relative z-10 rounded-[22px] border border-white/10 bg-white/8 p-5 shadow-[0_12px_50px_rgba(1,6,24,0.28)] backdrop-blur">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[0.65rem] font-bold tracking-[0.22em] text-cyan-300/80 uppercase">
                  ⊕RK
                </span>
                <span className="text-[0.6rem] font-semibold tracking-[0.22em] text-white/50 uppercase">
                  Insight da IA em tempo real
                </span>
              </div>
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[62%] rounded-full bg-linear-to-r from-[#5de0e6] to-[#2f6cff]" />
              </div>
              <p className="text-sm leading-6 text-slate-300 italic">
                "Identificamos um padrão de crescimento de 15% no engajamento dos alunos do 9° ano após a implementação dos novos módulos interativos."
              </p>
            </div>
          </>
        )}
      </aside>

      {/* Right panel */}
      <section className="relative flex flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-105 flex-col gap-7">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(160deg,#050816_0%,#003a8c_100%)] text-white">
              <GraduationCap className="size-4" />
            </div>
            <p className="text-sm font-semibold tracking-wide text-slate-800">Siaed</p>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            {eyebrow && (
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              {title}
            </h2>
            <p className="text-sm leading-6 text-[#003a8c]">
              {description}
            </p>
          </div>

          {children}
        </div>
      </section>
    </div>
  )
}
