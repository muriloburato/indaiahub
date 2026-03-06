'use client'
// ═══════════════════════════════════════════════════
// StatsBand · Services · NewsSection · QuoteForm · ClientLogos
// ═══════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { STATS, SERVICES, NEWS, CLIENT_LOGOS } from '@/lib/constants'

/* ─────────────────────────────────────────────────
   Shared responsive CSS — injetado uma vez.
   Usa var(--page-px) definida em globals.css como
   única fonte de verdade para padding horizontal.
───────────────────────────────────────────────── */
const SHARED_CSS = `
  /* Todos os filhos de grid nunca transbordam */
  .stats-grid  > *,
  .services-grid > *,
  .news-grid   > *,
  .quote-grid  > *,
  .logos-grid  > * { min-width: 0; }

  /* ── StatsBand ── */
  .stats-band {
    background: var(--brand-deep);
    padding: clamp(28px,5vw,52px) var(--page-px);
    border-top:    1px solid rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    width: 100%;
    box-sizing: border-box;
  }
  .stats-grid {
    max-width: 1160px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4,1fr);
  }
  .stat-item {
    padding: 0 clamp(10px,2vw,36px);
    border-right: 1px solid rgba(255,255,255,0.08);
  }
  .stat-item:first-child { padding-left: 0; }
  .stat-item:last-child  { border-right: none; padding-right: 0; }

  @media (max-width: 860px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .stat-item {
      padding: 22px 16px;
      border-right:  1px solid rgba(255,255,255,0.08);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .stat-item:first-child        { padding-left: 16px; }
    .stat-item:last-child         { padding-right: 16px; }
    .stat-item:nth-child(2n)      { border-right: none; }
    .stat-item:nth-last-child(-n+2) { border-bottom: none; }
  }
  @media (max-width: 480px) {
    .stat-item { padding: 16px 12px; }
  }

  /* ── Services ── */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 16px;
    margin-top: 48px;
  }
  .service-card {
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: clamp(18px,2.5vw,32px) clamp(16px,2vw,28px);
    background: var(--bg-card);
    transition: all 0.3s;
    cursor: default;
    overflow: hidden;
  }
  @media (max-width: 860px) {
    .services-grid { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 520px) {
    .services-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 28px; }
  }

  /* ── News ── */
  .news-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 20px;
    margin-top: 48px;
  }
  @media (max-width: 960px) {
    .news-grid { grid-template-columns: 1fr 1fr; }
    .news-grid > *:first-child { grid-column: 1 / -1; }
  }
  @media (max-width: 520px) {
    .news-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 28px; }
    .news-grid > *:first-child { grid-column: auto; }
  }

  /* ── Quote ── */
  .quote-grid {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: clamp(24px,3.5vw,56px);
    align-items: start;
  }
  .form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 960px) {
    .quote-grid  { grid-template-columns: 1fr; gap: 32px; }
    .quote-right { order: -1; }
  }
  @media (max-width: 480px) {
    .form-row-2        { grid-template-columns: 1fr; }
    .quote-submit-btn  { width: 100%; }
  }

  /* ── Logos ── */
  .logos-grid {
    display: grid;
    grid-template-columns: repeat(5,1fr);
    gap: 12px;
  }
  .logo-item {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: clamp(12px,1.8vw,20px) clamp(8px,1.2vw,14px);
    display: flex; align-items: center; justify-content: center;
    font-size: clamp(9px,1vw,13px);
    font-weight: 700; color: var(--text-3);
    letter-spacing: 0.04em; text-transform: uppercase;
    transition: all 0.2s; cursor: default;
    text-align: center; word-break: break-word;
  }
  @media (max-width: 1060px) {
    .logos-grid { grid-template-columns: repeat(4,1fr); }
  }
  @media (max-width: 720px) {
    .logos-grid { grid-template-columns: repeat(3,1fr); gap: 8px; }
  }
  @media (max-width: 440px) {
    .logos-grid { grid-template-columns: repeat(2,1fr); }
  }
`

function SharedStyles() {
  return <style>{SHARED_CSS}</style>
}

/* ── useCountUp ── */
function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = () => {
      start += 1000 / 60
      const p = Math.min(start / 1400, 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, active])
  return count
}

