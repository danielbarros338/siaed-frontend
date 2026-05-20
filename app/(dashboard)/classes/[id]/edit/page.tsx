import { EditClassView } from './_components/edit-class-view'

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditClassView id={id} />
}
