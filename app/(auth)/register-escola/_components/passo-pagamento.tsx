'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ArrowLeft, CreditCard, Lock, QrCode, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

const PLANO_LABELS: Record<string, string> = {
  essencial: 'Plano Essencial',
  crescimento: 'Plano Enterprise Ai',
  institucional: 'Plano Institucional',
}

const PLANO_VALORES: Record<string, number> = {
  essencial: 299,
  crescimento: 549,
  institucional: 0,
}

type Props = {
  planoId: string
  onNext: () => void
  onBack: () => void
}

export function PassoPagamento({ planoId, onNext, onBack }: Props) {
  const [tab, setTab] = useState<'cartao' | 'pix'>('cartao')
  const valor = PLANO_VALORES[planoId] ?? 549
  const planoLabel = PLANO_LABELS[planoId] ?? 'Plano Siaed'
  const desconto = 500
  const total = valor > 0 ? valor * 12 - desconto : 0

  return (
    <div className="w-full px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(160deg,#050816_0%,#003a8c_100%)] text-white">
              <span className="text-[0.55rem] font-bold tracking-wider">S</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">SIAED</span>
          </div>

          <div className="hidden flex-1 items-center gap-3 px-8 sm:flex">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[80%] rounded-full bg-[#003a8c]" />
            </div>
            <span className="text-xs font-semibold text-slate-500">80%</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ShieldCheck className="size-3.5 text-[#003a8c]" />
            Suporte
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Payment form */}
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)] sm:p-8">
            <div className="mb-6 space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Forma de Pagamento
              </h1>
              <p className="text-sm leading-6 text-[#003a8c]">
                Escolha como deseja realizar o investimento na educação da sua instituição.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setTab('cartao')}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
                  tab === 'cartao'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <CreditCard className="size-4" />
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setTab('pix')}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
                  tab === 'pix'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <QrCode className="size-4" />
                PIX Instantâneo
              </button>
            </div>

            {tab === 'cartao' ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Número do Cartão
                  </label>
                  <Input placeholder="0000 0000 0000 0000" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Data de Validade
                    </label>
                    <Input placeholder="MM/AA" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Código CVV
                    </label>
                    <Input placeholder="123" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Nome Impresso no Cartão
                  </label>
                  <Input placeholder="JOÃO O. SILVA" className="uppercase" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Parcelamento
                  </label>
                  <Select defaultValue="1x">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1x">
                        1x de R$ {total.toLocaleString('pt-BR')} sem juros
                      </SelectItem>
                      <SelectItem value="3x">
                        3x de R$ {(total / 3).toFixed(2).replace('.', ',')} sem juros
                      </SelectItem>
                      <SelectItem value="6x">
                        6x de R$ {(total / 6).toFixed(2).replace('.', ',')} sem juros
                      </SelectItem>
                      <SelectItem value="12x">
                        12x de R$ {(total / 12).toFixed(2).replace('.', ',')} sem juros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <QrCode className="size-32 text-slate-300" />
                </div>
                <p className="text-sm text-slate-500 text-center">
                  Escaneie o QR Code com o app do seu banco para pagar via PIX.
                </p>
                <p className="text-xs text-slate-400">O código expira em 30 minutos.</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="brand"
                size="lg"
                className="w-full rounded-xl gap-2"
                onClick={onNext}
              >
                <Lock className="size-4" />
                Finalizar Pagamento
              </Button>
              <button
                type="button"
                onClick={onBack}
                className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
              >
                <ArrowLeft className="size-3.5" />
                Voltar
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(160deg,#050816_0%,#0b1224_38%,#003a8c_100%)] p-6 text-white shadow-[0_4px_24px_rgba(0,58,140,0.18)]">
            <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-cyan-300/80">
              Resumo do Pedido
            </p>
            <p className="text-sm font-medium text-white/80">{planoLabel}</p>
            <p className="text-xs text-white/50">Até 500 alunos + AI Pack</p>

            <div className="my-5 border-t border-white/10" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Assinatura Anual</span>
                <span className="text-white">
                  R$ {(valor * 12).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Desconto Onboarding</span>
                <span className="text-[#5de0e6]">-R$ {desconto.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Taxa de Implantação</span>
                <span className="text-white/60">Gratuita</span>
              </div>
            </div>

            <div className="my-5 border-t border-white/10" />

            <div className="flex items-end justify-between">
              <span className="text-sm text-white/70">Total</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  R$ {total.toLocaleString('pt-BR')}
                </p>
                <p className="text-[0.65rem] text-white/50">à vista ou em até 12x</p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/8 p-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#5de0e6]" />
              <p className="text-xs leading-5 text-white/70">
                Seus dados estão protegidos por criptografia de ponta a ponta (AES-256).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
