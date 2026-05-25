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
import {
    gradeEntrySchema,
    type GradeEntryFormValues,
} from '@/features/activities/schemas/grade-entry-schema'
import { CONVENTION_OPTIONS } from '@/features/activities/utils/grade-convention'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface GradeEntryFormProps {
  studentId: string
  defaultGradeValue?: string
  defaultConventionKey: string
  disableConventionChange?: boolean
  disabled?: boolean
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: GradeEntryFormValues) => void
}

export function GradeEntryForm({
  studentId,
  defaultGradeValue,
  defaultConventionKey,
  disableConventionChange = false,
  disabled = false,
  submitLabel,
  isSubmitting,
  onSubmit,
}: GradeEntryFormProps) {
  const form = useForm<GradeEntryFormValues>({
    resolver: zodResolver(gradeEntrySchema),
    defaultValues: {
      studentId,
      gradeValue: defaultGradeValue ?? '',
      conventionKey: defaultConventionKey,
      version: undefined,
    },
  })

  useEffect(() => {
    form.reset({
      studentId,
      gradeValue: defaultGradeValue ?? '',
      conventionKey: defaultConventionKey,
      version: undefined,
    })
  }, [studentId, defaultGradeValue, defaultConventionKey, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2 sm:grid-cols-[88px_170px_96px] sm:items-start"
      >
        <FormField
          control={form.control}
          name="gradeValue"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="sr-only">Nota</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nota"
                  disabled={disabled || isSubmitting}
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conventionKey"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="sr-only">Convencao</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled || isSubmitting || disableConventionChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Convencao" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONVENTION_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          disabled={disabled || isSubmitting}
          className="w-full sm:h-9 sm:w-full sm:self-start"
        >
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
