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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useClassesForSelect } from '@/features/students/hooks/use-classes-for-select'
import { createStudentSchema, type CreateStudentFormValues } from '@/features/students/schemas/create-student-schema'
import { editStudentSchema, type EditStudentFormValues } from '@/features/students/schemas/edit-student-schema'
import { applyCpfMask, removeMask } from '@/features/students/utils/format'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'

type CreateMode = {
  mode: 'create'
  defaultValues?: Partial<CreateStudentFormValues>
  onSubmit: (data: CreateStudentFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type EditMode = {
  mode: 'edit'
  defaultValues?: Partial<EditStudentFormValues>
  onSubmit: (data: EditStudentFormValues) => void
  isSubmitting: boolean
  apiError?: string | null
}

type StudentFormProps = CreateMode | EditMode

// We type the form as the superset (CreateStudentFormValues) and use the
// appropriate Zod schema based on mode.
export function StudentForm(props: StudentFormProps) {
  const { mode, isSubmitting, apiError } = props

  const schema = mode === 'create' ? createStudentSchema : editStudentSchema

  const form = useForm<CreateStudentFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<CreateStudentFormValues>,
    defaultValues: (props.defaultValues ?? {}) as Partial<CreateStudentFormValues>,
  })

  const { data: classesData } = useClassesForSelect()

  const documentType = useWatch({
    control: form.control,
    name: 'documentType',
  })

  useEffect(() => {
    form.setValue('documentId', '')
  }, [documentType, form])

  const handleDocumentIdChange = (value: string, onChange: (v: string) => void) => {
    if (documentType === 1) {
      onChange(applyCpfMask(value))
    } else {
      onChange(value)
    }
  }

  const handleSubmit = (data: CreateStudentFormValues) => {
    const cleaned = { ...data, documentId: removeMask(data.documentId) }
    if (mode === 'create') {
      ;(props as CreateMode).onSubmit(cleaned)
    } else {
      const { enrollmentDate: _omit, ...editData } = cleaned
      ;(props as EditMode).onSubmit(editData as EditStudentFormValues)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {apiError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do aluno" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value != null ? String(field.value) : ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">CPF</SelectItem>
                    <SelectItem value="2">Registro Estrangeiro</SelectItem>
                    <SelectItem value="3">ID Interno</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do documento</FormLabel>
                <FormControl>
                  <Input
                    placeholder={documentType === 1 ? '000.000.000-00' : 'Número do documento'}
                    {...field}
                    onChange={(e) => handleDocumentIdChange(e.target.value, field.onChange)}
                    maxLength={documentType === 1 ? 14 : 30}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === 'create' && (
            <FormField
              control={form.control}
              name="enrollmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de matrícula</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {(mode === 'create' || mode === 'edit') && (
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turma</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classesData?.items.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações opcionais sobre o aluno..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Salvando...'
            : mode === 'create'
              ? 'Cadastrar aluno'
              : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  )
}
