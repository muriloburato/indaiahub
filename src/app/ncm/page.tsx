import { NcmPage } from '@/components/ferramentas/NcmPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulta NCM — INDAIA Portal',
  description: 'Pesquise códigos NCM com alíquotas de II, IPI, PIS e COFINS. Dados oficiais do Portal Único Siscomex e TEC/CAMEX.',
}

export default function NCMPage() {
  return <NcmPage />
}
