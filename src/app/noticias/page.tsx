import { NEWS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notícias COMEX — INDAIA Portal',
}

const NEWS_THEME: Record<string, string> = {
  blue:   'linear-gradient(135deg, var(--brand-frost), #C5D5F5)',
  green:  'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
  yellow: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)',
}

export default function NoticiasPage() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-eye">INDAIA News</div>
        <h1 className="sec-h">Notícias & Alertas<br /><span>de Comércio Exterior</span></h1>
        <p className="sec-p">Alertas regulatórios, análises e movimentações do mercado COMEX.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 52 }}>
          {[...NEWS, ...NEWS].map((n, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', background: 'var(--bg-card)' }}>
              <div style={{ padding: 36, background: NEWS_THEME[n.theme], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>
                {n.icon}
              </div>
              <div style={{ padding: '20px 22px' }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-core)', marginBottom: 8, display: 'block' }}>{n.category}</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.45, marginBottom: 8 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{n.date} · {n.readTime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
