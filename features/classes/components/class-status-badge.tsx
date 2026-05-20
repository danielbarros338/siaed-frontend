import { Badge } from '@/components/ui/badge'
import { CLASS_STATUS_LABELS, type ClassStatus } from '@/lib/types'

interface ClassStatusBadgeProps {
  status: ClassStatus
}

export function ClassStatusBadge({ status }: ClassStatusBadgeProps) {
  return (
    <Badge variant={status === 1 ? 'default' : 'secondary'} aria-label={`Status ${CLASS_STATUS_LABELS[status]}`}>
      {CLASS_STATUS_LABELS[status]}
    </Badge>
  )
}
