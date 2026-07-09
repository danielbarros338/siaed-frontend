'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useInclusionProfile } from '@/features/classroom-management/hooks/use-inclusion-profile'
import { useUpdateInclusionProfile } from '@/features/classroom-management/hooks/use-update-inclusion-profile'
import {
    inclusionProfileSchema,
    type InclusionProfileFormValues,
} from '@/features/classroom-management/schemas/inclusion-profile-schema'
import { INCLUSION_CONDITION_LABELS, type InclusionCondition } from '@/features/classroom-management/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

interface InclusionProfileFormProps {
  studentId: string
  canManage: boolean
}

export function InclusionProfileForm({ studentId, canManage }: InclusionProfileFormProps) {
  const { data, isLoading } = useInclusionProfile(studentId)
  const mutation = useUpdateInclusionProfile(studentId)

  const form = useForm<InclusionProfileFormValues>({
    resolver: zodResolver(inclusionProfileSchema) as unknown as Resolver<InclusionProfileFormValues>,
    values: data
      ? {
          hasSpecialNeeds: data.hasSpecialNeeds,
          condition: data.condition,
          conditionDescription: data.conditionDescription,
          hasMedicalReport: data.hasMedicalReport,
          medicalReportDate: data.medicalReportDate?.slice(0, 10) ?? null,
          curricularAdaptations: data.curricularAdaptations,
          needsAEE: data.needsAEE,
          nextPeiReviewDate: data.nextPeiReviewDate?.slice(0, 10) ?? null,
        }
      : undefined,
    defaultValues: {
      hasSpecialNeeds: false,
      condition: null,
      conditionDescription: '',
      hasMedicalReport: false,
      medicalReportDate: '',
      curricularAdaptations: '',
      needsAEE: false,
      nextPeiReviewDate: '',
    },
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando perfil de inclusão...</p>
  }

  function handleSubmit(values: InclusionProfileFormValues) {
    mutation.mutate({ ...values, condition: values.condition as InclusionCondition | null })
  }

  return (
    <Form {...form}>
      <fieldset disabled={!canManage} className="space-y-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {!canManage && (
            <p className="text-xs text-muted-foreground">
              Você tem acesso somente de leitura a este perfil.
            </p>
          )}

          <FormField
            control={form.control}
            name="hasSpecialNeeds"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="mt-0!">Aluno com necessidade especial identificada</FormLabel>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condição</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(INCLUSION_CONDITION_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
              name="conditionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhe (quando &quot;Outro&quot;)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="hasMedicalReport"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="mt-0!">Laudo médico apresentado</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicalReportDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do laudo</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="curricularAdaptations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adaptações curriculares</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="needsAEE"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="mt-0!">Necessita AEE (Atendimento Educacional Especializado)</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextPeiReviewDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próxima revisão do PEI</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {canManage && (
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar perfil de inclusão'}
            </Button>
          )}
        </form>
      </fieldset>
    </Form>
  )
}
