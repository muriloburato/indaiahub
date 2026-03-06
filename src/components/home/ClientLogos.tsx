'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   LOGOTIPOS SVG — P&B (currentColor)
   Todos em viewBox normalizado para proporção consistente.
   Renderizados com filter grayscale + currentColor para P&B.
   ───────────────────────────────────────────────────────────── */

const LOGOS: { name: string; w: number; svg: React.ReactNode }[] = [

  /* ── Petrobras ─── */
  { name: 'Petrobras', w: 140,
    svg: <svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Gota estilizada */}
      <ellipse cx="22" cy="32" rx="13" ry="17" opacity="0.9"/>
      <ellipse cx="22" cy="18" rx="6" ry="8" opacity="0.55"/>
      {/* Texto PETROBRAS */}
      <text x="44" y="38" fontFamily="Arial,sans-serif" fontSize="19" fontWeight="800" letterSpacing="0.5">PETROBRAS</text>
    </svg> },

  /* ── Vale ─── */
  { name: 'Vale', w: 100,
    svg: <svg viewBox="0 0 140 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* V bold */}
      <path d="M10 12 L35 48 L60 12" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* VALE */}
      <text x="72" y="38" fontFamily="Arial Black,sans-serif" fontSize="22" fontWeight="900" letterSpacing="1">VALE</text>
    </svg> },

  /* ── Ambev ─── */
  { name: 'Ambev', w: 110,
    svg: <svg viewBox="0 0 160 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Círculo com A */}
      <circle cx="26" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="3.5"/>
      <text x="20" y="36" fontFamily="Arial Black,sans-serif" fontSize="18" fontWeight="900">A</text>
      {/* MBEV */}
      <text x="56" y="38" fontFamily="Arial Black,sans-serif" fontSize="20" fontWeight="900" letterSpacing="1">MBEV</text>
    </svg> },

  /* ── Embraer ─── */
  { name: 'Embraer', w: 130,
    svg: <svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Silhueta de avião simplificada */}
      <path d="M8 32 L30 22 L38 24 L28 30 L36 42 L30 40 L24 31 Z" opacity="0.9"/>
      {/* EMBRAER */}
      <text x="50" y="38" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.8">EMBRAER</text>
    </svg> },

  /* ── Braskem ─── */
  { name: 'Braskem', w: 130,
    svg: <svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Anel dinâmico */}
      <circle cx="26" cy="30" r="16" fill="none" stroke="currentColor" strokeWidth="3"/>
      <circle cx="26" cy="30" r="8"  fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="26" cy="30" r="3"  fill="currentColor"/>
      {/* BRASKEM */}
      <text x="52" y="37" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.5">BRASKEM</text>
    </svg> },

  /* ── WEG ─── */
  { name: 'WEG', w: 90,
    svg: <svg viewBox="0 0 120 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Engrenagem */}
      <circle cx="26" cy="30" r="11" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="26" cy="30" r="5" fill="currentColor"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <rect key={i} x="24.5" y="16" width="3" height="5" fill="currentColor"
          style={{ transformOrigin:'26px 30px', transform:`rotate(${a}deg)` }}/>
      ))}
      {/* WEG */}
      <text x="48" y="38" fontFamily="Arial Black,sans-serif" fontSize="22" fontWeight="900" letterSpacing="2">WEG</text>
    </svg> },

  /* ── Natura ─── */
  { name: 'Natura', w: 110,
    svg: <svg viewBox="0 0 160 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Folha com nervura */}
      <path d="M20 8 Q34 10 32 28 Q24 22 16 18 Q12 12 20 8Z" opacity="0.9"/>
      <path d="M20 8 L26 28" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6"/>
      {/* NATURA */}
      <text x="44" y="38" fontFamily="Georgia,serif" fontSize="19" fontWeight="700" letterSpacing="0.5">NATURA</text>
    </svg> },

  /* ── Gerdau ─── */
  { name: 'Gerdau', w: 110,
    svg: <svg viewBox="0 0 160 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* G sólido */}
      <path d="M34 18 A16 16 0 1 0 34 42 L34 32 L26 32 L26 36 L30 36 L30 40 A12 12 0 1 1 30 20 Z" opacity="0.9"/>
      {/* GERDAU */}
      <text x="54" y="38" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.4">GERDAU</text>
    </svg> },

  /* ── Suzano ─── */
  { name: 'Suzano', w: 115,
    svg: <svg viewBox="0 0 170 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* S curva dupla */}
      <path d="M28 14 Q14 14 14 22 Q14 30 26 30 Q38 30 38 38 Q38 46 24 46" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* SUZANO */}
      <text x="52" y="38" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.4">SUZANO</text>
    </svg> },

  /* ── Ultrapar ─── */
  { name: 'Ultrapar', w: 130,
    svg: <svg viewBox="0 0 190 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* U arredondado */}
      <path d="M14 12 L14 34 A14 14 0 0 0 42 34 L42 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* ULTRAPAR */}
      <text x="56" y="38" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="700" letterSpacing="0.3">ULTRAPAR</text>
    </svg> },

  /* ── Mahle ─── */
  { name: 'Mahle', w: 110,
    svg: <svg viewBox="0 0 160 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Pistão estilizado */}
      <rect x="14" y="16" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="19" y="32" width="3.5" height="6" fill="currentColor"/>
      <rect x="24.5" y="32" width="3.5" height="6" fill="currentColor"/>
      <line x1="14" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.5"/>
      {/* MAHLE */}
      <text x="44" y="38" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.5">MAHLE</text>
    </svg> },

  /* ── Eaton ─── */
  { name: 'Eaton', w: 100,
    svg: <svg viewBox="0 0 150 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* E triplo traço */}
      <path d="M14 12 L14 48 L32 48 M14 30 L28 30 M14 12 L32 12" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* ATON */}
      <text x="44" y="38" fontFamily="Arial Black,sans-serif" fontSize="19" fontWeight="900" letterSpacing="0.5">ATON</text>
    </svg> },

  /* ── Parker ─── */
  { name: 'Parker', w: 110,
    svg: <svg viewBox="0 0 165 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* P sólido */}
      <path d="M14 48 L14 12 L28 12 Q40 12 40 22 Q40 32 28 32 L14 32" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* ARKER */}
      <text x="50" y="38" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.3">ARKER</text>
    </svg> },

  /* ── BRF ─── */
  { name: 'BRF', w: 85,
    svg: <svg viewBox="0 0 120 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Aves estilizadas — dois triângulos */}
      <path d="M10 38 Q18 18 26 28 Q30 18 38 12 Q36 28 26 34 Z" opacity="0.9"/>
      {/* BRF */}
      <text x="48" y="40" fontFamily="Arial Black,sans-serif" fontSize="22" fontWeight="900" letterSpacing="1">BRF</text>
    </svg> },

  /* ── Marcopolo ─── */
  { name: 'Marcopolo', w: 140,
    svg: <svg viewBox="0 0 200 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Ônibus lateral simplificado */}
      <rect x="8" y="20" width="28" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <rect x="12" y="23" width="8" height="7" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="22" y="23" width="8" height="7" rx="1" fill="currentColor" opacity="0.5"/>
      <circle cx="13" cy="40" r="3.5" fill="currentColor"/>
      <circle cx="28" cy="40" r="3.5" fill="currentColor"/>
      {/* MARCOPOLO */}
      <text x="48" y="37" fontFamily="Arial,sans-serif" fontSize="15" fontWeight="700" letterSpacing="0.3">MARCOPOLO</text>
    </svg> },

  /* ── Randon ─── */
  { name: 'Randon', w: 115,
    svg: <svg viewBox="0 0 170 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* R com perna diagonal */}
      <path d="M14 48 L14 12 L28 12 Q40 12 40 22 Q40 30 30 31 L40 48" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* ANDON */}
      <text x="52" y="38" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.3">ANDON</text>
    </svg> },

  /* ── Dana ─── */
  { name: 'Dana', w: 90,
    svg: <svg viewBox="0 0 130 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* D arredondado */}
      <path d="M14 12 L14 48 L24 48 Q46 48 46 30 Q46 12 24 12 Z" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* ANA */}
      <text x="56" y="38" fontFamily="Arial Black,sans-serif" fontSize="22" fontWeight="900" letterSpacing="0.5">ANA</text>
    </svg> },

  /* ── Tupy ─── */
  { name: 'Tupy', w: 90,
    svg: <svg viewBox="0 0 125 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Fundição — T geométrico */}
      <path d="M8 16 L40 16 M24 16 L24 44" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      {/* UPY */}
      <text x="52" y="38" fontFamily="Arial Black,sans-serif" fontSize="20" fontWeight="900" letterSpacing="1">UPY</text>
    </svg> },

  /* ── Fras-le ─── */
  { name: 'Fras-le', w: 115,
    svg: <svg viewBox="0 0 165 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* F com travessão */}
      <path d="M14 12 L14 48 M14 12 L32 12 M14 30 L28 30" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* RAS-LE */}
      <text x="46" y="38" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.3">RAS-LE</text>
    </svg> },

  /* ── Schulz ─── */
  { name: 'Schulz', w: 110,
    svg: <svg viewBox="0 0 160 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* S curva */}
      <path d="M32 15 Q16 15 16 24 Q16 32 28 32 Q40 32 40 41 Q40 49 24 49" stroke="currentColor" strokeWidth="3.8" fill="none" strokeLinecap="round"/>
      {/* CHULZ */}
      <text x="52" y="38" fontFamily="Arial,sans-serif" fontSize="17" fontWeight="700" letterSpacing="0.3">CHULZ</text>
    </svg> },
]

