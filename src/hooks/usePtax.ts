'use client'

import { useState, useCallback } from 'react'

export interface PtaxRow {
  date: string
  time: string
  tipo: string
  compra: number
  venda: number
  change: number | null
  isUp: boolean
}

export function usePtax() {
  const [rows, setRows] = useState<PtaxRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (month: number, year: number) => {
    setLoading(true)
    setError(null)

    try {
      const pad = (n: number) => String(n).padStart(2, '0')
      
      // O mês deve ser de 1 a 12. Se vier do JS (0-11), some 1.
      const m = Number(month)
      const y = Number(year)
      const lastDay = new Date(y, m, 0).getDate()
      
      const dtIni = `${pad(m)}-01-${y}`
      const dtFim = `${pad(m)}-${pad(lastDay)}-${y}`

      // MONTAGEM DA URL:
      // 1. Usamos aspas simples literais. 
      // 2. Não usamos encodeURIComponent na URL inteira.
      // 3. Removemos espaços e quebras de linha.
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${dtIni}'&@dataFinalCotacao='${dtFim}'&$format=json`

      console.log("URL de busca:", url)

      const res = await fetch(url)
      
      if (!res.ok) {
        // Tenta capturar o erro exato do OData
        const errorData = await res.json().catch(() => ({}))
        const detail = errorData['odata.error']?.message?.value || "Sintaxe Inválida"
        throw new Error(`BCB: ${detail}`)
      }

      const data = await res.json()
      const raw = data.value || []

      if (raw.length === 0) {
        setError(`Nenhum dado encontrado para ${pad(m)}/${y}.`)
        return
      }

      // Processamento: Mantém apenas o último boletim de cada dia (geralmente Fechamento)
      const byDate: Record<string, any> = {}
      raw.forEach((r: any) => {
        const dt = r.dataHoraCotacao.slice(0, 10)
        // Se houver mais de um boletim no dia, o último (ou o 'Fechamento') prevalece
        if (!byDate[dt] || r.tipoBoletim === 'Fechamento') {
          byDate[dt] = r
        }
      })

      const sortedDates = Object.keys(byDate).sort()
      const result: PtaxRow[] = sortedDates.map((dt, i) => {
        const r = byDate[dt]
        const prev = i > 0 ? byDate[sortedDates[i - 1]] : null
        const change = prev ? ((r.cotacaoVenda - prev.cotacaoVenda) / prev.cotacaoVenda) * 100 : null
        
        return {
          date: dt.split('-').reverse().join('/'),
          time: r.dataHoraCotacao.slice(11, 16),
          tipo: r.tipoBoletim,
          compra: r.cotacaoCompra,
          venda: r.cotacaoVenda,
          change,
          isUp: (change ?? 0) >= 0,
        }
      })

      setRows(result)
    } catch (e: any) {
      console.error("Erro na chamada:", e.message)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { rows, loading, error, fetch: fetchData }
}