import { PortsPage } from '@/components/portos/PortsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portos & Aeroportos — INDAIA Portal',
  description: 'Monitoramento em tempo real de condições operacionais nos principais portos e aeroportos de carga do Brasil.',
}

export default function PortosPageRoute() {
  return <PortsPage />
}