/* ── StatItem ── */
function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUp(value, active)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="stat-item">
      <div style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'white', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <span>{count}</span>
        <span style={{ fontSize: 'clamp(13px,1.6vw,22px)', marginTop: 8, color: 'var(--brand-sky)', fontWeight: 700 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 'clamp(11px,1.1vw,13px)', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{label}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// StatsBand
// ═══════════════════════════════════════════════════
export function StatsBand() {
  return (
    <div className="stats-band">
      <SharedStyles />
      <div className="stats-grid">
        {STATS.map(s => <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />)}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
// Services
// ═══════════════════════════════════════════════════
export function Services() {
  return (
    <section className="sec sec-services" id="servicos" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="sec-eye">Serviços</div>
        <h2 className="sec-h">Tudo que seu COMEX<br /><span>precisa em um só lugar</span></h2>
        <p className="sec-p">Do habilitação RADAR ao desembaraço final, equipes especializadas por segmento e NCM.</p>

        <div className="services-grid">
          {SERVICES.map(svc => (
            <div
              key={svc.name}
              className="service-card"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--brand-pale)'
                el.style.boxShadow = 'var(--shd)'
                el.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow = 'none'
                el.style.transform = 'none'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-frost)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, flexShrink: 0, color: 'var(--brand-core)' }}
                dangerouslySetInnerHTML={{ __html: svc.icon }}
              />
              <div style={{ fontSize: 'clamp(13px,1.3vw,16px)', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{svc.name}</div>
              <p style={{ fontSize: 'clamp(12.5px,1.1vw,13.5px)', color: 'var(--text-3)', lineHeight: 1.7 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// NewsSection
// ═══════════════════════════════════════════════════
const NEWS_THEME: Record<string, string> = {
  blue:   'linear-gradient(135deg, var(--brand-frost), #C5D5F5)',
  green:  'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
  yellow: 'linear-gradient(135deg, #FFF8E1, #FFE0B2)',
}

const NEWS_ICONS: Record<string, React.ReactNode> = {
  alert: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1565C0' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  chart: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#059669' }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  doc:   <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#B45309' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
}

const NEWS_CAT_ICONS: Record<string, React.ReactNode> = {
  alert: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>,
  chart: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  doc:   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
}

export function NewsSection() {
  return (
    <section className="sec" style={{ background: 'var(--bg)' }} id="noticias">
      <div className="wrap">
        <div className="sec-eye">INDAIA News</div>
        <h2 className="sec-h">Fique por dentro das<br /><span>novidades do COMEX</span></h2>
        <p className="sec-p">Alertas regulatórios, análises executivas e as principais movimentações da semana.</p>

        <div className="news-grid">
          {NEWS.map((n, i) => (
            <div
              key={n.id}
              style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--shd)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'none'; el.style.boxShadow = 'none' }}
            >
              <div style={{
                padding: i === 0 ? 'clamp(24px,3.5vw,48px)' : 'clamp(18px,2.5vw,36px)',
                background: NEWS_THEME[n.theme] ?? NEWS_THEME.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: i === 0 ? 100 : 80,
              }}>
                <div style={{ transform: `scale(${i === 0 ? 1.6 : 1.2})` }}>
                  {NEWS_ICONS[n.icon] ?? NEWS_ICONS.doc}
                </div>
              </div>
              <div style={{ padding: 'clamp(14px,1.8vw,20px) clamp(14px,1.8vw,22px)', background: 'var(--bg-card)' }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-core)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {NEWS_CAT_ICONS[n.icon]}{n.category}
                </span>
                <div style={{ fontSize: i === 0 ? 'clamp(14px,1.5vw,18px)' : 'clamp(13px,1.3vw,15px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.45, marginBottom: 8 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{n.date} · {n.readTime}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <Link href="/noticias" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--brand-core)', textDecoration: 'none', border: '1.5px solid var(--brand-pale)', padding: '11px 26px', borderRadius: 10, transition: 'all 0.2s' }}>
            Ver todas as notícias →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// QuoteForm
// ═══════════════════════════════════════════════════
const SvgImport = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const SvgExport = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L11 8 2.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 7.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
)
const SvgSpin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ animation: 'spin 0.75s linear infinite', display: 'block' }}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
  </svg>
)
const SvgOk = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
)

export function QuoteForm() {
  const [tab,    setTab]    = useState<'imp' | 'exp'>('imp')
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    const fd = new FormData(e.currentTarget)
    try {
      const res  = await fetch('/api/cotacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:     fd.get('nome'),     empresa:  fd.get('empresa'),
          email:    fd.get('email'),    telefone: fd.get('telefone'),
          ncm:      fd.get('ncm'),      tipo:     tab,
          mensagem: fd.get('mensagem'),
        }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error ?? 'Erro ao enviar')
      setStatus('sent')
      formRef.current?.reset()
      setTimeout(() => setStatus('idle'), 8000)
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 6000)
    }
  }

  return (
    <section className="sec" style={{ background: 'var(--bg-alt)' }} id="cotacao-form">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="wrap">
        <div className="quote-grid">

          {/* Left: form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(20px,3vw,36px)', boxShadow: 'var(--sh)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--brand-core), var(--brand-sky))' }} />

            <div style={{ fontSize: 'clamp(17px,1.8vw,22px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text)' }}>
              Solicitar Cotação
            </div>

            {/* Tab selector — SVGs, sem emojis */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {(['imp', 'exp'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '9px 6px', borderRadius: 9,
                  border: `1.5px solid ${tab === t ? 'var(--brand-core)' : 'var(--border)'}`,
                  background: tab === t ? 'var(--brand-frost)' : 'var(--bg-card)',
                  color: tab === t ? 'var(--brand-core)' : 'var(--text-3)',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}>
                  {t === 'imp' ? <SvgImport /> : <SvgExport />}
                  {t === 'imp' ? 'Importação' : 'Exportação'}
                </button>
              ))}
            </div>

            <form ref={formRef} onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-row-2">
                <div className="fg"><label>Nome</label><input name="nome" type="text" placeholder="Seu nome" required /></div>
                <div className="fg"><label>Empresa</label><input name="empresa" type="text" placeholder="Empresa" required /></div>
              </div>
              <div className="form-row-2">
                <div className="fg"><label>E-mail</label><input name="email" type="email" placeholder="email@empresa.com" required /></div>
                <div className="fg"><label>Telefone</label><input name="telefone" type="tel" placeholder="+55 (13) 9..." /></div>
              </div>
              <div className="fg">
                <label>NCM / Produto</label>
                <input name="ncm" type="text" placeholder="ex: 8471.30.19 — Notebook" />
              </div>
              <div className="fg">
                <label>Mensagem</label>
                <textarea name="mensagem" placeholder="Descreva sua operação..." rows={3} />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <span style={{ fontSize: 12, color: '#EF4444', flex: 1 }}>{errMsg || 'Erro ao enviar. Tente novamente.'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="quote-submit-btn"
                style={{
                  padding: '13px 28px', borderRadius: 10,
                  background: status === 'sent' ? '#059669' : status === 'error' ? '#DC2626' : 'var(--brand-core)',
                  border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700,
                  color: 'white', cursor: status === 'sending' ? 'wait' : 'pointer',
                  boxShadow: '0 4px 16px rgba(21,101,192,0.3)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                {status === 'sending' && <SvgSpin />}
                {status === 'sent'    && <SvgOk />}
                {status === 'idle'    && 'Enviar Solicitação'}
                {status === 'sending' && 'Enviando…'}
                {status === 'sent'    && 'Enviado com sucesso!'}
                {status === 'error'   && 'Tentar novamente'}
              </button>
            </form>
          </div>

          {/* Right: benefits */}
          <div className="quote-right">
            <div className="sec-eye">Por que a INDAIA?</div>
            <h2 className="sec-h">Retorno em <span>até 4h úteis</span></h2>
            <p className="sec-p">Nossa equipe especializada analisa sua operação e retorna com uma proposta detalhada.</p>

            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column' }}>
              {[
                { n: '01', title: 'Análise técnica gratuita',      desc: 'Classificação NCM, alíquotas e viabilidade operacional sem custo.' },
                { n: '02', title: 'Time especializado por segmento', desc: 'Equipes dedicadas a cada setor: tecnologia, alimentos, químicos, têxteis.' },
                { n: '03', title: 'Transparência total no processo', desc: 'Acompanhamento em tempo real via MyINDAIA e Power BI.' },
                { n: '04', title: '58 anos de experiência',          desc: 'Histórico comprovado com mais de 340 clientes ativos e 18K processos/ano.' },
              ].map(b => (
                <div key={b.n} style={{ display: 'flex', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 800, color: 'var(--brand-pale)', fontFamily: 'DM Mono', lineHeight: 1, flexShrink: 0, marginTop: 2, minWidth: 36 }}>
                    {b.n}
                  </div>
                  <div>
                    <div style={{ fontSize: 'clamp(13.5px,1.3vw,15px)', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{b.title}</div>
                    <div style={{ fontSize: 'clamp(12px,1.1vw,13.5px)', color: 'var(--text-3)', lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════
// ClientLogos — re-exported from dedicated component
// ═══════════════════════════════════════════════════
// (implemented in ClientLogos.tsx as infinite carousel)
export { ClientLogos } from '@/components/home/ClientLogos'
