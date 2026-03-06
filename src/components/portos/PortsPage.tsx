'use client'

import { useEffect, useState } from 'react'
import { LOCATIONS } from '@/lib/constants'

/* ── WMO weather status ─────────────────────────── */
function wmoStatus(code: number, wind: number, vis: number, type: 'port' | 'airport') {
  const isStorm = code >= 95
  const isRain  = code >= 51 && code <= 82
  const isFog   = code >= 45 && code <= 48
  const wKt     = wind / 1.852
  const visKm   = (vis / 1000).toFixed(1)
  const wStr    = `${wind.toFixed(0)} km/h`
  if (type === 'airport') {
    if (isStorm || wKt > 40 || vis < 800)  return { status: 'bad'  as const, label: 'Condições adversas (IFR)', tip: `${isStorm ? 'Tempestade' : 'Vento/Vis.'} · ${wStr} · vis ${visKm}km` }
    if (isRain || isFog || wKt > 25 || vis < 5000) return { status: 'warn' as const, label: 'Condições MVFR', tip: `${isRain ? 'Chuva' : isFog ? 'Neblina' : 'Vento'} · ${wStr}` }
    return { status: 'ok' as const, label: 'Condições VFR normais', tip: `Tempo bom · ${wStr}` }
  } else {
    if (isStorm || wind > 55) return { status: 'bad'  as const, label: 'Operação suspensa', tip: `${isStorm ? 'Tempestade' : 'Ventos'} · ${wStr}` }
    if (isRain || isFog || wind > 35 || vis < 1000) return { status: 'warn' as const, label: 'Operação com restrição', tip: `${isRain ? 'Chuva' : isFog ? 'Neblina' : 'Vento'} · ${wStr}` }
    return { status: 'ok' as const, label: 'Operando normalmente', tip: `Favorável · ${wStr}` }
  }
}

/* ── Terminal links ─────────────────────────────── */
interface Terminal { name: string; url: string }
const TERMINALS: Record<string, Terminal[]> = {
  santos:    [{ name: 'Santos Brasil (Tecon)', url: 'https://www.santosbrasil.com.br' }, { name: 'BTP — Brasil Terminal Portuário', url: 'https://www.btp.com.br' }, { name: 'Ecoporto Santos', url: 'https://www.ecoporto.com.br' }, { name: 'DPW Embraport', url: 'https://www.dpworld.com/en/locations/americas/brazil/embraport' }, { name: 'Terminal 37 — Libra', url: 'https://www.t37.com.br' }],
  paranagua: [{ name: 'TCP — Terminal de Contêineres de Paranaguá', url: 'https://www.tcpprnr.com.br' }, { name: 'Portonave (TEP)', url: 'https://www.portonave.com.br' }, { name: 'Porto de Paranaguá (Appa)', url: 'https://www.portosdoparana.pr.gov.br' }],
  itajai:    [{ name: 'Portonave', url: 'https://www.portonave.com.br' }, { name: 'Terminal Braskarne', url: 'https://www.braskarne.com.br' }, { name: 'APM Terminals Itajaí', url: 'https://www.apmterminals.com/en/itajai' }],
  gru:       [{ name: 'GRU Airport Cargo', url: 'https://www.grucargo.com.br' }, { name: 'Cargosul — Terminal de Cargas', url: 'https://www.cargosul.com.br' }],
  gig:       [{ name: 'Infraero Cargo — Galeão', url: 'https://www4.infraero.gov.br/cargas' }],
  vcp:       [{ name: 'Viracopos Cargo', url: 'https://www.viracopos.com/cargas' }, { name: 'Latam Cargo VCP', url: 'https://www.latamcargo.com' }, { name: 'Ceva Logistics VCP', url: 'https://www.cevalogistics.com' }],
}

/* ── Port metadata ──────────────────────────────── */
const PORT_META: Record<string, { city: string; state: string; volume?: string; rank?: string }> = {
  santos:    { city: 'Santos', state: 'SP', volume: '4.1M TEUs/ano', rank: '#1 América Latina' },
  paranagua: { city: 'Paranaguá', state: 'PR', volume: '1.4M TEUs/ano', rank: '#2 Brasil' },
  itajai:    { city: 'Itajaí', state: 'SC', volume: '1.1M TEUs/ano', rank: '#3 Brasil' },
  gru:       { city: 'Guarulhos', state: 'SP', volume: '1.8M ton/ano', rank: '1º em carga aérea' },
  gig:       { city: 'Rio de Janeiro', state: 'RJ', volume: '380K ton/ano', rank: '2º em carga aérea' },
  vcp:       { city: 'Campinas', state: 'SP', volume: '450K ton/ano', rank: '3º em carga aérea' },
}

