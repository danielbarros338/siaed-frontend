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
import { useCreateReport } from '@/features/reports/hooks/use-create-report'
import { useStudentsForSelect } from '@/features/reports/hooks/use-students-for-select'
import { createReportSchema, type CreateReportFormValues } from '@/features/reports/schemas'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ManualReportFormProps {
  prefilledStudentId?: string
}

export function ManualReportForm({ prefilledStudentId }: ManualReportFormProps) {
  const { user } = useCurrentUser()
  const router = useRouter()
  const { data: studentsData } = useStudentsForSelect()
  const { mutateAsync, isPending } = useCreateReport()

  const form = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      studentId: prefilledStudentId ?? '',
      content: '',
      summary: '',
      parentCommunication: '',
    },
  })

  async function onSubmit(values: CreateReportFormValues) {
    if (!user) return
    try {
      await mutateAsync({
        userId: user.userId,
        studentId: values.studentId,
        content: values.content,
        summary: values.summary,
        parentCommunication: values.parentCommunication,
        isAIGenerated: false,
      })
      toast.success('Relatório criado com sucesso.')
      router.push('/reports')
    } catch (err) {
      const messages = axios.isAxiosError(err)
        ? (err.response?.data?.errors as string[] | undefined) ?? ['Erro ao criar relatório.']
        : ['Erro ao criar relatório.']
      messages.forEach((m) => toast.error(m))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            Salvar relatório
          </Button>
        </div>
      </form>
    </Form>
  )
}
