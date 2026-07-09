import { TeachingPlanDetailView } from './_components/teaching-plan-detail-view'

export default async function TeachingPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TeachingPlanDetailView id={id} />
}
