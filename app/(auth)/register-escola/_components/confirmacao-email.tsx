'use client'

import { Button } from '@/components/ui/button'
import { GraduationCap, Mail, MailCheck, Send } from 'lucide-react'
import Link from 'next/link'

type Props = {
  email: string
}

export function ConfirmacaoEmail({ email }: Props) {
  return (
    <div className="flex w-full flex-col items-center px-4 py-10">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#050816_0%,#003a8c_100%)] text-white shadow-[0_12px_24px_rgba(0,58,140,0.22)]">
          <GraduationCap className="size-6" />
        </div>
        <p className="text-sm font-semibold tracking-widest text-slate-600 uppercase">Siaed</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.10)] text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#003a8c]/8">
          <div className="relative">
            <Mail className="size-8 text-[#003a8c]" />
            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#5de0e6]">
              <MailCheck className="size-3 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Confirme seu E-mail
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enviamos um link de verificação para{' '}
          <span className="font-medium text-slate-800">{email}</span>
          . Por favor, verifique sua caixa de entrada e clique no botão para ativar sua conta.
        </p>

        <Button
          type="button"
          variant="brand"
          size="lg"
          className="mt-6 w-full rounded-xl gap-2"
        >
          <Send className="size-4" />
          Reenviar E-mail
        </Button>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
          <button type="button" className="hover:text-slate-600 hover:underline underline-offset-4">
            Verifique o Spam
          </button>
          <span>·</span>
          <Link href="#" className="hover:text-slate-600 hover:underline underline-offset-4">
            Falar com Suporte
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-[0.65rem] text-slate-400">
        © 2024 Siaed —{' '}
        Desenvolvido por{' '}
        <span className="font-semibold text-slate-500">Logos Next</span>
      </p>
    </div>
  )
}
