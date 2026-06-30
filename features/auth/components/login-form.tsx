'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { extractApiErrors, useLogin } from '@/features/auth/hooks/use-login'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, LayoutGrid, LockKeyhole, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useLogin()
  const apiErrors = mutation.error ? extractApiErrors(mutation.error) : []

  return (
    <div className="space-y-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  E-mail Institucional
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="nome@escola.com.br"
                      autoComplete="email"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <FormLabel className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Senha
                  </FormLabel>
                  <span className="cursor-pointer text-xs font-medium text-[#003a8c] hover:underline underline-offset-4">
                    Esqueceu a senha?
                  </span>
                </div>
                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-11 pl-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
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

          <label className="flex cursor-pointer items-center gap-2.5 py-0.5">
            <Checkbox />
            <span className="text-sm text-slate-600">Lembrar acesso por 30 dias</span>
          </label>

          {apiErrors.length > 0 && (
            <ul className="space-y-1 rounded-xl border border-destructive/15 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {apiErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <Button type="submit" variant="brand" size="lg" className="w-full rounded-xl" disabled={mutation.isPending}>
            <span>{mutation.isPending ? 'Entrando...' : 'Entrar'}</span>
            {!mutation.isPending && <ArrowRight className="size-4" />}
          </Button>
        </form>
      </Form>

      {/* Social login */}
      <div className="space-y-2.5">
        <Button variant="outline" size="lg" className="w-full rounded-xl gap-3" type="button">
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar com Google
        </Button>

        <Button variant="outline" size="lg" className="w-full rounded-xl gap-3" type="button">
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022" />
            <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF" />
            <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00" />
            <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900" />
          </svg>
          Continuar com Microsoft
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">OU</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Register CTA */}
      <Button variant="outline" size="lg" className="w-full rounded-xl gap-3 border-[#003a8c]/30 text-[#003a8c] hover:bg-[#003a8c]/5" type="button" asChild>
        <Link href="/register-escola">
          <LayoutGrid className="size-4" />
          Cadastrar minha Escola
        </Link>
      </Button>

      {/* Footer */}
      <div className="space-y-1 text-center">
        <p className="text-xs text-slate-400">Sua escola ainda não usa a Siaed?</p>
        <Link
          href="/register-escola"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#003a8c] hover:underline underline-offset-4"
        >
          Comece agora gratuitamente
          <span className="text-[0.65rem] font-bold tracking-wider text-cyan-600">⊕RK</span>
        </Link>
      </div>

      <p className="text-center text-[0.65rem] text-slate-400">
        © 2024 Siaed IA. Todos os direitos reservados.{' '}
        <span className="underline cursor-pointer hover:text-slate-600">Políticas de Privacidade</span>
        {' '}&{' '}
        <span className="underline cursor-pointer hover:text-slate-600">Termos de Uso</span>
      </p>
    </div>
  )
}
