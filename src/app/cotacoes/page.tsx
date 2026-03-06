import { LiveRates } from '@/components/cotacao/LiveRates'
import { PtaxTable } from '@/components/cotacao/PtaxTable'
import { PortsMonitor } from '@/components/cotacao/PortsMonitor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cotações & Câmbio — INDAIA Portal',
  description: 'Taxas PTAX em tempo real, tabela mensal BCB e status de portos e aeroportos.',
}

export default function CotacoesPage() {
  return (
    <>
      <div style={{ paddingTop: 0 }}>
        <LiveRates />
        <PtaxTable />
        <PortsMonitor />
      </div>
    </>
  )
}
