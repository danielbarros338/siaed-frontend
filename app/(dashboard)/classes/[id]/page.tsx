import { ClassDetailView } from './_components/class-detail-view'

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ClassDetailView id={id} />
}
