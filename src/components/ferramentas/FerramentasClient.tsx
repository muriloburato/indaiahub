'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { INCOTERMS, CHECKLIST_IMP, CHECKLIST_EXP } from '@/lib/constants'

type Tab = 'simulador' | 'incoterms' | 'checklist'

// ── DI Simulator ─────────────────────────────────────────────
function SimuladorDI() {
  const [form, setForm] = useState({ fob: '', frete: '', seg: '1', ii: '14', fx: '', afrmm: '25' })
  const [result, setResult] = useState<null | { cif: number; ii: number; piscof: number; afrmm: number; total: number }>(null)

  function calc() {
    const fob = +form.fob, frete = +form.frete, fx = +form.fx
    if (!fob || !fx) return alert('Informe o Valor FOB e a taxa de câmbio.')
    const cifUsd = fob + frete + (fob * (+form.seg / 100))
    const cifBrl = cifUsd * fx
    const iiVal = cifBrl * (+form.ii / 100)
    const pisVal = cifBrl * 0.021
    const cofVal = cifBrl * 0.0965
    const afrmmVal = frete * fx * (+form.afrmm / 100)
    setResult({ cif: cifBrl, ii: iiVal, piscof: pisVal + cofVal, afrmm: afrmmVal, total: cifBrl + iiVal + pisVal + cofVal + afrmmVal })
  }

  const R = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.7 }}>
        Estime os impostos de importação (II, PIS/COFINS, AFRMM) com base no valor CIF da mercadoria.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="fg"><label>Valor FOB (USD)</label><input type="number" placeholder="10000" value={form.fob} onChange={upd('fob')} /></div>
        <div className="fg"><label>Frete Internacional (USD)</label><input type="number" placeholder="800" value={form.frete} onChange={upd('frete')} /></div>
        <div className="fg"><label>Seguro (%)</label><input type="number" placeholder="1" value={form.seg} onChange={upd('seg')} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="fg">
          <label>Imposto de Importação (%)</label>
          <select value={form.ii} onChange={upd('ii')}>
            {[0,2,4,6,8,10,12,14,16,18,20,25,35].map(v => <option key={v} value={v}>{v}%</option>)}
          </select>
        </div>
        <div className="fg">
          <label>Taxa de Câmbio (R$/USD)</label>
          <input type="number" placeholder="5.87" step="0.01" value={form.fx} onChange={upd('fx')} />
        </div>
      </div>
      <button onClick={calc} style={{
        padding: '13px 28px', borderRadius: 10, background: 'var(--brand-core)', border: 'none',
        fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(21,101,192,0.35)', transition: 'all 0.2s',
      }}>
        Calcular Impostos
      </button>

      {result && (
        <div style={{ background: 'var(--brand-deep)', borderRadius: 12, padding: 28, marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
            Resultado da Simulação
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Valor CIF (BRL)', val: result.cif },
              { label: 'Imposto de Importação', val: result.ii },
              { label: 'PIS + COFINS', val: result.piscof },
              { label: 'AFRMM', val: result.afrmm },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontFamily: 'DM Mono', fontSize: 20, fontWeight: 500, color: 'white', marginTop: 4 }}>{R(item.val)}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--brand-core)', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Total Estimado</span>
            <span style={{ fontFamily: 'DM Mono', fontSize: 26, fontWeight: 500, color: 'white' }}>{R(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Incoterms ─────────────────────────────────────────────────
function IncotermsComp() {
  const [selected, setSelected] = useState('FOB')
  const codes = Object.keys(INCOTERMS)
  const d = INCOTERMS[selected]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {codes.map(code => (
          <div key={code} onClick={() => setSelected(code)} style={{
            border: `1.5px solid ${selected === code ? 'var(--brand-core)' : 'var(--border)'}`,
            background: selected === code ? 'var(--brand-frost)' : 'var(--bg-card)',
            borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: 22, fontWeight: 500, color: selected === code ? 'var(--brand-core)' : 'var(--text-3)' }}>{code}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--brand-frost)', border: '1px solid var(--brand-pale)', borderRadius: 12, padding: 24 }}>
        <div style={{ fontFamily: 'DM Mono', fontSize: 28, fontWeight: 500, color: 'var(--brand-core)', marginBottom: 8 }}>{selected}</div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>{d.desc}</p>
        <div style={{ display: 'grid', gap: 6 }}>
          {d.resp.map(r => (
            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(21,101,192,0.1)' }}>
              <span style={{ width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-core)', flexShrink: 0 }}>
                {INCO_ICONS[r.icon] ?? INCO_ICONS.doc}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-2)', flex: 1 }}>{r.name}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: r.who === 'buy' ? 'rgba(21,101,192,0.08)' : 'rgba(16,185,129,0.08)',
                color: r.who === 'buy' ? 'var(--brand-core)' : 'var(--green)',
              }}>
                {r.who === 'buy' ? 'Comprador' : 'Vendedor'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Checklist ─────────────────────────────────────────────────
function Checklist() {
  const [type, setType] = useState<'imp' | 'exp'>('imp')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const sections = type === 'imp' ? CHECKLIST_IMP : CHECKLIST_EXP

  const allKeys = sections.flatMap(s => Object.keys(s.items))
  const total = allKeys.length
  const done = allKeys.filter(k => checked.has(k)).length
  const pct = total ? Math.round((done / total) * 100) : 0

  function toggle(key: string) {
    setChecked(c => { const n = new Set(c); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['imp', 'exp'] as const).map(t => (
          <button key={t} onClick={() => { setType(t); setChecked(new Set()) }} style={{
            padding: '8px 20px', borderRadius: 100, border: `1.5px solid ${type === t ? 'var(--brand-core)' : 'var(--border)'}`,
            background: type === t ? 'var(--brand-frost)' : 'transparent',
            color: type === t ? 'var(--brand-core)' : 'var(--text-3)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {t === 'imp' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/><path d="m16 2-4 4-4-4"/><path d="M8 10h8"/><path d="M8 14h4"/><path d="M19 17v5"/><path d="M17 19h4"/></svg>
                Importação
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/><path d="m16 2-4 4-4-4"/><path d="M8 10h8"/><path d="M8 14h4"/><path d="M22 22 17 17"/><path d="m17 22 5-5"/></svg>
                Exportação
              </span>
            )}
          </button>
        ))}
        <button onClick={() => setChecked(new Set())} style={{ marginLeft: 'auto', padding: '8px 16px', border: '1.5px solid var(--border)', borderRadius: 100, background: 'transparent', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--text-3)', cursor: 'pointer' }}>
          Limpar
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--green)', borderRadius: 100, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{done} / {total} ({pct}%)</div>
      </div>

      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--brand-core)', marginBottom: 10, padding: '6px 10px', background: 'var(--brand-frost)', borderRadius: 6, display: 'inline-block' }}>
            {sec.title}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(sec.items).map(([key, item]) => (
              <div key={key} onClick={() => toggle(key)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1px solid ${checked.has(key) ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                background: checked.has(key) ? 'rgba(16,185,129,0.04)' : 'var(--bg-card)',
                transition: 'all 0.2s', userSelect: 'none',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `1.5px solid ${checked.has(key) ? 'var(--green)' : 'var(--gray-2)'}`,
                  background: checked.has(key) ? 'var(--green)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {checked.has(key) && <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: checked.has(key) ? 'var(--text-3)' : 'var(--text)', textDecoration: checked.has(key) ? 'line-through' : 'none', flex: 1 }}>
                  {item.n}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, flexShrink: 0,
                  background: item.r === 'ob' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  color: item.r === 'ob' ? 'var(--red)' : 'var(--yellow)',
                }}>
                  {item.r === 'ob' ? 'Obrig.' : 'Opcion.'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const INCO_ICONS: Record<string, React.ReactNode> = {
  box:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  truck:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  doc:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  ship:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l.5 2A2 2 0 0 0 5.46 21h13.08a2 2 0 0 0 1.96-1.62l.5-2"/><path d="M12 2v8"/><path d="m5 11 1.5-7h11L19 11"/><path d="M3 17h18"/></svg>,
  shield:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  customs: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="7" height="9"/><rect x="14" y="2" width="7" height="5"/><rect x="14" y="11" width="7" height="9"/><rect x="3" y="15" width="7" height="7"/></svg>,
}


const TAB_ICONS: Record<Tab, JSX.Element> = {
  simulador: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  ),
  incoterms: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  checklist: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
}

// ── Main Ferramentas Client ────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: 'simulador',  label: 'Simulador de DI'     },
  { id: 'incoterms', label: 'Comparador Incoterms' },
  { id: 'checklist', label: 'Checklist Documental' },
]

export function FerramentasClient() {
  const [tab, setTab] = useState<Tab>('simulador')
  const router = useRouter()

  return (
    <section className="sec" style={{ background: 'var(--bg-alt)', minHeight: '80vh' }}>
      <div className="wrap">
        <div className="sec-eye">Ferramentas COMEX</div>
        <h1 className="sec-h">Tudo que você precisa<br /><span>para operar com precisão</span></h1>
        <p className="sec-p">Ferramentas especializadas para importadores e exportadores brasileiros.</p>

        {/* Tabs + NCM link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 44, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, background: 'var(--border)', padding: 4, borderRadius: 12 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '9px 22px', borderRadius: 9, border: 'none',
                background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
                color: tab === t.id ? 'var(--text)' : 'var(--text-3)',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: tab === t.id ? 'var(--sh)' : 'none',
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}>
                {TAB_ICONS[t.id]} {t.label}
              </button>
            ))}
          </div>

          {/* Divisor */}
          <div style={{ width: 1, height: 32, background: 'var(--border)' }} />

          {/* NCM — link separado */}
          <button
            onClick={() => router.push('/ncm')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', borderRadius: 10,
              border: '1.5px solid var(--brand-pale)',
              background: 'var(--brand-frost)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
              color: 'var(--brand-core)', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--brand-core)'; el.style.color = 'white'; el.style.borderColor = 'var(--brand-core)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--brand-frost)'; el.style.color = 'var(--brand-core)'; el.style.borderColor = 'var(--brand-pale)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Consulta NCM
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, boxShadow: 'var(--sh)' }}>
          {tab === 'simulador'  && <SimuladorDI />}
          {tab === 'incoterms' && <IncotermsComp />}
          {tab === 'checklist' && <Checklist />}
        </div>
      </div>
    </section>
  )
}
