'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useStudents } from '@/features/students/hooks/use-students'

interface StudentPickerProps {
  classId: string
  selectedStudentId: string
  onSelect: (studentId: string) => void
}

export function StudentPicker({ classId, selectedStudentId, onSelect }: StudentPickerProps) {
  const { data, isLoading } = useStudents({ page: 1, pageSize: 200, classId })
  const students = data?.items ?? []

  return (
    <Select value={selectedStudentId} onValueChange={onSelect} disabled={isLoading}>
      <SelectTrigger aria-label="Selecionar aluno" className="w-full sm:w-72">
        <SelectValue placeholder={isLoading ? 'Carregando alunos...' : 'Selecione um aluno'} />
      </SelectTrigger>
      <SelectContent>
        {students.map((student) => (
          <SelectItem key={student.id} value={student.id}>
            {student.fullName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
