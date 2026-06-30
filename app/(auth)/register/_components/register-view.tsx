'use client'

import { AuthShell } from '@/components/layout/auth-shell'
import { RegisterForm } from '@/features/auth/components/register-form'
import Link from 'next/link'

export function RegisterView() {
  return (
    <AuthShell
      eyebrow="Novo acesso"
      title="Criar conta"
      description="Preencha seus dados para começar a usar o Siaed e centralizar a gestão pedagógica em um único lugar."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Cadastro institucional
          </p>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            O cadastro é pensado para professores, coordenadores e diretores que precisam de acesso seguro e rastreável.
          </p>
        </div>

        <RegisterForm />

        <div className="flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <p>
            Já tem conta?
            {' '}
            <Link href="/login" className="font-medium text-[#003a8c] underline-offset-4 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
