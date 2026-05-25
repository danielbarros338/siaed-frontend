'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ActivityGradesTable } from '@/features/activities/components/activity-grades-table'
import { useCreateGrade } from '@/features/activities/hooks/use-create-grade'
import { useDeleteGrade } from '@/features/activities/hooks/use-delete-grade'
import { useGradesList } from '@/features/activities/hooks/use-grades-list'
import { useUpdateGrade } from '@/features/activities/hooks/use-update-grade'
import type { GradeEntryFormValues } from '@/features/activities/schemas/grade-entry-schema'
import type { GradeListRow } from '@/features/activities/types/grades'
import {
    CONVENTION_OPTIONS,
    isConventionLockedByGrades,
    normalizeConventionKey,
} from '@/features/activities/utils/grade-convention'
import { mergeStudentsWithGrades } from '@/features/activities/utils/grade-roster'
import { useClasses } from '@/features/classes/hooks/use-classes'
import { useStudents } from '@/features/students/hooks/use-students'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useMemo, useState } from 'react'

interface ActivityGradesSectionProps {
  activityId: string
}

export function ActivityGradesSection({ activityId }: ActivityGradesSectionProps) {
  const { user } = useCurrentUser()
  const canManage = user?.role === 1 || user?.role === 3

  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [gradeValueFilter, setGradeValueFilter] = useState('')
  const [conventionKey, setConventionKey] = useState('RANGE_0_10')

  const classesQuery = useClasses({ page: 1, pageSize: 100 })
  const studentsQuery = useStudents({
    page: 1,
    pageSize: 200,
    classId: selectedClassId || null,
  })

  const gradesQuery = useGradesList({
    page,
    pageSize,
    activityId,
    schoolClassId: selectedClassId || undefined,
    teacherId: user?.userId,
    gradeValue: gradeValueFilter.trim() || undefined,
  })

  const createGradeMutation = useCreateGrade()
  const updateGradeMutation = useUpdateGrade()
  const deleteGradeMutation = useDeleteGrade()

  const gradeItems = useMemo(() => gradesQuery.data?.items ?? [], [gradesQuery.data?.items])
  const conventionLocked = isConventionLockedByGrades(gradeItems.length)

  const effectiveConventionKey = useMemo(() => {
    if (conventionLocked) {
      return gradeItems[0]?.conventionKey ?? conventionKey
    }
    return conventionKey
  }, [conventionLocked, gradeItems, conventionKey])

  const rows = useMemo(() => {
    const students = studentsQuery.data?.items ?? []
    return mergeStudentsWithGrades(students, gradeItems)
  }, [studentsQuery.data?.items, gradeItems])

  const isMutating =
    createGradeMutation.isPending || updateGradeMutation.isPending || deleteGradeMutation.isPending

  const handleCreate = (row: GradeListRow, values: GradeEntryFormValues) => {
    if (!selectedClassId || !user?.userId) {
      return
    }

    createGradeMutation.mutate({
      activityId,
      studentId: row.studentId,
      schoolClassId: selectedClassId,
      teacherId: user.userId,
      gradeValue: values.gradeValue,
      conventionKey: normalizeConventionKey(effectiveConventionKey),
    })
  }

  const handleUpdate = (row: GradeListRow, values: GradeEntryFormValues) => {
    if (!row.gradeId || !row.version) {
      return
    }

    updateGradeMutation.mutate({
      id: row.gradeId,
      dto: {
        gradeValue: values.gradeValue,
        conventionKey: normalizeConventionKey(effectiveConventionKey),
        version: row.version,
      },
    })
  }

  const handleDelete = (row: GradeListRow) => {
    if (!row.gradeId) {
      return
    }

    deleteGradeMutation.mutate(row.gradeId)
  }

  return (
    <Card id="sessao-notas">
      <CardHeader>
        <CardTitle>Sessao de notas da atividade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canManage ? (
          <p className="text-sm text-muted-foreground">
            Voce possui acesso somente de consulta para esta sessao.
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Select
            value={selectedClassId}
            onValueChange={(value) => {
              setSelectedClassId(value)
              setPage(1)
            }}
          >
            <SelectTrigger aria-label="Selecionar turma para notas">
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              {(classesQuery.data?.items ?? []).map((schoolClass) => (
                <SelectItem key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name} - {schoolClass.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={effectiveConventionKey}
            onValueChange={(value) => {
              if (conventionLocked) {
                return
              }
              setConventionKey(value)
            }}
            disabled={conventionLocked}
          >
            <SelectTrigger aria-label="Selecionar convencao de notas">
              <SelectValue placeholder="Selecione a convencao" />
            </SelectTrigger>
            <SelectContent>
              {CONVENTION_OPTIONS.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedClassId ? (
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            Selecione uma turma para carregar os alunos e registrar notas.
          </div>
        ) : (
          <ActivityGradesTable
            rows={rows}
            isLoading={gradesQuery.isLoading || studentsQuery.isLoading || classesQuery.isLoading}
            canManage={canManage}
            isMutating={isMutating}
            gradeValueFilter={gradeValueFilter}
            onGradeValueFilterChange={(value) => {
              setPage(1)
              setGradeValueFilter(value)
            }}
            conventionKey={effectiveConventionKey}
            conventionLocked={conventionLocked}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            page={gradesQuery.data?.page ?? page}
            pageSize={gradesQuery.data?.pageSize ?? pageSize}
            hasNextPage={gradesQuery.data?.hasNextPage ?? false}
            hasPreviousPage={gradesQuery.data?.hasPreviousPage ?? false}
            onPageChange={setPage}
            onPageSizeChange={(value) => {
              setPage(1)
              setPageSize(value)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
