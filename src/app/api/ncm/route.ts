import { NextRequest, NextResponse } from 'next/server'

// Cache em memória para evitar múltiplas requisições à Siscomex
// A tabela NCM muda raramente — cache de 24h é seguro
let cache: { data: NcmItem[]; ts: number } | null = null
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas

export interface NcmItem {
  codigo: string        // ex: "8471.30.19"
  descricao: string     // descrição completa
  tipo: 'C' | 'A' | 'S' // C=capítulo, A=abertura, S=subposição/item
  // alíquotas do II via TEC (preenchidas quando disponíveis)
  ii?: number | null
  ipi?: number | null
}

// Tabela TEC resumida com alíquotas do II (Imposto de Importação)
// Fonte: Resolução CAMEX — alíquotas mais comuns por capítulo
// Usada como fallback quando a Siscomex não retorna tributos
const TEC_II: Record<string, number> = {
  '01': 10, '02': 10, '03': 10, '04': 16, '05': 5,
  '06': 8,  '07': 10, '08': 10, '09': 10, '10': 10,
  '11': 14, '12': 6,  '13': 8,  '14': 8,  '15': 14,
  '16': 16, '17': 16, '18': 16, '19': 16, '20': 16,
  '21': 16, '22': 20, '23': 8,  '24': 20, '25': 4,
  '26': 2,  '27': 0,  '28': 8,  '29': 8,  '30': 8,
  '31': 4,  '32': 8,  '33': 12, '34': 10, '35': 8,
  '36': 8,  '37': 8,  '38': 8,  '39': 14, '40': 14,
  '41': 8,  '42': 18, '43': 16, '44': 12, '45': 10,
  '46': 14, '47': 6,  '48': 12, '49': 0,  '50': 18,
  '51': 18, '52': 20, '53': 18, '54': 20, '55': 20,
  '56': 18, '57': 18, '58': 20, '59': 18, '60': 20,
  '61': 35, '62': 35, '63': 35, '64': 35, '65': 20,
  '66': 20, '67': 20, '68': 12, '69': 14, '70': 12,
  '71': 12, '72': 12, '73': 14, '74': 12, '75': 6,
  '76': 14, '78': 10, '79': 10, '80': 10, '81': 6,
  '82': 18, '83': 18, '84': 14, '85': 16, '86': 14,
  '87': 35, '88': 5,  '89': 14, '90': 14, '91': 20,
  '92': 20, '93': 20, '94': 20, '95': 20, '96': 20,
  '97': 8,
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') ?? '').trim()

    // Retornar cache se válido
    if (!cache || Date.now() - cache.ts > CACHE_TTL) {
      const res = await fetch(
        'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json?perfil=PUBLICO',
        {
          headers: { 'Accept': 'application/json' },
          // Next.js fetch cache — revalida a cada 24h no servidor
          next: { revalidate: 86400 },
        }
      )
      if (!res.ok) throw new Error(`Siscomex HTTP ${res.status}`)
      const json = await res.json()

      const raw: Array<{ Codigo: string; Descricao: string; Tipo: string }> = json.Nomenclaturas ?? []

      cache = {
        ts: Date.now(),
        data: raw.map(r => {
          const cap = r.Codigo.replace(/\D/g, '').slice(0, 2)
          return {
            codigo: r.Codigo,
            descricao: r.Descricao,
            tipo: (r.Tipo ?? 'S') as NcmItem['tipo'],
            ii: TEC_II[cap] ?? null,
          }
        }),
      }
    }

    // Busca por código ou descrição
    let results = cache.data
    if (q) {
      const isCode = /^[\d.]+$/.test(q)
      const ql = q.toLowerCase()
      const qDigits = q.replace(/\./g, '') // query sem pontos: "84713019"
      results = cache.data.filter(n =>
        isCode
          ? n.codigo.replace(/\./g, '').startsWith(qDigits) // compara dígitos puro vs dígitos puro
          : n.descricao.toLowerCase().includes(ql)
      ).slice(0, 80)
    } else {
      results = [] // não retornar a tabela inteira sem query
    }

    return NextResponse.json({ ok: true, total: results.length, items: results })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ ok: false, error: msg, items: [] }, { status: 500 })
  }
}
