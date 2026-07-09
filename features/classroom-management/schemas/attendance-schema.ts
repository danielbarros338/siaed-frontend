import { z } from 'zod'

export const attendanceEntrySchema = z.object({
  studentId: z.string().uuid(),
  status: z.coerce.number().int().min(1).max(3),
  notes: z.string().max(500, 'Observação deve ter no máximo 500 caracteres').optional().nullable(),
})

export const attendanceSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  entries: z.array(attendanceEntrySchema),
})

export type AttendanceFormValues = z.infer<typeof attendanceSchema>
