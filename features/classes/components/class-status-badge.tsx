import { Badge } from '@/components/ui/badge'
import { CLASS_STATUS_LABELS, type ClassStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_CLASSES: Record<ClassStatus, string> = {
  1: 'bg-amber-50 text-amber-700 border-amber-300',
  2: 'bg-muted text-muted-foreground border-transparent',
}

interface ClassStatusBadgeProps {
  status: ClassStatus
}

export function ClassStatusBadge({ status }: ClassStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-semibold', STATUS_CLASSES[status])}
      aria-label={`Status ${CLASS_STATUS_LABELS[status]}`}
    >
      {CLASS_STATUS_LABELS[status]}
    </Badge>
  )
}
