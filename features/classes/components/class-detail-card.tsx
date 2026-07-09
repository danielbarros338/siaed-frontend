'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClassStatusBadge } from '@/features/classes/components/class-status-badge'
import type { ClassDetail } from '@/features/classes/types'
import { BookOpen } from 'lucide-react'

interface ClassDetailCardProps {
  data: ClassDetail
}

function formatDateBr(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

function getTeachersLabel(data: { teachers?: Array<{ name: string }> }) {
  if (!Array.isArray(data.teachers) || data.teachers.length === 0) {
    return 'Não associado'
  }

  const names = data.teachers
    .map((teacher) => teacher.name?.trim())
    .filter((name): name is string => Boolean(name))

  return names.length > 0 ? names.join(', ') : 'Não associado'
}

export function ClassDetailCard({ data }: ClassDetailCardProps) {
  const teachersLabel = getTeachersLabel(data)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Turma</p>
              <CardTitle className="mt-0.5">{data.name}</CardTitle>
            </div>
          </div>
          <ClassStatusBadge status={data.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Série" value={data.grade} />
          <Field label="Ano letivo" value={String(data.schoolYear)} />
          <Field label="Professor(es)" value={teachersLabel} />
          <Field label="Cadastrada em" value={formatDateBr(data.createdAt)} />
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
