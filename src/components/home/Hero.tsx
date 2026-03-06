'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import styles from './Hero.module.css'

const FULL_TEXT = 'A extensão do seu departamento de COMEX'

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed('')
    setDone(false)
    const id = setInterval(() => {
      idx.current += 1
      setDisplayed(text.slice(0, idx.current))
      if (idx.current >= text.length) { setDone(true); clearInterval(id) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { displayed, done }
}

const PHRASES = [
  <>Despacho aduaneiro e logística para <strong>importação e exportação</strong> — do DI ao desembaraço com transparência total.</>,
  <>Gerenciamos seus embarques de <strong>exportação</strong>: DUE, Registro de Exportação e logística door-to-door internacional.</>,
  <>Do licenciamento à entrega: <strong>importações</strong> com rastreamento em tempo real e consultoria fiscal especializada.</>,
  <>Drawback, OEA e regimes especiais para <strong>reduzir custos</strong> nas suas operações de comércio exterior.</>,
  <>58 anos conectando empresas ao mundo — <strong>importação e exportação</strong> com expertise que gera resultado.</>,
]

interface RateData { usd: string; eur: string; chg: string; isUp: boolean; time: string }

export function Hero() {
  const { displayed, done } = useTypewriter(FULL_TEXT)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [phraseVisible, setPhraseVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      const video = videoRef.current
      if (!video || !video.duration) return
      video.currentTime = Math.min(y / 1100, 1) * video.duration
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [rate, setRate] = useState<RateData>({ usd: 'R$ —', eur: 'R$ —', chg: '—', isUp: true, time: '—' })

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseVisible(false)
      setTimeout(() => {
        setPhraseIdx(p => (p + 1) % PHRASES.length)
        setPhraseVisible(true)
      }, 400)
    }, 3800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    async function fetch_() {
      try {
        const pad = (n: number) => String(n).padStart(2, '0')
        const today = new Date()
        const past = new Date(today); past.setDate(past.getDate() - 7)
        const fmt = (d: Date) => `${pad(d.getMonth()+1)}-${pad(d.getDate())}-${d.getFullYear()}`
        const [usdRes, eurRes] = await Promise.allSettled([
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=2&$format=json&$select=cotacaoVenda,dataHoraCotacao`).then(r => r.json()),
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='EUR'&@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=1&$format=json&$select=cotacaoVenda`).then(r => r.json()),
        ])
        let usd = 5.87, eur = 6.35, chg = 0, time = ''
        if (usdRes.status === 'fulfilled') {
          const rows = usdRes.value.value || []
          if (rows.length >= 1) { usd = rows[0].cotacaoVenda; time = rows[0].dataHoraCotacao.slice(11,16) }
          if (rows.length >= 2) { chg = ((rows[0].cotacaoVenda - rows[1].cotacaoVenda) / rows[1].cotacaoVenda) * 100 }
        }
        if (eurRes.status === 'fulfilled') {
          const rows = eurRes.value.value || []
          if (rows.length) eur = rows[0].cotacaoVenda
        }
        setRate({
          usd: `R$ ${usd.toFixed(4).replace('.', ',')}`,
          eur: `R$ ${eur.toFixed(4).replace('.', ',')}`,
          chg: `${chg >= 0 ? '▲' : '▼'} ${Math.abs(chg).toFixed(2)}%`,
          isUp: chg >= 0,
          time,
        })
      } catch {}
    }
    fetch_()
  }, [])

  const line1 = 'A extensão do seu'
  const comexStart = FULL_TEXT.indexOf('COMEX')

  function renderTitle() {
    if (displayed.length <= line1.length) {
      return (
        <>
          {displayed}
          <span style={{ animation: 'blink 0.75s step-end infinite', marginLeft: 6 }}>_</span>
        </>
      )
    }
    const beforeComex = 'departamento de '
    const comexTyped = displayed.length > comexStart ? displayed.slice(comexStart) : ''
    const afterLine1 = displayed.slice(line1.length + 1)
    return (
      <>
        {line1}{' '}
        {displayed.length <= comexStart ? afterLine1 : beforeComex}
        {displayed.length > comexStart && (
          <span className={styles.hl}>{comexTyped}</span>
        )}
        <span style={{ animation: 'blink 0.75s step-end infinite', marginLeft: 8 }}>_</span>
      </>
    )
  }

  return (
    <section className={styles.hero}>
      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes arrowPulse { from{opacity:0.8} to{opacity:0.15} }
        @keyframes phraseIn   { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
        @keyframes phraseOut  { from{opacity:1; transform:translateY(0)} to{opacity:0; transform:translateY(-8px)} }

        .hero-inner {
          position: relative;
          z-index: 2;
          padding-left:  var(--page-px, 24px);
          padding-right: var(--page-px, 24px);
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-title {
          font-size: clamp(14px, 4.2vw, 72px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          white-space: nowrap;
          max-width: 100%;
          overflow: visible;
        }

        .hero-sub {
          font-size: clamp(13px, 1.4vw, 17px);
          max-width: min(600px, 100%);
          margin-top: 20px;
          text-align: center;
          line-height: 1.7;
        }

        .hero-ctas {
          display: flex;
          flex-direction: row;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 36px;
          justify-content: center;
          width: 100%;
        }

        .hero-badge {
          font-size: clamp(10px, 1vw, 12px);
          margin-bottom: 20px;
        }

        /* Tablet: quebra em 2 linhas, fonte maior */
        @media (max-width: 860px) {
          .hero-title {
            white-space: normal;
            word-break: keep-all;
            font-size: clamp(24px, 5.5vw, 48px);
            max-width: 88vw;
          }
          .hero-sub { font-size: 15px; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .hero-inner { padding-left: 20px; padding-right: 20px; }
          .hero-title {
            white-space: normal;
            word-break: keep-all;
            font-size: clamp(20px, 7vw, 32px);
            letter-spacing: -0.02em;
            max-width: 100%;
          }
          .hero-sub { font-size: 14px; max-width: 100%; }
          .hero-ctas { flex-direction: column; align-items: stretch; gap: 12px; }
          .hero-ctas a, .hero-ctas button { width: 100% !important; justify-content: center; box-sizing: border-box; }
          .hero-badge { font-size: 10px; }
        }

        /* Mobile pequeno */
        @media (max-width: 380px) {
          .hero-title { font-size: 18px; }
          .hero-sub   { font-size: 13px; }
        }
      `}</style>

      {/* Video background */}
      <video
        ref={videoRef}
        src="/hero-bg.mp4"
        muted playsInline preload="metadata"
        onCanPlay={() => setVideoReady(true)}
        style={{
          transform: 'scaleX(-1)',
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
          opacity: videoReady ? 0.45 : 0,
          transition: 'opacity 1.4s ease',
        }}
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(10,22,40,0.80) 0%, rgba(10,22,40,0.50) 100%)',
      }} />

      <div className={styles.grid} />
      <div className={styles.lines}>
        {[20, 40, 60, 80].map(t => <div key={t} className={styles.line} style={{ top: `${t}%` }} />)}
      </div>

      {/* Content */}
      <div className="hero-inner">
        <div className={`hero-badge ${styles.badge}`}>
          <span className={styles.badgePip} />
          Despachante Aduaneiro — Santos, SP · 58 anos
        </div>

        <h1 className={`hero-title ${styles.title}`}>
          {renderTitle()}
        </h1>

        <div className={styles.subWrap}>
          <p
            className={`hero-sub ${styles.sub}`}
            style={{
              opacity: phraseVisible ? 1 : 0,
              transform: phraseVisible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >{PHRASES[phraseIdx]}</p>
        </div>

        <div className={`hero-ctas ${styles.ctas}`}>
          <Link href="/contato" className={styles.btnPrimary}>
            Solicitar Cotação
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a href="https://www.myindaiaweb.com.br" target="_blank" rel="noopener" className={styles.btnGhost}>
            Acessar Portal
          </a>
        </div>
      </div>

      {/* Scroll arrow */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)', pointerEvents: 'none',
        opacity: scrolled ? 0 : 1, transition: 'opacity 0.4s ease',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'arrowPulse 0.6s ease-in-out infinite alternate',
        }}>
          <svg width="50" height="50" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M4 11l6 6 6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
