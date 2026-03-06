'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface NcmItem { codigo: string; descricao: string; tipo: string; ii?: number | null }

/* ─────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES  — mesmo layout/animações do original, paleta CLARA
   ───────────────────────────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @keyframes ncm-spin { to { transform: rotate(360deg); } }
  @keyframes ncm-fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ncm-pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  @keyframes ncm-rotateBorder {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* Card wrapper com borda giratória — agora em azul claro */
  [data-ncm] .ncm-card-wrap {
    position: relative; border-radius: 20px; padding: 2px; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    background: rgba(21,101,192,0.06);
  }
  [data-ncm] .ncm-card-wrap::before {
    content: ''; position: absolute; top: 50%; left: 50%; width: 200%; height: 200%;
    background: conic-gradient(from 0deg, transparent 0deg, transparent 160deg,
      rgba(21,101,192,0.12) 180deg, #1565C0 200deg, #90CAF9 210deg,
      #1565C0 220deg, rgba(21,101,192,0.12) 240deg, transparent 260deg, transparent 360deg);
    transform: translate(-50%, -50%) rotate(0deg);
    animation: ncm-rotateBorder 3s linear infinite;
    opacity: 0; transition: opacity 0.35s ease; z-index: 0; pointer-events: none;
  }
  [data-ncm] .ncm-card-wrap:hover::before { opacity: 1; }
  [data-ncm] .ncm-card-wrap:hover {
    transform: scale(1.012);
    box-shadow: 0 20px 48px rgba(21,101,192,0.12), 0 4px 16px rgba(0,0,0,0.06);
  }
  [data-ncm] .ncm-card {
    position: relative; z-index: 1; border-radius: 18px;
    background: #ffffff; width: 100%; height: 100%;
    border: 1px solid #E2E8F0;
  }
  [data-ncm] .ncm-card-inner { position: relative; z-index: 2; }

  /* Linhas de resultado */
  [data-ncm] .ncm-result-row {
    transition: all 0.2s ease; cursor: pointer; border-radius: 10px;
    border: 1px solid #EEF2F7; background: #FAFBFC;
    animation: ncm-fadeSlideIn 0.25s ease both;
  }
  [data-ncm] .ncm-result-row:hover {
    border-color: rgba(21,101,192,0.3); background: #EFF6FF;
    transform: translateX(4px);
  }

  /* Chips de sugestão */
  [data-ncm] .ncm-chip-btn {
    transition: all 0.2s ease; border: 1px solid #DBEAFE;
    background: #EFF6FF; color: #1565C0; border-radius: 100px;
    padding: 4px 12px; font-size: 11px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; letter-spacing: 0.02em;
  }
  [data-ncm] .ncm-chip-btn:hover {
    border-color: #1565C0; background: #DBEAFE; color: #0D47A1;
  }

  /* Input */
  [data-ncm] .ncm-input {
    background: #FAFBFC !important;
    border: 1.5px solid #E2E8F0 !important;
    color: #0F172A !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  [data-ncm] .ncm-input:focus {
    border-color: #1565C0 !important;
    box-shadow: 0 0 0 3px rgba(21,101,192,0.1) !important;
    outline: none !important;
  }
  [data-ncm] .ncm-input::placeholder { color: #94A3B8 !important; }

  /* Botão primário */
  [data-ncm] .ncm-btn-primary {
    background: linear-gradient(135deg, #1565C0, #1976D2); border: none; color: white;
    font-weight: 700; cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(21,101,192,0.25);
  }
  [data-ncm] .ncm-btn-primary:hover {
    transform: translateY(-1px); box-shadow: 0 8px 24px rgba(21,101,192,0.35);
  }

  /* Scrollbar */
  [data-ncm] .ncm-scrollbar::-webkit-scrollbar { width: 4px; }
  [data-ncm] .ncm-scrollbar::-webkit-scrollbar-track { background: transparent; }
  [data-ncm] .ncm-scrollbar::-webkit-scrollbar-thumb { background: rgba(21,101,192,0.15); border-radius: 4px; }

  /* Badge II */
  [data-ncm] .ncm-badge {
    font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px;
    letter-spacing: 0.05em; flex-shrink: 0; font-family: 'DM Mono', 'JetBrains Mono', monospace;
  }
`

function StyleInjector() {
  useEffect(() => {
    const ID = 'ncm-global-styles'
    if (document.getElementById(ID)) return
    const el = document.createElement('style')
    el.id = ID
    el.textContent = GLOBAL_STYLES
    document.head.appendChild(el)
    return () => { document.getElementById(ID)?.remove() }
  }, [])
  return null
}

/* ── Badge de alíquota II ──────────────────────── */
function IIBadge({ ii }: { ii?: number | null }) {
  if (ii === null || ii === undefined)
    return <span className="ncm-badge" style={{ color: '#64748B', background: '#F1F5F9' }}>II: —</span>
  const [color, bg] =
    ii === 0   ? ['#059669', '#ECFDF5'] :
    ii <= 10   ? ['#1565C0', '#EFF6FF'] :
    ii <= 20   ? ['#B45309', '#FFFBEB'] :
                 ['#DC2626', '#FEF2F2']
  return <span className="ncm-badge" style={{ color, background: bg }}>II: {ii}%</span>
}

/* ── Modal de detalhe ──────────────────────────── */
function NcmDetailPanel({ item, onClose }: { item: NcmItem; onClose: () => void }) {
  const cap   = item.codigo.replace(/\D/g, '').slice(0, 2)
  const pis   = 2.1
  const cofins = 9.65

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 580, width: '100%', maxHeight: '90vh',
        background: '#ffffff', borderRadius: 20,
        boxShadow: '0 24px 80px rgba(15,23,42,0.15), 0 4px 24px rgba(15,23,42,0.08)',
        border: '1px solid #E2E8F0',
      }}>
        {/* Accent bar no topo */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #1565C0, #42A5F5)', borderRadius: '20px 20px 0 0' }} />

        <div style={{ padding: 32, overflowY: 'auto', maxHeight: 'calc(90vh - 3px)' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace", fontSize: 28, fontWeight: 600, color: '#1565C0', marginBottom: 6 }}>{item.codigo}</div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, maxWidth: 440 }}>{item.descricao}</div>
            </div>
            <button onClick={onClose} style={{
              background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#64748B', cursor: 'pointer', flexShrink: 0, marginLeft: 16,
              transition: 'all 0.15s',
            }}>×</button>
          </div>

          {/* Fonte badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, padding: '5px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1565C0', letterSpacing: '0.08em', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Portal Único Siscomex · TEC/NCM</span>
          </div>

          {/* Label tributos */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Tributos na Importação</div>

          {/* Grade de tributos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'II — Imposto de Importação',       val: item.ii != null ? `${item.ii}%` : 'Consultar', sub: 'TEC/CAMEX',      color: item.ii === 0 ? '#059669' : '#1565C0', bg: item.ii === 0 ? '#ECFDF5' : '#EFF6FF', border: item.ii === 0 ? '#A7F3D0' : '#BFDBFE' },
              { label: 'IPI — Imp. Prod. Industrializado', val: 'Variável',   sub: 'Consultar TIPI',  color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' },
              { label: 'PIS/Importação',                   val: `${pis}%`,    sub: 'Lei 10.865/2004', color: '#5B21B6', bg: '#F5F3FF', border: '#DDD6FE' },
              { label: 'COFINS/Importação',                val: `${cofins}%`, sub: 'Lei 10.865/2004', color: '#5B21B6', bg: '#F5F3FF', border: '#DDD6FE' },
            ].map(t => (
              <div key={t.label} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 8, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t.label}</div>
                <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace", fontSize: 22, fontWeight: 600, color: t.color }}>{t.val}</div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>{t.sub}</div>
              </div>
            ))}
          </div>

          {/* Capítulo + PIS+COFINS */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Capítulo NCM</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Capítulo {cap}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>PIS + COFINS</div>
              <div style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace", fontSize: 18, color: '#5B21B6', fontWeight: 600 }}>{pis + cofins}%</div>
            </div>
          </div>

          {/* Aviso */}
          <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.7, background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span>Alíquotas do II são referências pela TEC/CAMEX por capítulo. Para valores exatos consulte o{' '}
              <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ color: '#1565C0' }}>Sistema Classif</a>.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Página principal ──────────────────────────── */
export function NcmPage() {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState<NcmItem[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<NcmItem | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setSearched(false); return }
    setLoading(true); setError(null)
    try {
      const res  = await fetch(`/api/ncm?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      if (!data.ok) throw new Error(data.error ?? 'Erro na consulta')
      setResults(data.items); setSearched(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido'); setResults([])
    } finally { setLoading(false) }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setQuery(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 500)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { if (debounceRef.current) clearTimeout(debounceRef.current); search(query) }
  }

  useEffect(() => {
    const FONT_ID = 'ncm-fonts'
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement('link')
      link.id = FONT_ID; link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@700&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const suggestions = ['smartphone','calçados','soja','automóvel','8471','6109','0901','8517','3004']

  return (
    <>
      <StyleInjector />
      {selected && <NcmDetailPanel item={selected} onClose={() => setSelected(null)} />}

      {/* ── Hero branco com gradiente suave ── */}
      <section data-ncm style={{
        padding: '48px 24px 40px',
        fontFamily: "'Plus Jakarta Sans','Syne',sans-serif",
        background: 'linear-gradient(135deg, #F8FBFF 0%, #EFF6FF 50%, #F5F3FF 100%)',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Cabeçalho */}
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1565C0', display: 'inline-block', animation: 'ncm-pulse-dot 1.5s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#1565C0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>NCM — Nomenclatura Comum do Mercosul</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px,4.5vw,56px)', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.12, letterSpacing: '-0.03em', fontFamily: "'Space Grotesk','Plus Jakarta Sans',sans-serif" }}>
              Consulta <span style={{ color: '#1565C0' }}>NCM</span>
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', marginTop: 10, fontWeight: 400 }}>
              Pesquise códigos NCM com alíquotas de II, IPI, PIS e COFINS via Portal Único Siscomex.
            </p>
          </div>

          {/* Layout de duas colunas */}
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' }}>

            {/* ── ESQUERDA: Pesquisa ── */}
            <div className="ncm-card-wrap">
            <div className="ncm-card">
              <div className="ncm-card-inner" style={{ padding: 28 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1565C0, #1976D2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Pesquisa</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Código ou descrição</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#475569', marginBottom: 20, lineHeight: 1.7 }}>
                  Pesquise por <strong style={{ color: '#0F172A' }}>código NCM</strong>{' '}
                  (ex: <code style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace", fontSize: 11, background: '#EFF6FF', color: '#1565C0', padding: '1px 6px', borderRadius: 4 }}>8471.30</code>) ou{' '}
                  <strong style={{ color: '#0F172A' }}>descrição</strong>{' '}
                  (ex: <code style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace", fontSize: 11, background: '#EFF6FF', color: '#1565C0', padding: '1px 6px', borderRadius: 4 }}>smartphone</code>).
                </p>

                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    className="ncm-input"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    placeholder="Ex: 8471.30 ou computador portátil"
                    style={{ width: '100%', padding: '13px 16px 13px 42px', borderRadius: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid #EEF2F7', marginBottom: 16 }} />

                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 10 }}>Sugestões</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                  {suggestions.map(s => (
                    <button key={s} className="ncm-chip-btn" onClick={() => { setQuery(s); search(s) }}>{s}</button>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #EEF2F7', marginBottom: 16 }} />

                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 10 }}>Fonte dos Dados</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: 'Portal Único Siscomex' },
                    { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, label: 'TEC/CAMEX' },
                    { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>, label: 'Cache 24h' },
                  ].map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
                      {c.icon} {c.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>

            {/* ── DIREITA: Resultados ── */}
            <div className="ncm-card-wrap">
            <div className="ncm-card" style={{ minHeight: 500 }}>
              <div className="ncm-card-inner ncm-scrollbar" style={{ padding: 28, maxHeight: '80vh', overflowY: 'auto' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1565C0, #3949AB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Resultados</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>
                        {loading ? 'Buscando…' : results.length > 0 ? `${results.length} item${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}` : 'Aguardando pesquisa'}
                      </div>
                    </div>
                  </div>
                  {results.length > 0 && !loading && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1565C0', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '3px 10px', borderRadius: 100, letterSpacing: '0.05em' }}>
                      Clique para ver tributos →
                    </span>
                  )}
                </div>

                {/* Loading */}
                {loading && (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2" strokeLinecap="round"
                      style={{ animation: 'ncm-spin 0.8s linear infinite', display: 'block', margin: '0 auto 16px' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    <div style={{ fontSize: 14, color: '#64748B' }}>Consultando Portal Único Siscomex…</div>
                  </div>
                )}

                {/* Erro */}
                {!loading && error && (
                  <div style={{ background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 14, padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 4 }}>Erro ao consultar a API</div>
                      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 10 }}>{error}</div>
                      <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ fontSize: 12, color: '#1565C0' }}>
                        Acessar Sistema Classif diretamente →
                      </a>
                    </div>
                  </div>
                )}

                {/* Sem resultados */}
                {!loading && !error && searched && results.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 16px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Nenhum resultado</div>
                    <p style={{ fontSize: 13, color: '#94A3B8' }}>Tente outros termos ou consulte o{' '}
                      <a href="https://portalunico.siscomex.gov.br/classif/?perfil=publico" target="_blank" rel="noopener" style={{ color: '#1565C0' }}>Sistema Classif</a>.
                    </p>
                  </div>
                )}

                {/* Estado inicial */}
                {!loading && !error && !searched && (
                  <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 20px' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Consulte a tabela NCM</div>
                    <p style={{ fontSize: 13, color: '#94A3B8', maxWidth: 360, margin: '0 auto', lineHeight: 1.8 }}>
                      Digite um código NCM ou palavra-chave na caixa de pesquisa ao lado. Os resultados aparecem aqui automaticamente.
                    </p>
                  </div>
                )}

                {/* Lista de resultados */}
                {!loading && !error && results.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {results.map((item, i) => (
                      <div
                        key={item.codigo}
                        className="ncm-result-row"
                        onClick={() => setSelected(item)}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', animationDelay: `${Math.min(i * 30, 300)}ms` }}
                      >
                        <span style={{ fontFamily: "'DM Mono','JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: '#1565C0', flexShrink: 0, minWidth: 88 }}>{item.codigo}</span>
                        <span style={{ fontSize: 13, color: '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.descricao}</span>
                        <IIBadge ii={item.ii} />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    ))}
                    {results.length >= 80 && (
                      <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 12, textAlign: 'center' }}>
                        Exibindo os primeiros 80 resultados. Refine a busca para resultados mais precisos.
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
