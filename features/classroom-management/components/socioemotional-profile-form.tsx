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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSocioemotionalProfile } from '@/features/classroom-management/hooks/use-socioemotional-profile'
import { useUpdateSocioemotionalProfile } from '@/features/classroom-management/hooks/use-update-socioemotional-profile'
import {
    socioemotionalProfileSchema,
    type SocioemotionalProfileFormValues,
} from '@/features/classroom-management/schemas/socioemotional-profile-schema'
import { ENGAGEMENT_LEVEL_LABELS } from '@/features/classroom-management/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

interface SocioemotionalProfileFormProps {
  studentId: string
  canManageAll: boolean
  canManageBehaviorNotes: boolean
}

export function SocioemotionalProfileForm({
  studentId,
  canManageAll,
  canManageBehaviorNotes,
}: SocioemotionalProfileFormProps) {
  const { data, isLoading } = useSocioemotionalProfile(studentId)
  const mutation = useUpdateSocioemotionalProfile(studentId)

  const form = useForm<SocioemotionalProfileFormValues>({
    resolver: zodResolver(socioemotionalProfileSchema) as unknown as Resolver<SocioemotionalProfileFormValues>,
    values: data
      ? {
          familyContext: data.familyContext,
          engagementLevel: data.engagementLevel,
          behaviorNotes: data.behaviorNotes,
        }
      : undefined,
    defaultValues: { familyContext: '', engagementLevel: 2, behaviorNotes: '' },
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando perfil socioemocional...</p>
  }

  function handleSubmit(values: SocioemotionalProfileFormValues) {
    mutation.mutate({ ...values, engagementLevel: values.engagementLevel as 1 | 2 | 3 })
  }

  const canSubmit = canManageAll || canManageBehaviorNotes

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!canManageAll && (
          <p className="text-xs text-muted-foreground">
            Você tem acesso somente de leitura a este perfil, exceto às observações de comportamento.
          </p>
        )}

        <fieldset disabled={!canManageAll} className="space-y-4">
          <FormField
            control={form.control}
            name="familyContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contexto familiar / vulnerabilidades</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="engagementLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de engajamento</FormLabel>
                <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ENGAGEMENT_LEVEL_LABELS).map(([value, label]) => (
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
        </fieldset>

        <fieldset disabled={!canManageBehaviorNotes && !canManageAll}>
          <FormField
            control={form.control}
            name="behaviorNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações de comportamento</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {canSubmit && (
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : 'Salvar perfil socioemocional'}
          </Button>
        )}
      </form>
    </Form>
  )
}
