'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, GraduationCap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANOS = [
  {
    id: 'essencial',
    label: 'PLANO BASE',
    nome: 'Essencial',
    preco: 'R$ 299',
    periodo: '/mês',
    descricao: 'Fundamentos de gestão e suporte básico.',
    recursos: [
      'Recursos básicos de IA',
      'Gestão de até 10 turmas',
      'Relatórios mensais',
    ],
    cta: 'Começar Agora',
    destaque: false,
  },
  {
    id: 'crescimento',
    label: 'SUÍTE COMPLETA',
    nome: 'Crescimento',
    preco: 'R$ 549',
    periodo: '/mês',
    descricao: 'Suíte completa de IA e automação pedagógica.',
    recursos: [
      'Acesso ilimitado à Siaed',
      'Análise preditiva de evasão',
      'Turmas ilimitadas',
      'Integração com portais',
    ],
    cta: 'Escolher Plano Crescimento',
    destaque: true,
  },
  {
    id: 'institucional',
    label: 'ENTERPRISE',
    nome: 'Institucional',
    preco: 'Sob consulta',
    periodo: '',
    descricao: 'Personalização total para grandes redes de ensino.',
    recursos: [
      'Integrações customizadas (API)',
      'Gerente de conta exclusivo',
      'Infraestrutura dedicada',
    ],
    cta: 'Falar com Especialista',
    destaque: false,
  },
] as const

type Props = {
  onNext: (plano: string) => void
  onBack: () => void
}

export function PassoPlano({ onNext, onBack }: Props) {
  return (
    <div className="w-full px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#050816_0%,#003a8c_100%)] text-white shadow-[0_12px_24px_rgba(0,58,140,0.22)]">
            <GraduationCap className="size-6" />
          </div>
          <p className="text-sm font-semibold tracking-widest text-slate-600 uppercase">Siaed</p>
        </div>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Escolha o Plano Ideal
          </h1>
          <p className="text-sm leading-6 text-[#003a8c]">
            Selecione a infraestrutura de inteligência artificial que melhor atende às necessidades da sua instituição.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PLANOS.map((plano) => (
            <div
              key={plano.id}
              className={cn(
                'relative flex flex-col rounded-[28px] border bg-white p-6 transition-shadow',
                plano.destaque
                  ? 'border-[#003a8c] shadow-[0_16px_48px_rgba(0,58,140,0.16)] ring-1 ring-[#003a8c]/20'
                  : 'border-slate-200 shadow-[0_4px_16px_rgba(15,23,42,0.06)]'
              )}
            >
              {plano.destaque && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#003a8c]/20 bg-[#003a8c] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white">
                    <Sparkles className="size-2.5" />
                    Recomendado
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {plano.label}
                </p>
                <h2 className={cn('text-2xl font-semibold', plano.destaque ? 'text-[#003a8c]' : 'text-slate-900')}>
                  {plano.nome}
                </h2>
              </div>

              <div className="mt-3 flex items-baseline gap-0.5">
                <span className={cn('text-3xl font-bold', plano.destaque ? 'text-[#003a8c]' : 'text-slate-900')}>
                  {plano.preco}
                </span>
                {plano.periodo && (
                  <span className="text-sm text-slate-400">{plano.periodo}</span>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">{plano.descricao}</p>

              <ul className="mt-4 flex-1 space-y-2">
                {plano.recursos.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check
                      className={cn(
                        'mt-0.5 size-3.5 shrink-0',
                        plano.destaque ? 'text-[#003a8c]' : 'text-slate-500'
                      )}
                    />
                    {r}
                  </li>
                ))}
              </ul>

              <Button
                type="button"
                variant={plano.destaque ? 'brand' : 'outline'}
                size="lg"
                className="mt-6 w-full rounded-xl"
                onClick={() => onNext(plano.id)}
              >
                {plano.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Back */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-600"
          >
            <ArrowLeft className="size-3.5" />
            Voltar ao passo anterior
          </button>
        </div>

        <p className="text-center text-[0.65rem] text-slate-400">Siaed by Logos Next</p>
      </div>
    </div>
  )
}
