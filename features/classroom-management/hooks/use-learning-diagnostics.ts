'use client'

import type { LearningDiagnosticsListParams } from '@/features/classroom-management/types'
import { classroomManagementApi } from '@/lib/api/classroom-management'
import { queryKeys } from '@/lib/hooks/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useLearningDiagnostics(params: LearningDiagnosticsListParams) {
  return useQuery({
    queryKey: queryKeys.classroomManagement.learningDiagnostics.list(params),
    queryFn: () => classroomManagementApi.listLearningDiagnostics(params),
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  })
}
