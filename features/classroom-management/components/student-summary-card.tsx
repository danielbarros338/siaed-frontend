'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInclusionProfile } from '@/features/classroom-management/hooks/use-inclusion-profile'
import { useLearningDiagnostics } from '@/features/classroom-management/hooks/use-learning-diagnostics'
import { useSocioemotionalProfile } from '@/features/classroom-management/hooks/use-socioemotional-profile'
import { ENGAGEMENT_LEVEL_LABELS, PROFICIENCY_LEVEL_LABELS } from '@/features/classroom-management/types'
import Link from 'next/link'

interface StudentSummaryCardProps {
  studentId: string
  classId: string
}

export function StudentSummaryCard({ studentId, classId }: StudentSummaryCardProps) {
  const { data: diagnosticsData } = useLearningDiagnostics({ studentId })
  const { data: inclusionProfile } = useInclusionProfile(studentId)
  const { data: socioemotionalProfile } = useSocioemotionalProfile(studentId)

  const latestDiagnostic = diagnosticsData?.items[diagnosticsData.items.length - 1]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Gestão de Turma</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Último diagnóstico: </span>
          {latestDiagnostic ? PROFICIENCY_LEVEL_LABELS[latestDiagnostic.proficiencyLevel] : 'Sem registro'}
        </p>
        <p>
          <span className="font-medium">Inclusão / PEI: </span>
          {inclusionProfile?.hasSpecialNeeds
            ? `Necessidade especial identificada${inclusionProfile.needsAEE ? ' (AEE)' : ''}`
            : 'Sem necessidade especial registrada'}
        </p>
        <p>
          <span className="font-medium">Engajamento socioemocional: </span>
          {socioemotionalProfile ? ENGAGEMENT_LEVEL_LABELS[socioemotionalProfile.engagementLevel] : 'Sem registro'}
        </p>
        <Link href={`/classes/${classId}`} className="inline-block text-sm underline underline-offset-4 hover:text-primary">
          Ver detalhes na turma
        </Link>
      </CardContent>
    </Card>
  )
}
