'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════
   POSTS DO INSTAGRAM — URLs públicas do perfil @indaialogistica

   Como adicionar posts:
   1. Abra o post no Instagram no navegador
   2. Copie a URL (ex: https://www.instagram.com/p/ABC123/)
   3. Cole no array abaixo
═══════════════════════════════════════════════════ */
const IG_POST_URLS: string[] = [
  'https://www.instagram.com/p/DVgU18LoBno/',
    'https://www.instagram.com/p/DUtbMowjkBV/',
    'https://www.instagram.com/p/DVYxUbvIF6-/',
    'https://www.instagram.com/p/DVQ3iW-jnwM/',
    'https://www.instagram.com/p/DU-0hqVkrqL/',
    'https://www.instagram.com/p/DU6AZg-jHeX/',
    'https://www.instagram.com/p/DUtlWL0jYAZ/',
    'https://www.instagram.com/p/DVeUp6_Di0y/',
    'https://www.instagram.com/p/DUqUJBtElc1/',
    'https://www.instagram.com/p/DUqTxNokp1P/',
    'https://www.instagram.com/p/DUlj9t-jekF/?img_index=1',



]

/* ═══════════════════════════════════════════════════
   CARD — injeta blockquote oficial + processa via embed.js
═══════════════════════════════════════════════════ */
function EmbedCard({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Injeta o blockquote padrão do embed do Instagram
    ref.current.innerHTML = `
      <blockquote
        class="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink="${url}"
        data-instgrm-version="14"
        style="
          background:#FFF;
          border:0;
          border-radius:16px;
          box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);
          margin:0;
          max-width:100%;
          min-width:280px;
          padding:0;
          width:100%;
        "
      >
      </blockquote>
    `

    // Processa o embed
    if ((window as any).instgrm) {
      ;(window as any).instgrm.Embeds.process()
    }
  }, [url])

  return (
    <div className="ig-card" ref={ref} />
  )
}

/* ═══════════════════════════════════════════════════
   CARROSSEL
═══════════════════════════════════════════════════ */
function Carousel({ urls }: { urls: string[] }) {
  const trackRef   = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  const STEP = 344

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    const t = setTimeout(updateArrows, 1200)
    updateArrows()
    return () => {
      el.removeEventListener('scroll', updateArrows)
      clearTimeout(t)
    }
  }, [updateArrows])

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -STEP * 2 : STEP * 2, behavior: 'smooth' })
  }

  return (
    <div className="ig-carousel">
      <button
        onClick={() => scroll('left')}
        aria-label="Anterior"
        disabled={!canLeft}
        className={`ig-carousel__btn ig-carousel__btn--left${!canLeft ? ' ig-carousel__btn--disabled' : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div ref={trackRef} className="ig-carousel__track">
        {urls.map((url, i) => (
          <EmbedCard key={url + i} url={url} />
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Próximo"
        disabled={!canRight}
        className={`ig-carousel__btn ig-carousel__btn--right${!canRight ? ' ig-carousel__btn--disabled' : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EXPORT — NewsSection
═══════════════════════════════════════════════════ */
export function NewsSection() {
  return (
    <section className="sec sec-news" id="noticias" style={{ background: '#ffffff' }}>
      {/* Script oficial do Instagram — carrega uma vez, processa todos os embeds */}
      <script async src="https://www.instagram.com/embed.js" />

      <style>{`
        /* Caixa ao redor do carrossel — fundo branco limpo */
        .ig-carousel-box {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 32px 100px;
          position: relative;
        }

        /* Eyebrow dentro da caixa branca usa cor padrão */
        .ig-sec-eye {
          color: var(--brand-core) !important;
        }
        .ig-sec-eye::before {
          background: var(--brand-core) !important;
        }

        .ig-carousel {
          position: relative;
        }

        .ig-carousel__track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 8px;
          align-items: flex-start;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0px, black 16px,
            black calc(100% - 16px), transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0px, black 16px,
            black calc(100% - 16px), transparent 100%
          );
        }
        .ig-carousel__track::-webkit-scrollbar { display: none; }

        .ig-card {
        
          flex-shrink: 0;
          width: 328px;
          scroll-snap-align: start;
          max-height: 630px;
          overflow: hidden;
          border-radius: 16px;
        }

        /* Garante que o iframe do Instagram preencha o card */
        .ig-card .instagram-media,
        .ig-card iframe {
  min-width: unset !important;
  width: 100% !important;
  max-width: 100% !important;
  display: block !important;
  position: relative !important;
  top: -72px !important;
  margin-bottom: -72px !important;
}

        .ig-carousel__btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-2);
          transition: all 0.2s;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(15,23,42,0.08);
        }
        .ig-carousel__btn:hover:not(.ig-carousel__btn--disabled) {
          background: var(--brand-core);
          border-color: var(--brand-core);
          color: white;
          box-shadow: 0 6px 20px rgba(21,101,192,0.35);
        }
        .ig-carousel__btn--left  { left: -68px; }
        .ig-carousel__btn--right { right: -68px; }
        .ig-carousel__btn--disabled {
          opacity: 0.2;
          cursor: default;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .ig-carousel-box { padding: 24px 24px; }
          .ig-carousel__btn--left  { left: -18px; }
          .ig-carousel__btn--right { right: -18px; }
        }
        @media (max-width: 600px) {
          .ig-card { width: 270px; }
          .ig-carousel__btn { width: 40px; height: 40px; }
        }
      `}</style>

      {/* Caixa azul full-width com header + carrossel */}
      <div style={{ paddingLeft: 'var(--page-px)', paddingRight: 'var(--page-px)' }}>
        <div className="ig-carousel-box">

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', flexWrap: 'wrap',
            gap: 16, marginBottom: 40,
          }}>
            <div>
              <div className="sec-eye ig-sec-eye">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
                @indaialogistica
              </div>
              <h2 className="sec-h" style={{ color: '#0F172A' }}>
                Acompanhe a INDAIA<br />
                <span style={{ color: 'var(--brand-core)' }}>no Instagram</span>
              </h2>
            </div>

            <a
              href="https://www.instagram.com/indaialogistica/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 10,
                border: '1.5px solid #E2E8F0',
                fontSize: 13, fontWeight: 700, color: '#0F172A',
                textDecoration: 'none', transition: 'all 0.2s',
                whiteSpace: 'nowrap', background: 'transparent', cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#C13584'
                el.style.color = '#C13584'
                el.style.background = 'rgba(193,53,132,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#E2E8F0'
                el.style.color = '#0F172A'
                el.style.background = 'transparent'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              Ver perfil completo
            </a>
          </div>

          <Carousel urls={IG_POST_URLS} />
        </div>
      </div>
    </section>
  )
}
