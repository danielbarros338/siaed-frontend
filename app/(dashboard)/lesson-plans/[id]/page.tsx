import { LessonPlanDetailView } from './_components/lesson-plan-detail-view'

export default async function LessonPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <LessonPlanDetailView id={id} />
}
