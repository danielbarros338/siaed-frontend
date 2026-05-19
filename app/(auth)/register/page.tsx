import type { Metadata } from 'next'
import { RegisterView } from './_components/register-view'

export const metadata: Metadata = {
  title: 'Cadastro | SIAED',
  description: 'Crie sua conta no Sistema Integrado de Apoio Educacional',
}

export default function RegisterPage() {
  return <RegisterView />
}
