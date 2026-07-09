'use client'

import { SocioemotionalProfileForm } from '@/features/classroom-management/components/socioemotional-profile-form'
import { StudentPicker } from '@/features/classroom-management/components/student-picker'
import {
    canManageBehaviorNotes,
    canManageSocioemotionalProfile,
} from '@/features/classroom-management/utils/classroom-management-permissions'
import type { ClassDetail } from '@/features/classes/types'
import { useCurrentUser } from '@/lib/hooks/use-current-user'
import { useState } from 'react'

interface SocioemotionalProfileTabProps {
  classData: ClassDetail
}

export function SocioemotionalProfileTab({ classData }: SocioemotionalProfileTabProps) {
  const { user } = useCurrentUser()
  const [studentId, setStudentId] = useState('')

  return (
    <div className="space-y-4">
      <StudentPicker classId={classData.id} selectedStudentId={studentId} onSelect={setStudentId} />
      {studentId && (
        <SocioemotionalProfileForm
          studentId={studentId}
          canManageAll={canManageSocioemotionalProfile(user, classData)}
          canManageBehaviorNotes={canManageBehaviorNotes(user, classData)}
        />
      )}
    </div>
  )
}
