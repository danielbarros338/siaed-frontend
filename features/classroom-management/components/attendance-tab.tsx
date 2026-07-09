'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useAttendance } from '@/features/classroom-management/hooks/use-attendance'
import { useUpsertAttendance } from '@/features/classroom-management/hooks/use-upsert-attendance'
import { ATTENDANCE_STATUS_LABELS, type AttendanceEntry, type AttendanceStatus } from '@/features/classroom-management/types'
import { canManageAttendance } from '@/features/classroom-management/utils/classroom-management-permissions'
import type { ClassDetail } from '@/features/classes/types'
import type { StudentListItem } from '@/features/students/types'
import { useStudents } from '@/features/students/hooks/use-students'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useMemo, useState } from 'react'

interface AttendanceTabProps {
  classData: ClassDetail
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function AttendanceTab({ classData }: AttendanceTabProps) {
  const { user } = useCurrentUser()
  const canManage = canManageAttendance(user, classData)

  const [date, setDate] = useState(todayIso)

  const { data: studentsData } = useStudents({ page: 1, pageSize: 200, classId: classData.id })
  const { data: attendanceData, isLoading } = useAttendance({ schoolClassId: classData.id, date })

  const students = useMemo(() => studentsData?.items ?? [], [studentsData?.items])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium" htmlFor="attendance-date">
          Data
        </label>
        <Input
          id="attendance-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-40"
        />
      </div>

      {!canManage && (
        <p className="text-xs text-muted-foreground">
          Você tem acesso somente de leitura à frequência desta turma.
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando frequência...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado nesta turma.</p>
      ) : (
        <AttendanceRoster
          key={date}
          schoolClassId={classData.id}
          date={date}
          students={students}
          initialEntries={attendanceData ?? []}
          canManage={canManage}
        />
      )}
    </div>
  )
}

interface AttendanceRosterProps {
  schoolClassId: string
  date: string
  students: StudentListItem[]
  initialEntries: AttendanceEntry[]
  canManage: boolean
}

function AttendanceRoster({ schoolClassId, date, students, initialEntries, canManage }: AttendanceRosterProps) {
  const mutation = useUpsertAttendance()

  const [rows, setRows] = useState<Record<string, { status: AttendanceStatus; notes: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; notes: string }> = {}
    for (const student of students) {
      const existing = initialEntries.find((entry) => entry.studentId === student.id)
      initial[student.id] = { status: existing?.status ?? 1, notes: existing?.notes ?? '' }
    }
    return initial
  })

  function handleSubmit() {
    mutation.mutate({
      schoolClassId,
      date,
      entries: Object.entries(rows).map(([studentId, row]) => ({
        studentId,
        status: row.status,
        notes: row.notes || null,
      })),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {students.map((student) => {
          const row = rows[student.id] ?? { status: 1 as AttendanceStatus, notes: '' }
          return (
            <div key={student.id} className="flex flex-wrap items-center gap-2 rounded-md border p-2">
              <span className="min-w-40 flex-1 text-sm font-medium">{student.fullName}</span>
              <Select
                value={String(row.status)}
                onValueChange={(value) =>
                  setRows((prev) => ({
                    ...prev,
                    [student.id]: { ...row, status: Number(value) as AttendanceStatus },
                  }))
                }
                disabled={!canManage}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Observação"
                value={row.notes}
                disabled={!canManage}
                onChange={(event) =>
                  setRows((prev) => ({ ...prev, [student.id]: { ...row, notes: event.target.value } }))
                }
                className="w-56"
              />
            </div>
          )
        })}
      </div>

      {canManage && (
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando...' : 'Salvar frequência'}
        </Button>
      )}
    </div>
  )
}
