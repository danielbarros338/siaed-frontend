import { ReportDetailView } from './_components/report-detail-view'

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ReportDetailView id={id} />
}
