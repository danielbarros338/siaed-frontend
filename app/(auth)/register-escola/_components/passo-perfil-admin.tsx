'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CARGOS_ADMIN,
  STEP_LABELS,
  adminProfileSchema,
  type AdminProfileValues,
  type EscolaInfoValues,
} from '@/features/auth/schemas/register-escola-schema'
import { StepIndicator } from '@/features/auth/components/step-indicator'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  escolaData: EscolaInfoValues
  defaultValues?: Partial<AdminProfileValues>
  onNext: (data: AdminProfileValues) => void
  onBack: () => void
}

export function PassoPerfilAdmin({ escolaData, defaultValues, onNext, onBack }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<AdminProfileValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      nomeCompleto: '',
      cpf: '',
      cargo: undefined,
      emailInstitucional: '',
      senhaAcesso: '',
      aceitaTermos: false,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-5">
        <StepIndicator steps={STEP_LABELS} currentStep={2} />

        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nome Completo
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Maria Oliveira Santos" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  CPF
                </FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Cargo
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu cargo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CARGOS_ADMIN.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="emailInstitucional"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                E-mail Institucional
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@escola.com.br" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senhaAcesso"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Senha de Acesso
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    className="pr-11"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition-colors hover:text-slate-700"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aceitaTermos"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <label className="flex cursor-pointer items-start gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <span className="text-sm leading-5 text-slate-600">
                  Concordo com os{' '}
                  <Link href="#" className="font-medium text-[#003a8c] underline-offset-4 hover:underline">
                    Termos de Uso
                  </Link>
                  {' '}e a{' '}
                  <Link href="#" className="font-medium text-[#003a8c] underline-offset-4 hover:underline">
                    Política de Privacidade
                  </Link>
                  {' '}da plataforma Siaed.
                </span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="lg" className="gap-2 rounded-xl" onClick={onBack}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
          <Button type="submit" variant="brand" size="lg" className="flex-1 rounded-xl">
            Próximo: Escolher Plano
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function getAsidePerfilAdmin(escolaData: EscolaInfoValues) {
  const tiposLabel = escolaData.tiposInstituicao.join(', ')

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(93,224,230,0.2),transparent_32%),radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[48px_48px]" />

      <div className="relative z-10 space-y-2">
        <p className="text-[0.6rem] font-bold tracking-[0.22em] text-cyan-300/80 uppercase">⊕RK Passo 2 de 5</p>
        <h2 className="text-2xl font-semibold leading-tight">Perfil do Administrador</h2>
        <p className="text-sm leading-6 text-slate-300">
          Este usuário terá acesso total para gerenciar alunos, professores e dados estratégicos da instituição.
        </p>
      </div>

      <div className="relative z-10 space-y-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cyan-100/60">
          Sua Instituição
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/40">Nome da Escola</p>
            <p className="mt-0.5 text-sm font-medium text-white">{escolaData.nomeFantasia}</p>
          </div>
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/40">CNPJ</p>
            <p className="mt-0.5 font-mono text-sm text-[#5de0e6]">{escolaData.cnpj}</p>
          </div>
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/40">Localização</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-white">
              <MapPin className="size-3 shrink-0 text-white/50" />
              {escolaData.cidade}, {escolaData.estado}
            </div>
          </div>
          {tiposLabel && (
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/40">Modalidade</p>
              <p className="mt-0.5 text-sm text-slate-300">{tiposLabel}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
          <div className="flex items-start gap-2.5">
            <Building2 className="mt-0.5 size-4 shrink-0 text-[#5de0e6]" />
            <p className="text-xs leading-5 text-slate-300">
              Você poderá editar estas informações a qualquer momento nas configurações do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
