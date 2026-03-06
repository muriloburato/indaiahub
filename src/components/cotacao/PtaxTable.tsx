'use client'

import { useState } from 'react'
import { usePtax } from '@/hooks/usePtax'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export function PtaxTable() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear]   = useState(now.getFullYear())
  const { rows, loading, error, fetch } = usePtax()

  function exportCSV() {
    if (!rows.length) return
    const lines = ['Data,Hora,Tipo,Compra,Venda,Variação']
    rows.forEach(r => lines.push(`${r.date},${r.time},${r.tipo},${r.compra.toFixed(4)},${r.venda.toFixed(4)},${r.change?.toFixed(4) ?? ''}`))
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `PTAX-${MONTHS[month-1]}-${year}.csv`
    a.click()
  }

  const years = Array.from({ length: now.getFullYear() - 2018 }, (_, i) => now.getFullYear() - i)

  return (
    <section style={{ background: 'var(--bg-alt)', padding: '80px 48px' }} id="ptax">
      <div className="wrap">
        <div className="sec-eye">Tabela PTAX</div>
        <h2 className="sec-h">Histórico mensal <span>Banco Central</span></h2>
        <p className="sec-p">Cotações oficiais PTAX — Dólar Comercial (USD/BRL) por dia útil.</p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="fg" style={{ width: 160 }}>
            <label>Mês</label>
            <select value={month} onChange={e => setMonth(+e.target.value)}>
              {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div className="fg" style={{ width: 100 }}>
            <label>Ano</label>
            <select value={year} onChange={e => setYear(+e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button
            onClick={() => fetch(month, year)}
            disabled={loading}
            style={{
              padding: '11px 24px', borderRadius: 10,
              background: 'var(--brand-core)', border: 'none',
              fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700,
              color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(21,101,192,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Buscando…' : 'Consultar BCB'}
          </button>
          {rows.length > 0 && (
            <button
              onClick={exportCSV}
              style={{
                padding: '11px 24px', borderRadius: 10,
                border: '1.5px solid var(--border)', background: 'transparent',
                fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600,
                color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              ↓ Exportar CSV
            </button>
          )}
        </div>

        {/* Status */}
        {error && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: 'var(--red)', fontSize: 13 }}>
            {error}
          </div>
        )}

        {rows.length > 0 && (
          <div style={{ marginTop: 24, overflow: 'auto' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
              {rows.length} dias úteis · Fechamento PTAX · BCB
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Mono', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Data', 'Hora', 'Tipo', 'Compra', 'Venda', 'Variação'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.date + r.time} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-alt)' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-2)', fontWeight: 500 }}>{r.date}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-3)', fontSize: 11 }}>{r.time} <span style={{ opacity: 0.4, fontSize: 9 }}>{r.tipo}</span></td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-3)', fontSize: 11 }}>{r.tipo}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text)' }}>R$ {r.compra.toFixed(4).replace('.', ',')}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text)', fontWeight: 600 }}>R$ {r.venda.toFixed(4).replace('.', ',')}</td>
                    <td style={{ padding: '10px 14px', color: r.change === null ? 'var(--text-3)' : r.isUp ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {r.change === null ? '—' : `${r.isUp ? '▲' : '▼'} ${Math.abs(r.change).toFixed(4)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
