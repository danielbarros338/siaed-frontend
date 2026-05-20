import { EditLessonPlanView } from './_components/edit-lesson-plan-view'

export default async function EditLessonPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditLessonPlanView id={id} />
}
