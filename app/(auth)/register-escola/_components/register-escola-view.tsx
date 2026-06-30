'use client'

import { AuthShell } from '@/components/layout/auth-shell'
import type { AdminProfileValues, EscolaInfoValues } from '@/features/auth/schemas/register-escola-schema'
import { useState } from 'react'
import { ConfirmacaoEmail } from './confirmacao-email'
import { PassoInfoEscola } from './passo-info-escola'
import { PassoPagamento } from './passo-pagamento'
import { PassoPlano } from './passo-plano'
import { PassoPerfilAdmin, getAsidePerfilAdmin } from './passo-perfil-admin'

type FormData = {
  escola?: EscolaInfoValues
  admin?: AdminProfileValues
  plano?: string
}

export function RegisterEscolaView() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>({})

  function handleEscolaNext(escola: EscolaInfoValues) {
    setData((d) => ({ ...d, escola }))
    setStep(2)
  }

  function handleAdminNext(admin: AdminProfileValues) {
    setData((d) => ({ ...d, admin }))
    setStep(3)
  }

  function handlePlanoNext(plano: string) {
    setData((d) => ({ ...d, plano }))
    setStep(4)
  }

  function handlePagamentoNext() {
    setStep(5)
  }

  if (step === 3) {
    return (
      <PassoPlano
        onNext={handlePlanoNext}
        onBack={() => setStep(2)}
      />
    )
  }

  if (step === 4) {
    return (
      <PassoPagamento
        planoId={data.plano ?? 'crescimento'}
        onNext={handlePagamentoNext}
        onBack={() => setStep(3)}
      />
    )
  }

  if (step === 5) {
    return (
      <ConfirmacaoEmail email={data.admin?.emailInstitucional ?? ''} />
    )
  }

  if (step === 1) {
    return (
      <AuthShell
        title="Vamos começar o seu cadastro"
        description="Insira os dados básicos da sua instituição de ensino para continuarmos."
      >
        <PassoInfoEscola
          defaultValues={data.escola}
          onNext={handleEscolaNext}
        />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Perfil do Administrador"
      description="Preencha seus dados pessoais para prosseguir."
      customAside={data.escola ? getAsidePerfilAdmin(data.escola) : undefined}
    >
      <PassoPerfilAdmin
        escolaData={data.escola!}
        defaultValues={data.admin}
        onNext={handleAdminNext}
        onBack={() => setStep(1)}
      />
    </AuthShell>
  )
}
