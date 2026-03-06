'use client'

import { useState, useRef, useEffect } from 'react'

// Animates strokeDashoffset via rAF — no CSS keyframe reset, no visual cut
function SpinBorder({ active }: { active: boolean }) {
  const rectRef = useRef<SVGRectElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef<number>()
  const lastRef = useRef<number>()

  useEffect(() => {
    const SPEED = 333 // px per second in pathLength units (pathLength=1000, 3s full loop)

    function tick(now: number) {
      if (lastRef.current === undefined) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now

      if (active) {
        offsetRef.current -= SPEED * dt
        // keep in [-1000, 0] range — modulo without jump
        if (offsetRef.current < -1000) offsetRef.current += 1000
        if (rectRef.current) {
          rectRef.current.style.strokeDashoffset = String(offsetRef.current)
        }
      } else {
        lastRef.current = undefined
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active])

  return (
    <svg
      style={{
        position: 'absolute', inset: -2,
        width: 'calc(100% + 4px)', height: 'calc(100% + 4px)',
        pointerEvents: 'none', zIndex: 10, overflow: 'visible',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      aria-hidden="true"
    >
      <rect
        ref={rectRef}
        className="svc-spin-rect"
        x="2" y="2"
        width="calc(100% - 4px)" height="calc(100% - 4px)"
        rx="13"
        pathLength="1000"
      />
    </svg>
  )
}

const SERVICES = [
  {
    id: 'gerenciamento',
    label: 'Gerenciamento de Processos',
    image: '/services/gerenciamento.jpg',
    desc: 'Gestão completa dos pedidos de importação e embarques de exportação com visibilidade em tempo real.',
    details: [
      'Acompanhamento de DI, DUE e demais documentos aduaneiros',
      'Visibilidade em tempo real via MyINDAIA & Power BI',
      'Integração com sistemas ERP do cliente',
      'Relatórios gerenciais e KPIs de operação',
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="14" x2="11" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'desembaraco',
    label: 'Desembaraço Aduaneiro',
    image: '/services/desembaraco.jpg',
    desc: '58 anos de experiência no desembaraço de grandes empresas em todos os portos e aeroportos do Brasil.',
    details: [
      'Desembaraço em todos os portos e aeroportos do Brasil',
      'Parametrização e gestão de canais (verde, amarelo, vermelho)',
      'Consultoria em classificação fiscal NCM',
      'Licenciamento de importação (LI) e anuências especiais',
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 'logistica',
    label: 'Logística Internacional',
    image: '/services/logistica.jpg',
    desc: 'Agenciamento de cargas, door-to-door internacional, transporte e coletas nacionais.',
    details: [
      'Frete marítimo, aéreo e rodoviário internacional',
      'Operações door-to-door e port-to-port',
      'Gestão de seguros de carga',
      'Consolidação e desconsolidação de cargas (LCL/FCL)',
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'transportation',
    label: 'Transportation Management',
    image: '/services/transportation.jpg',
    desc: 'Time dedicado ao gerenciamento de transporte e logística de entrada e saída das operações.',
    details: [
      'Gestão de transportadoras homologadas',
      'Rastreamento de cargas em tempo real',
      'Otimização de rotas e custos logísticos',
      'Controle de SLA e indicadores de entrega',
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    id: 'drawback',
    label: 'Drawback & OEA',
    image: '/services/drawback.jpg',
    desc: 'Consultoria em regimes especiais, gestão de drawback e suporte aos processos de OEA dos clientes.',
    details: [
      'Habilitação e gestão de Drawback Suspensão e Isenção',
      'Assessoria para certificação OEA (Operador Econômico Autorizado)',
      'Regimes aduaneiros especiais (Recof, Entreposto, etc.)',
      'Planejamento tributário em operações de comércio exterior',
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 'radar',
    label: 'Habilitação RADAR',
    image: '/services/radar.jpg',
    desc: 'Habilitação de pessoa física e jurídica junto à Receita Federal para iniciar importações e exportações.',
    details: [
      'Habilitação RADAR Limitado, Ilimitado e Expresso',
      'Análise de capacidade financeira e documentação',
      'Alterações cadastrais e atualização de limites',
      'Suporte em caso de suspensão ou cancelamento',
    ],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
  },
]

export function ServicesExplorer() {
  const [active,   setActive]   = useState<number | null>(null)
  const [animKey,  setAnimKey]  = useState(0)
  const [visible,  setVisible]  = useState(true)

  const svc = active !== null ? SERVICES[active] : null

  function handleSelect(i: number) {
    if (active === i) {
      setVisible(v => !v)
      return
    }
    setActive(i)
    setAnimKey(k => k + 1)
    setVisible(true)
  }

  function handleClose() {
    setVisible(false)
  }

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section style={{
      background: 'var(--brand-deep)',
      padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,64px)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <style>{`
        /* ── Spinning border via SVG stroke — sem overflow:hidden, sem split ── */
        .svc-btn-wrap {
          position: relative;
          border-radius: 13px;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease;
        }
        .svc-btn-wrap:hover,
        .svc-btn-wrap.is-active {
          transform: scale(1.013);
          box-shadow: 0 8px 28px rgba(66,165,245,0.18);
        }
        /* SVG border overlay */
        .svc-spin-svg {
          position: absolute;
          inset: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
          overflow: visible;
        }
        .svc-btn-wrap:hover .svc-spin-svg,
        .svc-btn-wrap.is-active .svc-spin-svg {
          opacity: 1;
        }
        .svc-spin-rect {
          fill: none;
          stroke: #42A5F5;
          stroke-width: 2;
          stroke-linecap: round;
          filter: drop-shadow(0 0 4px rgba(66,165,245,0.8));
          stroke-dasharray: 120 880;
          stroke-dashoffset: 0;
        }
        /* default border */
        .svc-btn-inner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          width: 100%;
          border: 1.5px solid rgba(255,255,255,0.07);
          border-radius: 13px;
          cursor: pointer;
          text-align: left;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .svc-btn-wrap:hover .svc-btn-inner {
          border-color: transparent;
          background: rgba(66,165,245,0.04);
        }
        .svc-btn-wrap.is-active .svc-btn-inner {
          border-color: transparent;
          background: rgba(66,165,245,0.08);
        }

        /* ── Detail panel fade ── */
        .svc-panel-enter {
          animation: svcFadeIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .svc-panel-exit {
          animation: svcFadeOut 0.22s ease both;
        }
        @keyframes svcFadeIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes svcFadeOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(12px); }
        }
        @keyframes imgZoom {
          from { transform: scale(1.06); }
          to   { transform: scale(1); }
        }

        /* ── Layout ── */
        .svc-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
          align-items: start;
        }
        .svc-card {
          display: grid;
          grid-template-columns: 1fr 420px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          min-height: 520px;
        }
        @media (max-width: 1180px) {
          .svc-layout { grid-template-columns: 1fr; }
          .svc-card   { grid-template-columns: 1fr; min-height: unset; }
          .svc-card-img { min-height: 280px !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; }
        }
        @media (max-width: 560px) {
          .svc-card-img { min-height: 200px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--brand-sky)', marginBottom: 14,
          }}>
            <span style={{ width: 18, height: 1.5, background: 'var(--brand-sky)', display: 'block' }} />
            Serviços
          </div>
          <h2 style={{
            fontSize: 'clamp(28px,3.2vw,48px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.03em', color: 'white',
          }}>
            Explore os nossos <span style={{ color: 'var(--brand-sky)' }}>serviços</span>
          </h2>
        </div>

        <div className="svc-layout">

          {/* ── Left: list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SERVICES.map((s, i) => {
              const on = active === i
              return (
                <div
                  key={s.id}
                  className={`svc-btn-wrap${on && visible ? ' is-active' : ''}`}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <SpinBorder active={(hoveredIdx === i || (on && visible))} />
                  <button
                    className="svc-btn-inner"
                    onClick={() => handleSelect(i)}
                  >
                    {/* Icon bubble */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      border: `1.5px solid ${on && visible ? 'rgba(66,165,245,0.5)' : 'rgba(255,255,255,0.15)'}`,
                      background: on && visible ? 'rgba(66,165,245,0.15)' : 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: on && visible ? 'var(--brand-sky)' : 'rgba(255,255,255,0.3)',
                      transition: 'all 0.18s',
                    }}>
                      {s.icon}
                    </div>

                    <span style={{
                      flex: 1, fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: on && visible ? 700 : 500,
                      color: on && visible ? 'white' : 'rgba(255,255,255,0.55)',
                      transition: 'color 0.18s',
                    }}>
                      {s.label}
                    </span>

                    {/* +/− toggle */}
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `1px solid ${on && visible ? 'rgba(66,165,245,0.4)' : 'rgba(255,255,255,0.15)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, lineHeight: 1,
                      color: on && visible ? 'var(--brand-sky)' : 'rgba(255,255,255,0.3)',
                      transition: 'all 0.18s',
                    }}>
                      {on && visible ? '−' : '+'}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>

          {/* ── Right: detail panel ── */}
          {svc && visible && (
            <div
              key={`panel-${animKey}`}
              className="svc-card svc-panel-enter"
            >
              {/* Text pane */}
              <div style={{
                padding: 'clamp(28px,3.5vw,44px) clamp(24px,3vw,40px)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  {/* Header row: icon + close button */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'rgba(66,165,245,0.12)',
                      border: '1px solid rgba(66,165,245,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--brand-sky)',
                    }}>
                      {svc.icon}
                    </div>
                    {/* Close / minimise button */}
                    <button
                      onClick={handleClose}
                      title="Fechar"
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                        transition: 'all 0.18s', flexShrink: 0,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(255,255,255,0.1)'
                        el.style.color = 'white'
                        el.style.borderColor = 'rgba(255,255,255,0.3)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(255,255,255,0.04)'
                        el.style.color = 'rgba(255,255,255,0.4)'
                        el.style.borderColor = 'rgba(255,255,255,0.15)'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>

                  <h3 style={{
                    fontSize: 'clamp(18px,2vw,22px)', fontWeight: 800, color: 'white',
                    letterSpacing: '-0.02em', marginBottom: 12,
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>
                    {svc.label}
                  </h3>
                  <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.75, marginBottom: 28,
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>
                    {svc.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {svc.details.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                          background: 'rgba(66,165,245,0.15)', border: '1px solid rgba(66,165,245,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="var(--brand-sky)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <a href="/contato" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontSize: 13, fontWeight: 700, color: 'var(--brand-sky)',
                    textDecoration: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>
                    Solicitar cotação →
                  </a>
                </div>
              </div>

              {/* Image pane */}
              <div
                className="svc-card-img"
                style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', minHeight: 420 }}
              >
                <img
                  key={`img-${animKey}`}
                  src={svc.image}
                  alt={svc.label}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    animation: 'imgZoom 1.2s ease forwards',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 70%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 18, left: 18,
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}>
                  <span style={{ color: 'var(--brand-sky)', display: 'flex', flexShrink: 0 }}>{svc.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', whiteSpace: 'nowrap' }}>
                    {svc.label}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* Empty state when nothing is selected or panel is collapsed */}
          {(!svc || !visible) && (
            <div style={{
              border: '1px dashed rgba(255,255,255,0.08)',
              borderRadius: 20, minHeight: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.2)', fontSize: 14,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              animation: 'svcFadeIn 0.3s ease both',
            }}>
              Selecione um serviço para ver os detalhes
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
