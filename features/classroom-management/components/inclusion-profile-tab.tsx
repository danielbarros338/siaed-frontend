'use client'

import { InclusionProfileForm } from '@/features/classroom-management/components/inclusion-profile-form'
import { StudentPicker } from '@/features/classroom-management/components/student-picker'
import { canManageInclusionProfile } from '@/features/classroom-management/utils/classroom-management-permissions'
import type { ClassDetail } from '@/features/classes/types'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useState } from 'react'

interface InclusionProfileTabProps {
  classData: ClassDetail
}

export function InclusionProfileTab({ classData }: InclusionProfileTabProps) {
  const { user } = useCurrentUser()
  const [studentId, setStudentId] = useState('')
  const canManage = canManageInclusionProfile(user, classData)

  return (
    <div className="space-y-4">
      <StudentPicker classId={classData.id} selectedStudentId={studentId} onSelect={setStudentId} />
      {studentId && <InclusionProfileForm studentId={studentId} canManage={canManage} />}
    </div>
  )
}
