import type { Metadata } from 'next'
import { QuoteForm } from '@/components/home/QuoteForm'

export const metadata: Metadata = {
  title: 'Contato & Cotação — INDAIA Portal',
}

export default function ContatoPage() {
  return (
    <div>
      <div style={{ background: 'var(--brand-deep)', padding: '64px 48px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brand-sky)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--brand-sky)' }} />
            Contato
          </div>
          <h1 style={{ fontSize: 'clamp(36px,4vw,60px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Vamos conversar<br />sobre seu <span style={{ color: 'var(--brand-sky)' }}>COMEX</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginTop: 16, maxWidth: 480, lineHeight: 1.8 }}>
            Nossa equipe retorna em até 4h úteis com uma análise técnica gratuita da sua operação.
          </p>
        </div>
      </div>
      <QuoteForm />
    </div>
  )
}
