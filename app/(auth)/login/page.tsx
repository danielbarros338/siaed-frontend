import type { Metadata } from 'next'
import { LoginView } from './_components/login-view'

export const metadata: Metadata = {
  title: 'Entrar | SIAED',
  description: 'Acesse o Sistema Integrado de Apoio Educacional',
}

export default function LoginPage() {
  return <LoginView />
}
