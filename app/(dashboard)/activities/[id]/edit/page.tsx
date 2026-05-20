import { EditActivityView } from './_components/edit-activity-view'

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditActivityView id={id} />
}

