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

interface AIReportFormProps {
  prefilledStudentId?: string
}

export function AIReportForm({ prefilledStudentId }: AIReportFormProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const { data: studentsData } = useStudentsForSelect()
  const { mutateAsync, isPending } = useGenerateReport()

  const form = useForm<GenerateReportFormValues>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      studentId: prefilledStudentId ?? '',
      additionalInstructions: '',
    },
  })

  async function onSubmit(values: GenerateReportFormValues) {
    if (!user) return
    try {
      await mutateAsync({
        userId: user.userId,
        studentId: values.studentId,
        additionalInstructions: values.additionalInstructions || undefined,
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
