import { Skeleton } from '@/components/ui/skeleton'

export default function ActivityDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-80" />
      <Skeleton className="h-80 w-full" />
    </div>
  )
}

