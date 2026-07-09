import { EditTeachingPlanView } from './_components/edit-teaching-plan-view'

export default async function EditTeachingPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditTeachingPlanView id={id} />
}
