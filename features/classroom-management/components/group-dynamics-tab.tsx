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
import { useGroupDynamics } from '@/features/classroom-management/hooks/use-group-dynamics'
import { useUpdateGroupDynamics } from '@/features/classroom-management/hooks/use-update-group-dynamics'
import {
    groupDynamicsSchema,
    type GroupDynamicsFormValues,
} from '@/features/classroom-management/schemas/group-dynamics-schema'
import { WORK_PREFERENCE_LABELS } from '@/features/classroom-management/types'
import { canManageGroupDynamics } from '@/features/classroom-management/utils/classroom-management-permissions'
import type { ClassDetail } from '@/features/classes/types'
import { useStudents } from '@/features/students/hooks/use-students'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

interface GroupDynamicsTabProps {
  classData: ClassDetail
}

export function GroupDynamicsTab({ classData }: GroupDynamicsTabProps) {
  const { user } = useCurrentUser()
  const canManage = canManageGroupDynamics(user, classData)
  const { data, isLoading } = useGroupDynamics(classData.id)
  const { data: studentsData } = useStudents({ page: 1, pageSize: 200, classId: classData.id })
  const mutation = useUpdateGroupDynamics(classData.id)

  const students = studentsData?.items ?? []

  const form = useForm<GroupDynamicsFormValues>({
    resolver: zodResolver(groupDynamicsSchema) as unknown as Resolver<GroupDynamicsFormValues>,
    values: data
      ? {
          identifiedLeaders: data.identifiedLeaders,
          conflictsNotes: data.conflictsNotes,
          workPreference: data.workPreference,
        }
      : undefined,
    defaultValues: { identifiedLeaders: [], conflictsNotes: '', workPreference: 3 },
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando dinâmica de grupo...</p>
  }

  function handleSubmit(values: GroupDynamicsFormValues) {
    mutation.mutate({ ...values, workPreference: values.workPreference as 1 | 2 | 3 })
  }

  return (
    <Form {...form}>
      <fieldset disabled={!canManage} className="space-y-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {!canManage && (
            <p className="text-xs text-muted-foreground">
              Você tem acesso somente de leitura à dinâmica de grupo desta turma.
            </p>
          )}

          <FormField
            control={form.control}
            name="identifiedLeaders"
            render={({ field }) => {
              const selectedIds = field.value.map((leader) => leader.studentId)

              return (
                <FormItem>
                  <FormLabel>Lideranças identificadas</FormLabel>
                  <FormControl>
                    <div className="rounded-md border p-3">
                      {students.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado nesta turma.</p>
                      ) : (
                        <div className="max-h-48 space-y-2 overflow-y-auto">
                          {students.map((student) => {
                            const isChecked = selectedIds.includes(student.id)
                            return (
                              <label key={student.id} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={!canManage}
                                  onChange={(event) => {
                                    if (event.target.checked) {
                                      field.onChange([
                                        ...field.value,
                                        { studentId: student.id, studentName: student.fullName },
                                      ])
                                      return
                                    }
                                    field.onChange(field.value.filter((leader) => leader.studentId !== student.id))
                                  }}
                                />
                                {student.fullName}
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="conflictsNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conflitos ou casos de bullying mapeados</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferência de trabalho</FormLabel>
                <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(WORK_PREFERENCE_LABELS).map(([value, label]) => (
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

          {canManage && (
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar dinâmica de grupo'}
            </Button>
          )}
        </form>
      </fieldset>
    </Form>
  )
}
