'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  STEP_LABELS,
  TAMANHOS_ALUNOS,
  TIPOS_INSTITUICAO,
  escolaInfoSchema,
  type EscolaInfoValues,
} from '@/features/auth/schemas/register-escola-schema'
import { StepIndicator } from '@/features/auth/components/step-indicator'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'

type PassoInfoEscolaProps = {
  defaultValues?: Partial<EscolaInfoValues>
  onNext: (data: EscolaInfoValues) => void
}

export function PassoInfoEscola({ defaultValues, onNext }: PassoInfoEscolaProps) {
  const form = useForm<EscolaInfoValues>({
    resolver: zodResolver(escolaInfoSchema),
    defaultValues: {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      tiposInstituicao: [],
      tamanhoAlunos: undefined,
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <StepIndicator steps={STEP_LABELS} currentStep={1} />

        {/* Dados da escola */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="razaoSocial"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Razão Social
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Escola Siaed de Ensino Básico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomeFantasia"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Nome Fantasia
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Colégio Siaed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    CNPJ
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    CEP
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Tipo de Instituição */}
        <FormField
          control={form.control}
          name="tiposInstituicao"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tipo de Instituição
              </FormLabel>
              <div className="flex flex-wrap gap-2">
                {TIPOS_INSTITUICAO.map((tipo) => {
                  const selected = field.value?.includes(tipo)
                  return (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => {
                        const current = field.value ?? []
                        field.onChange(
                          selected
                            ? current.filter((t) => t !== tipo)
                            : [...current, tipo]
                        )
                      }}
                      className={cn(
                        'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                        selected
                          ? 'border-[#003a8c] bg-[#003a8c] text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#003a8c]/40 hover:text-[#003a8c]'
                      )}
                    >
                      {tipo}
                    </button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tamanho da Instituição */}
        <FormField
          control={form.control}
          name="tamanhoAlunos"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Tamanho da Instituição (Nº de Alunos)
              </FormLabel>
              <div className="grid grid-cols-4 gap-2">
                {TAMANHOS_ALUNOS.map((t) => {
                  const selected = field.value === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field.onChange(t.value)}
                      className={cn(
                        'rounded-xl border py-2.5 text-center transition-all',
                        selected
                          ? 'border-[#003a8c] bg-[#003a8c]/5 text-[#003a8c]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      )}
                    >
                      <p className="text-xs font-semibold">{t.label}</p>
                      <p className={cn('mt-0.5 text-[0.6rem] uppercase tracking-wide', selected ? 'text-[#003a8c]/70' : 'text-slate-400')}>
                        {t.sublabel}
                      </p>
                    </button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Endereço */}
        <div className="space-y-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Endereço
          </p>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <FormField
              control={form.control}
              name="rua"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[0.65rem] text-slate-400">Rua / Avenida</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Av. Paulista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem className="w-20 space-y-1.5">
                  <FormLabel className="text-[0.65rem] text-slate-400">Número</FormLabel>
                  <FormControl>
                    <Input placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[0.65rem] text-slate-400">Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Bela Vista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[0.65rem] text-slate-400">Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem className="w-24 space-y-1.5">
                <FormLabel className="text-[0.65rem] text-slate-400">Estado (UF)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SP"
                    maxLength={2}
                    className="uppercase"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" variant="brand" size="lg" className="w-full rounded-xl">
          Próximo: Dados do Administrador
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </Form>
  )
}
