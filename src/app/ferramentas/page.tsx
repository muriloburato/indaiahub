import { FerramentasClient } from '@/components/ferramentas/FerramentasClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ferramentas COMEX — INDAIA Portal',
  description: 'Simulador de DI, Comparador de Incoterms, Checklist Documental e Consulta NCM.',
}

export default function FerramentasPage() {
  return <FerramentasClient />
}
