'use client'

import { useEffect, useState } from 'react'
import { LOCATIONS } from '@/lib/constants'

/* ── WMO status logic ─────────────────────────── */
function wmoStatus(code: number, wind: number, vis: number, type: 'port' | 'airport') {
  const isStorm = code >= 95
  const isRain  = code >= 51 && code <= 82
  const isFog   = code >= 45 && code <= 48
  const wKt     = wind / 1.852
  const visKm   = (vis / 1000).toFixed(1)
  const wStr    = `${wind.toFixed(0)} km/h`

  if (type === 'airport') {
    if (isStorm || wKt > 40 || vis < 800)
      return { status: 'bad'  as const, label: 'Condições adversas (IFR)', tip: `${isStorm ? 'Tempestade' : 'Vento/Vis.'} · ${wStr} · vis ${visKm}km` }
    if (isRain || isFog || wKt > 25 || vis < 5000)
      return { status: 'warn' as const, label: 'Condições MVFR', tip: `${isRain ? 'Chuva' : isFog ? 'Neblina' : 'Vento'} · ${wStr}` }
    return   { status: 'ok'   as const, label: 'Condições VFR normais', tip: `Tempo bom · ${wStr}` }
  } else {
    if (isStorm || wind > 55)
      return { status: 'bad'  as const, label: 'Operação suspensa', tip: `${isStorm ? 'Tempestade' : 'Ventos'} · ${wStr}` }
    if (isRain || isFog || wind > 35 || vis < 1000)
      return { status: 'warn' as const, label: 'Operação com restrição', tip: `${isRain ? 'Chuva' : isFog ? 'Neblina' : 'Vento'} · ${wStr}` }
    return   { status: 'ok'   as const, label: 'Operando normalmente', tip: `Favorável · ${wStr}` }
  }
}

/* ── Terminal data ────────────────────────────── */
interface Terminal { name: string; url: string }

const TERMINALS: Record<string, Terminal[]> = {
  santos: [
    { name: 'Santos Brasil (Tecon)',      url: 'https://www.santosbrasil.com.br' },
    { name: 'BTP — Brasil Terminal Portuário', url: 'https://www.btp.com.br' },
    { name: 'Ecoporto Santos',            url: 'https://www.ecoporto.com.br' },
    { name: 'DPW Embraport',              url: 'https://www.dpworld.com/en/locations/americas/brazil/embraport' },
    { name: 'Terminal 37 — Libra',        url: 'https://www.t37.com.br' },
  ],
  paranagua: [
    { name: 'TCP — Terminal de Contêineres de Paranaguá', url: 'https://www.tcpprnr.com.br' },
    { name: 'Portonave (TEP)',             url: 'https://www.portonave.com.br' },
    { name: 'Porto de Paranaguá (Appa)',   url: 'https://www.portosdoparana.pr.gov.br' },
  ],
  itajai: [
    { name: 'Portonave',                  url: 'https://www.portonave.com.br' },
    { name: 'Terminal Braskarne',         url: 'https://www.braskarne.com.br' },
    { name: 'APM Terminals Itajaí',       url: 'https://www.apmterminals.com/en/itajai' },
  ],
  gru: [
    { name: 'GRU Airport Cargo',          url: 'https://www.grucargo.com.br' },
    { name: 'Cargosul — Terminal de Cargas', url: 'https://www.cargosul.com.br' },
    { name: 'TNT Freight at GRU',         url: 'https://www.tnt.com' },
  ],
  gig: [
    { name: 'Infraero Cargo — Galeão',    url: 'https://www4.infraero.gov.br/cargas' },
    { name: 'Multimodal Carga (GIG)',     url: 'https://www.infraero.gov.br' },
  ],
  vcp: [
    { name: 'Viracopos Cargo',            url: 'https://www.viracopos.com/cargas' },
    { name: 'Latam Cargo VCP',            url: 'https://www.latamcargo.com' },
    { name: 'Ceva Logistics VCP',         url: 'https://www.cevalogistics.com' },
  ],
}

/* ── SVG icons ────────────────────────────────── */
const IconAnchor = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/>
    <path d="M5 15H2a10 10 0 0 0 20 0h-3"/>
  </svg>
)
const IconPlane = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L11 8 2.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 7.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
)
const IconLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
  </svg>
)

/* ── Status colors/labels ─────────────────────── */
const STATUS_STYLE = {
  ok:      { dot: '#10B981', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.15)',  text: '#10B981' },
  warn:    { dot: '#F59E0B', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.15)',  text: '#F59E0B' },
  bad:     { dot: '#EF4444', bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.15)',   text: '#EF4444' },
  loading: { dot: '#94A3B8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.1)',  text: '#94A3B8' },
}

interface LocStatus {
  id: string; name: string; type: 'port' | 'airport'
  status: 'ok' | 'warn' | 'bad' | 'loading'
  label: string; tip: string
  wind?: string; vis?: string
}

