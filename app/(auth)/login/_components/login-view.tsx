'use client'

import { AuthShell } from '@/components/layout/auth-shell'
import { LoginForm } from '@/features/auth/components/login-form'

export function LoginView() {
  return (
    <AuthShell
      title="Bem-vindo de volta"
      description="Insira suas credenciais para acessar o painel administrativo."
    >
      <LoginForm />
    </AuthShell>
  )
}