/* ─── Linha do carrossel ────────────────────────────────────── */
const ITEM_GAP = 16

function totalWidth(logos: typeof LOGOS) {
  return logos.reduce((acc, l) => acc + l.w + ITEM_GAP, 0)
}

function CarouselRow({
  logos, speed, reverse = false, pausedRef,
}: {
  logos: typeof LOGOS
  speed: number
  reverse?: boolean
  pausedRef: React.MutableRefObject<boolean>
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef   = useRef(0)
  const totalW   = totalWidth(logos)

  useEffect(() => {
    posRef.current = reverse ? totalW : 0
    let last = performance.now()
    let raf: number
    function tick(now: number) {
      const dt = now - last; last = now
      if (!pausedRef.current) {
        if (reverse) {
          posRef.current -= speed * (dt / 16)
          if (posRef.current <= 0) posRef.current += totalW
        } else {
          posRef.current += speed * (dt / 16)
          if (posRef.current >= totalW) posRef.current -= totalW
        }
        if (trackRef.current)
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [totalW, speed, reverse, pausedRef])

  return (
    <div ref={trackRef} style={{ display: 'flex', gap: ITEM_GAP, width: 'max-content', willChange: 'transform', alignItems: 'center' }}>
      {[...logos, ...logos].map((logo, i) => (
        <div
          key={i}
          title={logo.name}
          style={{
            width: logo.w, height: 64, flexShrink: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '10px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease', cursor: 'default', boxSizing: 'border-box',
            color: 'var(--text-3)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--brand-pale)'
            el.style.background  = 'var(--brand-frost)'
            el.style.color       = 'var(--brand-core)'
            el.style.transform   = 'scale(1.06)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border)'
            el.style.background  = 'var(--bg-card)'
            el.style.color       = 'var(--text-3)'
            el.style.transform   = 'scale(1)'
          }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {logo.svg}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Componente principal ─────────────────────────────────── */
const ROW1 = LOGOS.slice(0, 10)
const ROW2 = LOGOS.slice(10)

export function ClientLogos() {
  const pausedRef = useRef(false)

  return (
    <section style={{
      background: 'var(--bg-alt)', borderTop: '1px solid var(--border)',
      padding: 'clamp(48px,7vw,80px) 0', overflow: 'hidden',
    }}>
      {/* Header */}
      <div className="wrap" style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="sec-eye" style={{ justifyContent: 'center' }}>Nossos Clientes</div>
          <h2 className="sec-h" style={{ textAlign: 'center' }}>
            Empresas que confiam na <span>INDAIA</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Mais de 340 empresas ativas em todo o Brasil.
          </p>
        </div>
      </div>

      {/* Faixas */}
      <div
        style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}
        onMouseEnter={() => { pausedRef.current = true  }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {/* Fade masks */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 140, background: 'linear-gradient(to right, var(--bg-alt), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 140, background: 'linear-gradient(to left, var(--bg-alt), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{ overflow: 'hidden' }}>
          <CarouselRow logos={ROW1} speed={0.40} reverse={false} pausedRef={pausedRef} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <CarouselRow logos={ROW2} speed={0.34} reverse={true}  pausedRef={pausedRef} />
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: 'var(--text-3)' }}>
        Passe o mouse para pausar · +340 parceiros em todo o Brasil
      </p>
    </section>
  )
}
