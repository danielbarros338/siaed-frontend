'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useGenerateReport } from '@/features/reports/hooks/use-generate-report'
import { useStudentsForSelect } from '@/features/reports/hooks/use-students-for-select'
import { generateReportSchema, type GenerateReportFormValues } from '@/features/reports/schemas'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface AIReportFormProps {
  prefilledStudentId?: string
}

export function AIReportForm({ prefilledStudentId }: AIReportFormProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const { data: studentsData } = useStudentsForSelect()
  const { mutateAsync, isPending } = useGenerateReport()

  const form = useForm<
    z.input<typeof generateReportSchema>,
    unknown,
    GenerateReportFormValues
  >({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      studentId: prefilledStudentId ?? '',
      additionalInstructions: '',
      useHistoricalReports: false,
      historicalReportCount: 0,
    },
  })
  const useHistoricalReports = form.watch('useHistoricalReports')

  async function onSubmit(values: GenerateReportFormValues) {
    if (!user) return
    try {
      await mutateAsync({
        userId: user.userId,
        studentId: values.studentId,
        additionalInstructions: values.additionalInstructions || undefined,
        historicalReportCount: values.useHistoricalReports ? values.historicalReportCount : 0,
      })
      toast.success('Relatório gerado pela IA com sucesso.')
      router.push('/reports')
    } catch (err) {
      const messages = axios.isAxiosError(err)
        ? (err.response?.data?.errors as string[] | undefined) ?? ['Erro ao gerar relatório.']
        : ['Erro ao gerar relatório.']
      messages.forEach((m) => toast.error(m))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <p className="font-medium">Geração por IA</p>
          <p className="mt-1">
            A IA irá gerar automaticamente o conteúdo do relatório com base nos dados do aluno.
            Você pode adicionar instruções extras para personalizar o resultado.
          </p>
        </div>

        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!prefilledStudentId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {studentsData?.items.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruções adicionais (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex.: Foque no desempenho em matemática e no comportamento em sala de aula..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
          <FormField
            control={form.control}
            name="useHistoricalReports"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md">
                <FormControl>
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-input accent-primary"
                    checked={field.value}
                    onChange={(event) => {
                      const checked = event.target.checked
                      field.onChange(checked)

                      form.setValue('historicalReportCount', checked ? 1 : 0, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Considerar relatórios anteriores</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Marque para permitir o uso de relatórios anteriores como contexto da geração.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="historicalReportCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de relatórios anteriores</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    disabled={isPending || !useHistoricalReports}
                    value={typeof field.value === 'number' ? field.value : ''}
                    onChange={(event) => {
                      const rawValue = event.target.value
                      field.onChange(rawValue === '' ? 0 : Number(rawValue))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Gerar com IA
          </Button>
        </div>
      </form>
    </Form>
  )
}
