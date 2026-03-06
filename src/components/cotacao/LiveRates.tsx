'use client'

import { useEffect, useState } from 'react'

interface Rate { val: string; chg: string; isUp: boolean; bars: number[] }

export function LiveRates() {
  const [rates, setRates] = useState<Record<string, Rate>>({
    USD: { val: '—', chg: '—', isUp: true, bars: [60, 65, 58, 72, 68, 75, 70] },
    EUR: { val: '—', chg: '—', isUp: true, bars: [55, 60, 62, 58, 65, 63, 68] },
    CNY: { val: '—', chg: '—', isUp: false, bars: [40, 42, 38, 45, 43, 41, 44] },
  })
  const [rateSrc, setRateSrc] = useState('')

  useEffect(() => {
    async function fetchRates() {
      try {
        const pad = (n: number) => String(n).padStart(2, '0')
        const today = new Date()
        const past = new Date(today); past.setDate(past.getDate() - 10)
        const fmt = (d: Date) => `${pad(d.getMonth()+1)}-${pad(d.getDate())}-${d.getFullYear()}`

        const [usdData, eurData, cnyData] = await Promise.allSettled([
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=8&$format=json&$select=cotacaoVenda,dataHoraCotacao`).then(r => r.json()),
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='EUR'&@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=8&$format=json&$select=cotacaoVenda`).then(r => r.json()),
          fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='CNY'&@dataInicial='${fmt(past)}'&@dataFinalCotacao='${fmt(today)}'&$orderby=dataHoraCotacao%20desc&$top=8&$format=json&$select=cotacaoVenda`).then(r => r.json()),
        ])

        const processRows = (data: { value: { cotacaoVenda: number }[] }) => {
       const rows = data.value || []
        if (!rows.length) return null
        const last = rows[0].cotacaoVenda
          const prev = rows[1]?.cotacaoVenda
          const chg = prev ? ((last - prev) / prev) * 100 : 0
          const bars = rows.slice(0, 7).reverse().map(r => Math.round((r.cotacaoVenda / last) * 70))
          return { val: `R$ ${last.toFixed(4).replace('.', ',')}`, chg: `${chg >= 0 ? '▲' : '▼'} ${Math.abs(chg).toFixed(2)}%`, isUp: chg >= 0, bars }
        }

        const newRates = { ...rates }
        if (usdData.status === 'fulfilled') { const r = processRows(usdData.value); if (r) newRates.USD = r }
        if (eurData.status === 'fulfilled') { const r = processRows(eurData.value); if (r) newRates.EUR = r }
        if (cnyData.status === 'fulfilled') { const r = processRows(cnyData.value); if (r) newRates.CNY = r }
        setRates(newRates)
        setRateSrc('BCB PTAX')
      } catch {}
    }

    fetchRates()
    const iv1 = setInterval(fetchRates, 300_000)
    return () => clearInterval(iv1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CURRENCIES = [
    { code: 'USD', name: 'Dólar Comercial',  label: 'por USD 1,00' },
    { code: 'EUR', name: 'Euro',             label: 'por EUR 1,00' },
    { code: 'CNY', name: 'Yuan Renminbi',    label: 'por CNY 1,00' },
  ]

  return (
    <section style={{ background: 'var(--brand-deep)', padding: '80px 48px' }} id="cotacoes">
      <div className="wrap">
        <div className="sec-eye" style={{ color: 'var(--brand-sky)' }}>
          <span style={{ background: 'var(--brand-sky)' }} />
          Câmbio ao Vivo &nbsp;
          <span style={{ fontSize: 9, letterSpacing: '0.08em', fontWeight: 600, color: 'rgba(66,165,245,0.6)' }}>{rateSrc}</span>
        </div>
        <h2 className="sec-h" style={{ color: 'white' }}>
          Taxas em <span style={{ color: 'var(--brand-sky)' }}>tempo real</span>
        </h2>
        <p className="sec-p" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Acompanhe dólar, euro e yuan para planejar suas importações com precisão.
        </p>

        {/* Rate cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
          {CURRENCIES.map(c => {
            const r = rates[c.code]
            return (
              <div key={c.code} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 24,
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(66,165,245,0.2)'; el.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.04)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{c.name}</div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(66,165,245,0.6)', background: 'rgba(66,165,245,0.08)', border: '1px solid rgba(66,165,245,0.12)', padding: '3px 8px', borderRadius: 6 }}>{c.code}</div>
                </div>
                <div style={{ fontFamily: 'DM Mono', fontSize: 34, fontWeight: 500, color: 'white', letterSpacing: '-0.02em' }}>{r.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 12, color: r.isUp ? 'var(--green)' : 'var(--red)' }}>{r.chg}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28, marginTop: 14 }}>
                  {r.bars.map((h, i) => (
                    <div key={i} style={{
                      flex: 1, borderRadius: '2px 2px 0 0',
                      background: i === r.bars.length - 1 ? 'var(--brand-sky)' : 'rgba(66,165,245,0.2)',
                      height: `${h}%`, transition: 'height 0.6s ease',
                    }} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
