import type { Metadata } from 'next'
import { PedagogicoView } from './_components/pedagogico-view'

export const metadata: Metadata = { title: 'Pedagógico | SIAED' }

export default function PedagogicoPage() {
  return <PedagogicoView />
}
