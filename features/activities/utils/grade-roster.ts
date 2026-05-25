import type { Grade, GradeListRow } from '@/features/activities/types/grades'
import type { StudentListItem } from '@/features/students/types'

export function mergeStudentsWithGrades(students: StudentListItem[], grades: Grade[]): GradeListRow[] {
  const gradeByStudent = new Map(grades.map((grade) => [grade.studentId, grade]))

  return students.map((student) => {
    const grade = gradeByStudent.get(student.id)

    return {
      studentId: student.id,
      studentName: student.fullName,
      classId: student.classId,
      className: student.className,
      gradeId: grade?.id ?? null,
      gradeValue: grade?.gradeValue ?? null,
      conventionKey: grade?.conventionKey ?? null,
      version: grade?.version ?? null,
      hasGrade: !!grade,
    }
  })
}