/* ── Status styles ──────────────────────────────── */
const SS = {
  ok:      { dot: '#10B981', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.15)',  text: '#10B981' },
  warn:    { dot: '#F59E0B', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.15)',  text: '#F59E0B' },
  bad:     { dot: '#EF4444', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.15)',   text: '#EF4444' },
  loading: { dot: '#94A3B8', bg: 'rgba(148,163,184,0.04)', border: 'rgba(148,163,184,0.1)',  text: '#94A3B8' },
}

interface LocStatus { id: string; name: string; type: 'port' | 'airport'; status: 'ok'|'warn'|'bad'|'loading'; label: string; tip: string; wind?: string; vis?: string }

/* ── SVG icons ──────────────────────────────────── */
const IcAnchor = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M5 15H2a10 10 0 0 0 20 0h-3"/></svg>
const IcPlane = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L11 8 2.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 7.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
const IcLink  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
const IcRefresh = ({ spin }: { spin?: boolean }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: spin ? 'spin 0.8s linear infinite' : 'none' }}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
const IcWind  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
const IcEye   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>

/* ── Location card ──────────────────────────────── */
function LocCard({ loc, expanded, onToggle }: { loc: LocStatus; expanded: boolean; onToggle: () => void }) {
  const st       = SS[loc.status]
  const terminals = TERMINALS[loc.id] ?? []
  const meta     = PORT_META[loc.id]

  return (
    <div style={{ border: `1px solid ${expanded ? st.border : 'var(--border)'}`, borderRadius: 14, background: expanded ? st.bg : 'var(--bg-card)', transition: 'all 0.2s', overflow: 'hidden' }}>
      {/* Header row */}
      <div onClick={onToggle} title={loc.tip} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', cursor: 'pointer' }}>
        {/* Status dot */}
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: st.dot, flexShrink: 0, boxShadow: loc.status === 'ok' ? `0 0 0 3px ${st.border}` : 'none' }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{loc.name}</div>
          {meta && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{meta.city}, {meta.state}{meta.rank ? ` · ${meta.rank}` : ''}</div>}
        </div>

        {/* Data chips */}
        {loc.wind && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--text-3)', background: 'var(--surface)', padding: '3px 8px', borderRadius: 6 }}>
            <IcWind />{loc.wind}
          </div>
        )}
        {loc.vis && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--text-3)', background: 'var(--surface)', padding: '3px 8px', borderRadius: 6 }}>
            <IcEye />vis {loc.vis}
          </div>
        )}

        {/* Status label */}
        <span style={{ fontSize: 12, fontWeight: 700, color: st.text, flexShrink: 0 }}>{loc.label}</span>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      {/* Expanded terminals */}
      {expanded && terminals.length > 0 && (
        <div style={{ borderTop: `1px solid ${st.border}`, padding: '14px 18px', background: 'var(--bg-alt)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Terminais principais</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {terminals.map(t => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--brand-core)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-sky)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--brand-core)')}
              >
                <IcLink />{t.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main page ──────────────────────────────────── */
export function PortsPage() {
  const [locs,     setLocs]     = useState<LocStatus[]>([])
  const [updated,  setUpdated]  = useState('')
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'port' | 'airport'>('all')

  async function fetchAll() {
    setLoading(true)
    const results = await Promise.allSettled(
      LOCATIONS.map(loc =>
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=weather_code,wind_speed_10m,visibility&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`).then(r => r.json())
      )
    )
    const out: LocStatus[] = results.map((res, i) => {
      const loc = LOCATIONS[i]
      if (res.status === 'fulfilled') {
        const c  = res.value.current ?? {}
        const st = wmoStatus(c.weather_code ?? 0, c.wind_speed_10m ?? 0, c.visibility ?? 10000, loc.type)
        return { id: loc.id, name: loc.name, type: loc.type, ...st, wind: `${(c.wind_speed_10m??0).toFixed(0)} km/h`, vis: `${((c.visibility??10000)/1000).toFixed(1)} km` }
      }
      return { id: loc.id, name: loc.name, type: loc.type, status: 'loading' as const, label: 'Sem dados', tip: 'API indisponível' }
    })
    setLocs(out)
    setUpdated(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    setLoading(false)
  }

  useEffect(() => { fetchAll(); const iv = setInterval(fetchAll, 600_000); return () => clearInterval(iv) }, [])

  const visible = locs.length > 0
    ? locs.filter(l => activeTab === 'all' || l.type === activeTab)
    : LOCATIONS.filter(l => activeTab === 'all' || l.type === activeTab).map(l => ({ id: l.id, name: l.name, type: l.type, status: 'loading' as const, label: 'Carregando…', tip: '' }))

  const countOk   = locs.filter(l => l.status === 'ok').length
  const countWarn = locs.filter(l => l.status === 'warn').length
  const countBad  = locs.filter(l => l.status === 'bad').length

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0;transform:translateY(20px); } to { opacity:1;transform:none; } }`}</style>

      {/* ── Hero ───────────────────────────────── */}
      <section style={{ background: 'var(--brand-deep)', padding: 'clamp(56px,8vw,104px) 0 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(66,165,245,0.07) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        {/* Blue glow */}
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(21,101,192,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative' }}>
          {/* Eye */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brand-sky)', marginBottom: 16 }}>
            <span style={{ width: 18, height: 1.5, background: 'var(--brand-sky)', display: 'block' }} />
            Monitoramento Operacional
          </div>

          <h1 style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 800, color: 'white', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 20, maxWidth: 700 }}>
            Portos &{' '}<span style={{ color: 'var(--brand-sky)' }}>Aeroportos</span><br />em tempo real
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'rgba(255,255,255,0.45)', maxWidth: 560, lineHeight: 1.8, marginBottom: 48 }}>
            Condições meteorológicas, status operacional e terminais dos principais hubs de carga do Brasil. Dados atualizados via Open-Meteo a cada 10 minutos.
          </p>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 0, animation: 'fadeUp 0.6s ease both' }}>
            {[
              { val: locs.length || 6, label: 'Locais monitorados', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-sky)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg> },
              { val: countOk,   label: 'Operando normalmente',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> },
              { val: countWarn, label: 'Com restrições',        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> },
              { val: countBad,  label: 'Operação suspensa',     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: 'clamp(16px,2.5vw,28px) clamp(12px,2vw,24px)', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'DM Mono', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 500, color: 'white', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Controls + Cards ───────────────────── */}
      <section style={{ background: 'var(--bg-alt)', padding: 'clamp(40px,6vw,72px) 0 clamp(56px,7vw,96px)' }}>
        <div className="wrap">

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            {/* Tab filter */}
            <div style={{ display: 'flex', gap: 6, background: 'var(--border)', padding: 4, borderRadius: 10 }}>
              {([['all', 'Todos'], ['port', 'Portos'], ['airport', 'Aeroportos']] as const).map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  padding: '8px 18px', borderRadius: 7, border: 'none',
                  background: activeTab === id ? 'var(--bg-card)' : 'transparent',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
                  color: activeTab === id ? 'var(--text)' : 'var(--text-3)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: activeTab === id ? 'var(--sh)' : 'none',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Legend + refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                {([['ok','#10B981','Normal'], ['warn','#F59E0B','Restrição'], ['bad','#EF4444','Suspenso']] as const).map(([s, c, l]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                    <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{l}</span>
                  </div>
                ))}
              </div>
              <button onClick={fetchAll} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--text-3)', cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!loading) { const el = e.currentTarget; el.style.borderColor = 'var(--brand-core)'; el.style.color = 'var(--brand-core)' }}}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-3)' }}
              >
                <IcRefresh spin={loading} />
                {loading ? 'Atualizando…' : `Atualizar${updated ? ` · ${updated}` : ''}`}
              </button>
            </div>
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

            {/* Ports column */}
            {(activeTab === 'all' || activeTab === 'port') && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-3)', display: 'flex' }}><IcAnchor /></span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Portos Marítimos</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {visible.filter(l => l.type === 'port').map(loc => (
                    <LocCard key={loc.id} loc={loc} expanded={expanded === loc.id} onToggle={() => setExpanded(expanded === loc.id ? null : loc.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* Airports column */}
            {(activeTab === 'all' || activeTab === 'airport') && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-3)', display: 'flex' }}><IcPlane /></span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Aeroportos de Carga</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {visible.filter(l => l.type === 'airport').map(loc => (
                    <LocCard key={loc.id} loc={loc} expanded={expanded === loc.id} onToggle={() => setExpanded(expanded === loc.id ? null : loc.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info footer */}
          <div style={{ marginTop: 40, padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-core)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7, margin: 0 }}>
              Dados meteorológicos fornecidos pela <strong style={{ color: 'var(--text)' }}>Open-Meteo API</strong> (open-source). Status de operação é estimado com base em vento, visibilidade e código WMO — para informações oficiais consulte o{' '}
              <a href="https://www.portodesantos.com.br" target="_blank" rel="noopener" style={{ color: 'var(--brand-sky)' }}>Porto de Santos</a>,{' '}
              <a href="https://www.portosdoparana.pr.gov.br" target="_blank" rel="noopener" style={{ color: 'var(--brand-sky)' }}>Portos do Paraná</a> ou{' '}
              <a href="https://www.infraero.gov.br" target="_blank" rel="noopener" style={{ color: 'var(--brand-sky)' }}>INFRAERO</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
