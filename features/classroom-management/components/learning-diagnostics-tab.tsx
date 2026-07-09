'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { StudentPicker } from '@/features/classroom-management/components/student-picker'
import { useCreateLearningDiagnostic } from '@/features/classroom-management/hooks/use-create-learning-diagnostic'
import { useLearningDiagnostics } from '@/features/classroom-management/hooks/use-learning-diagnostics'
import {
    learningDiagnosticSchema,
    type LearningDiagnosticFormValues,
} from '@/features/classroom-management/schemas/learning-diagnostic-schema'
import { PROFICIENCY_LEVEL_LABELS, type ProficiencyLevel } from '@/features/classroom-management/types'
import { canManageLearningDiagnostic } from '@/features/classroom-management/utils/classroom-management-permissions'
import type { ClassDetail } from '@/features/classes/types'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'

interface LearningDiagnosticsTabProps {
  classData: ClassDetail
}

function formatDateBr(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function LearningDiagnosticsTab({ classData }: LearningDiagnosticsTabProps) {
  const { user } = useCurrentUser()
  const canManage = canManageLearningDiagnostic(user, classData)

  const form = useForm<LearningDiagnosticFormValues>({
    resolver: zodResolver(learningDiagnosticSchema) as unknown as Resolver<LearningDiagnosticFormValues>,
    defaultValues: { studentId: '', subject: '', proficiencyLevel: 2, identifiedGaps: '', assessmentDate: '', notes: '' },
  })

  const studentId = form.watch('studentId')
  const { data, isLoading } = useLearningDiagnostics({ studentId: studentId || undefined, schoolClassId: classData.id })
  const mutation = useCreateLearningDiagnostic({
    onSuccess: () => {
      form.reset({ ...form.getValues(), subject: '', identifiedGaps: '', assessmentDate: '', notes: '' })
    },
  })

  function handleSubmit(values: LearningDiagnosticFormValues) {
    mutation.mutate({
      studentId: values.studentId,
      schoolClassId: classData.id,
      subject: values.subject,
      proficiencyLevel: values.proficiencyLevel as ProficiencyLevel,
      identifiedGaps: values.identifiedGaps,
      assessmentDate: values.assessmentDate,
      notes: values.notes,
    })
  }

  return (
    <div className="space-y-4">
      <StudentPicker
        classId={classData.id}
        selectedStudentId={studentId}
        onSelect={(id) => form.setValue('studentId', id)}
      />

      {studentId && (
        <>
          <Card>
            <CardContent className="space-y-2 pt-6">
              <h3 className="text-sm font-semibold">Diagnósticos registrados</h3>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : (data?.items.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum diagnóstico registrado para este aluno.</p>
              ) : (
                <ul className="space-y-3">
                  {data?.items.map((diagnostic) => (
                    <li key={diagnostic.id} className="rounded-md border p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{diagnostic.subject}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateBr(diagnostic.assessmentDate)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {PROFICIENCY_LEVEL_LABELS[diagnostic.proficiencyLevel]}
                      </p>
                      {diagnostic.identifiedGaps && <p className="mt-2">{diagnostic.identifiedGaps}</p>}
                      {diagnostic.notes && (
                        <p className="mt-1 text-muted-foreground whitespace-pre-line">{diagnostic.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {canManage && (
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disciplina/Área</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex.: Matemática" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="proficiencyLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nível de proficiência</FormLabel>
                            <Select
                              value={String(field.value)}
                              onValueChange={(value) => field.onChange(Number(value))}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(PROFICIENCY_LEVEL_LABELS).map(([value, label]) => (
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
                    </div>

                    <FormField
                      control={form.control}
                      name="assessmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da avaliação</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="identifiedGaps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lacunas identificadas</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea rows={2} {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Salvando...' : 'Registrar diagnóstico'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