export function PortsMonitor() {
  const [locs,     setLocs]     = useState<LocStatus[]>([])
  const [updated,  setUpdated]  = useState('')
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function fetchAll() {
    setLoading(true)
    const results = await Promise.allSettled(
      LOCATIONS.map(loc =>
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=weather_code,wind_speed_10m,wind_gusts_10m,visibility&wind_speed_unit=kmh&timezone=America%2FSao_Paulo`)
          .then(r => r.json())
      )
    )

    const out: LocStatus[] = results.map((res, i) => {
      const loc = LOCATIONS[i]
      if (res.status === 'fulfilled') {
        const c   = res.value.current ?? {}
        const st  = wmoStatus(c.weather_code ?? 0, c.wind_speed_10m ?? 0, c.visibility ?? 10000, loc.type)
        const wind = `${(c.wind_speed_10m ?? 0).toFixed(0)} km/h`
        const vis  = `${((c.visibility ?? 10000) / 1000).toFixed(1)} km`
        return { id: loc.id, name: loc.name, type: loc.type, ...st, wind, vis }
      }
      return { id: loc.id, name: loc.name, type: loc.type, status: 'loading' as const, label: 'Sem dados', tip: 'API indisponível' }
    })

    setLocs(out)
    setUpdated(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
    const iv = setInterval(fetchAll, 600_000)
    return () => clearInterval(iv)
  }, [])

  const ports    = locs.filter(l => l.type === 'port')
  const airports = locs.filter(l => l.type === 'airport')

  function Group({ title, items, icon }: { title: string; items: LocStatus[]; icon: React.ReactNode }) {
    return (
      <div>
        {/* Group header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ color: 'var(--text-3)', display: 'flex' }}>{icon}</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(loc => {
            const st  = STATUS_STYLE[loc.status]
            const terminals = TERMINALS[loc.id] ?? []
            const isOpen = expanded === loc.id

            return (
              <div
                key={loc.id}
                style={{
                  border: `1px solid ${isOpen ? st.border : 'var(--border)'}`,
                  borderRadius: 12,
                  background: isOpen ? st.bg : 'var(--bg-card)',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                }}
              >
                {/* Main row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : loc.id)}
                  title={loc.tip}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', cursor: 'pointer',
                  }}
                >
                  {/* Status dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: st.dot, flexShrink: 0,
                    boxShadow: loc.status === 'ok' ? `0 0 0 3px ${st.border}` : 'none',
                  }} />

                  {/* Name */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>
                    {loc.name}
                  </span>

                  {/* Wind + vis chips */}
                  {loc.wind && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', background: 'var(--surface)', padding: '2px 7px', borderRadius: 4 }}>
                      {loc.wind}
                    </span>
                  )}
                  {loc.vis && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', background: 'var(--surface)', padding: '2px 7px', borderRadius: 4 }}>
                      vis {loc.vis}
                    </span>
                  )}

                  {/* Status label */}
                  <span style={{ fontSize: 11, fontWeight: 700, color: st.text, flexShrink: 0 }}>
                    {loc.label}
                  </span>

                  {/* Expand chevron */}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>

                {/* Expanded terminals panel */}
                {isOpen && terminals.length > 0 && (
                  <div style={{
                    borderTop: `1px solid ${st.border}`,
                    padding: '12px 16px 14px',
                    background: 'var(--bg-alt)',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>
                      Terminais principais
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {terminals.map(t => (
                        <a
                          key={t.name}
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontSize: 12, fontWeight: 500, color: 'var(--brand-core)',
                            textDecoration: 'none', padding: '4px 0',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-sky)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--brand-core)')}
                        >
                          <IconLink />
                          {t.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section style={{ background: 'var(--bg-alt)', padding: '72px 0' }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <div className="sec-eye">Monitoramento Operacional</div>
            <h2 className="sec-h">
              Portos & <span>Aeroportos</span>
            </h2>
            <p className="sec-p" style={{ marginBottom: 0 }}>
              Condições meteorológicas em tempo real via Open-Meteo. Clique em qualquer local para ver os terminais.
            </p>
          </div>

          {/* Legend + refresh */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <button
              onClick={fetchAll}
              disabled={loading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
                color: 'var(--text-3)', cursor: loading ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!loading) { const el = e.currentTarget; el.style.borderColor = 'var(--brand-core)'; el.style.color = 'var(--brand-core)' }}}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-3)' }}
            >
              <span style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none', display: 'flex' }}><IconRefresh /></span>
              {loading ? 'Atualizando…' : 'Atualizar'}
            </button>

            <div style={{ display: 'flex', gap: 12 }}>
              {(['ok', 'warn', 'bad'] as const).map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_STYLE[s].dot }} />
                  <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                    {s === 'ok' ? 'Normal' : s === 'warn' ? 'Restrição' : 'Suspenso'}
                  </span>
                </div>
              ))}
            </div>

            {updated && (
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                Atualizado às {updated}
              </span>
            )}
          </div>
        </div>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <Group
            title="Portos Marítimos"
            icon={<IconAnchor />}
            items={ports.length > 0
              ? ports
              : LOCATIONS.filter(l => l.type === 'port').map(l => ({ id: l.id, name: l.name, type: l.type, status: 'loading' as const, label: 'Carregando…', tip: '' }))
            }
          />
          <Group
            title="Aeroportos de Carga"
            icon={<IconPlane />}
            items={airports.length > 0
              ? airports
              : LOCATIONS.filter(l => l.type === 'airport').map(l => ({ id: l.id, name: l.name, type: l.type, status: 'loading' as const, label: 'Carregando…', tip: '' }))
            }
          />
        </div>

      </div>
    </section>
  )
}
