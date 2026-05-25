import { ActivityGradesView } from './_components/activity-grades-view'

export default async function ActivityGradesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ActivityGradesView id={id} />
}
