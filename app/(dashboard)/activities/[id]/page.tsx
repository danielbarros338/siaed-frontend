import { ActivityDetailView } from './_components/activity-detail-view'

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ActivityDetailView id={id} />
}

