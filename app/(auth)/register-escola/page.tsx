import type { Metadata } from 'next'
import { RegisterEscolaView } from './_components/register-escola-view'

export const metadata: Metadata = {
  title: 'Cadastro da Escola | Siaed',
  description: 'Cadastre sua instituição de ensino no Sistema Integrado de Apoio Educacional',
}

export default function RegisterEscolaPage() {
  return <RegisterEscolaView />
}
