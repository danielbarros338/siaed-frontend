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
import { Textarea } from '@/components/ui/textarea'
import { useUpdateReport } from '@/features/reports/hooks/use-update-report'
import { updateReportSchema, type UpdateReportFormValues } from '@/features/reports/schemas'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import type { Report } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditReportFormProps {
  report: Report
}

export function EditReportForm({ report }: EditReportFormProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const { mutateAsync, isPending } = useUpdateReport(report.id)

  const form = useForm<UpdateReportFormValues>({
    resolver: zodResolver(updateReportSchema),
    defaultValues: {
      content: report.content,
      summary: report.summary,
      parentCommunication: report.parentCommunication,
    },
  })

  async function onSubmit(values: UpdateReportFormValues) {
    if (!user) return
    try {
      await mutateAsync({
        id: report.id,
        requestingUserId: user.userId,
        studentId: report.studentId,
        content: values.content,
        summary: values.summary,
        parentCommunication: values.parentCommunication,
        isAIGenerated: report.isAIGenerated,
      })
      toast.success('Relatório atualizado com sucesso.')
      router.push(`/reports/${report.id}`)
    } catch (err) {
      const messages = axios.isAxiosError(err)
        ? (err.response?.data?.errors as string[] | undefined) ?? ['Erro ao atualizar relatório.']
        : ['Erro ao atualizar relatório.']
      messages.forEach((m) => toast.error(m))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo do relatório</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva detalhadamente o desempenho e observações sobre o aluno..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Resumo geral do relatório..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentCommunication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comunicação com os pais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações a serem comunicadas aos responsáveis..."
                  rows={3}
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
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar alterações
          </Button>
        </div>
      </form>
    </Form>
  )
}
