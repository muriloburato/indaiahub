// ═══════════════════════════════════════════════
// INDAIA PORTAL — Static Data Constants
// ═══════════════════════════════════════════════

// ── Services (SVG strings for icon field) ─────
// Used in Services.tsx which renders them via dangerouslySetInnerHTML
// or as JSX in ServicesExplorer — for the card grid we use SVG strings
export const SERVICES = [
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="14" x2="11" y2="14"/></svg>`,
    name: 'Gerenciamento de Processos',
    desc: 'Gestão completa dos pedidos de importação e embarques de exportação com visibilidade em tempo real.',
    href: '#gerenciamento',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><path d="m9 12 2 2 4-4"/></svg>`,
    name: 'Desembaraço Aduaneiro',
    desc: '58 anos de experiência no desembaraço de grandes empresas em todos os portos e aeroportos do Brasil.',
    href: '#desembaraco',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    name: 'Logística Internacional',
    desc: 'Agenciamento de cargas, door-to-door internacional, transporte e coletas nacionais.',
    href: '#logistica',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    name: 'Transportation Management',
    desc: 'Time dedicado ao gerenciamento de transporte e logística de entrada e saída das operações.',
    href: '#transporte',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    name: 'Drawback & OEA',
    desc: 'Consultoria em regimes especiais, gestão de drawback e suporte aos processos de OEA dos clientes.',
    href: '#drawback',
  },
  {
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
    name: 'Habilitação RADAR',
    desc: 'Habilitação de pessoa física e jurídica junto à Receita Federal para iniciar importações e exportações.',
    href: '#radar',
  },
]

// ── Stats ──────────────────────────────────────
export const STATS = [
  { value: 18,  suffix: 'K+',   label: 'Processos ao ano' },
  { value: 58,  suffix: 'anos', label: 'De experiência em COMEX' },
  { value: 340, suffix: '+',    label: 'Clientes ativos' },
  { value: 99,  suffix: '%',    label: 'Taxa de aprovação DI' },
]

// ── Ports & Airports ──────────────────────────
export const LOCATIONS = [
  { id: 'santos',    name: 'Porto de Santos',    type: 'port' as const,    lat: -23.9535, lon: -46.3340 },
  { id: 'paranagua', name: 'Porto de Paranaguá', type: 'port' as const,    lat: -25.5016, lon: -48.5204 },
  { id: 'itajai',    name: 'Porto de Itajaí',    type: 'port' as const,    lat: -26.9078, lon: -48.6614 },
  { id: 'gru',       name: 'GRU — Cumbica',      type: 'airport' as const, lat: -23.4356, lon: -46.4731 },
  { id: 'gig',       name: 'GIG — Galeão',       type: 'airport' as const, lat: -22.8099, lon: -43.2505 },
  { id: 'vcp',       name: 'VCP — Viracopos',    type: 'airport' as const, lat: -23.0074, lon: -47.1345 },
]

// ── Incoterms — icon replaced with SVG key string ─
export interface IncoResp {
  icon: string  // SVG key: 'box' | 'truck' | 'doc' | 'ship' | 'shield' | 'customs'
  name: string
  who: 'buy' | 'sel'
}

export interface IncoData {
  desc: string
  resp: IncoResp[]
}

export const INCOTERMS: Record<string, IncoData> = {
  FOB: {
    desc: 'Vendedor entrega a mercadoria no porto de embarque. Frete e seguro internacional por conta do comprador.',
    resp: [
      { icon: 'box',     name: 'Embalagem e carga',              who: 'sel' },
      { icon: 'truck',   name: 'Transporte interno (origem)',     who: 'sel' },
      { icon: 'doc',     name: 'Despacho de exportação',         who: 'sel' },
      { icon: 'ship',    name: 'Frete marítimo/aéreo',           who: 'buy' },
      { icon: 'shield',  name: 'Seguro internacional',           who: 'buy' },
      { icon: 'customs', name: 'Despacho de importação',         who: 'buy' },
    ],
  },
  CIF: {
    desc: 'Vendedor paga o frete e seguro até o porto de destino. Comprador assume a partir do desembarque.',
    resp: [
      { icon: 'box',     name: 'Embalagem e carga',              who: 'sel' },
      { icon: 'truck',   name: 'Transporte interno (origem)',     who: 'sel' },
      { icon: 'doc',     name: 'Despacho de exportação',         who: 'sel' },
      { icon: 'ship',    name: 'Frete marítimo/aéreo',           who: 'sel' },
      { icon: 'shield',  name: 'Seguro internacional',           who: 'sel' },
      { icon: 'customs', name: 'Despacho de importação',         who: 'buy' },
    ],
  },
  EXW: {
    desc: 'Mínima responsabilidade do vendedor. Comprador assume todos os custos e riscos a partir da fábrica.',
    resp: [
      { icon: 'box',     name: 'Embalagem',                      who: 'sel' },
      { icon: 'truck',   name: 'Transporte interno (origem)',     who: 'buy' },
      { icon: 'doc',     name: 'Despacho de exportação',         who: 'buy' },
      { icon: 'ship',    name: 'Frete principal',                who: 'buy' },
      { icon: 'shield',  name: 'Seguro',                         who: 'buy' },
      { icon: 'customs', name: 'Despacho de importação',         who: 'buy' },
    ],
  },
  DDP: {
    desc: 'Máxima responsabilidade do vendedor. Entrega no destino final com impostos e desembaraço pagos.',
    resp: [
      { icon: 'box',     name: 'Embalagem',                      who: 'sel' },
      { icon: 'truck',   name: 'Transporte total',               who: 'sel' },
      { icon: 'doc',     name: 'Despacho de exportação',         who: 'sel' },
      { icon: 'ship',    name: 'Frete principal',                who: 'sel' },
      { icon: 'shield',  name: 'Seguro',                         who: 'sel' },
      { icon: 'customs', name: 'Despacho de importação + impostos', who: 'sel' },
    ],
  },
  CFR: {
    desc: 'Vendedor paga o frete, mas não o seguro. Risco transfere-se no embarque.',
    resp: [
      { icon: 'box',     name: 'Embalagem',                      who: 'sel' },
      { icon: 'ship',    name: 'Frete marítimo',                 who: 'sel' },
      { icon: 'shield',  name: 'Seguro',                         who: 'buy' },
      { icon: 'doc',     name: 'Despacho exportação',            who: 'sel' },
      { icon: 'customs', name: 'Despacho importação',            who: 'buy' },
    ],
  },
  DAP: {
    desc: 'Entregue no local acordado no destino, sem desembaraço de importação.',
    resp: [
      { icon: 'box',     name: 'Embalagem',                      who: 'sel' },
      { icon: 'ship',    name: 'Frete até destino',              who: 'sel' },
      { icon: 'shield',  name: 'Seguro',                         who: 'sel' },
      { icon: 'doc',     name: 'Despacho exportação',            who: 'sel' },
      { icon: 'customs', name: 'Desembaraço importação',         who: 'buy' },
    ],
  },
  FCA: {
    desc: 'Vendedor entrega ao transportador indicado pelo comprador no local de origem.',
    resp: [
      { icon: 'box',     name: 'Embalagem',                      who: 'sel' },
      { icon: 'doc',     name: 'Despacho exportação',            who: 'sel' },
      { icon: 'ship',    name: 'Frete principal',                who: 'buy' },
      { icon: 'shield',  name: 'Seguro',                         who: 'buy' },
      { icon: 'customs', name: 'Desembaraço importação',         who: 'buy' },
    ],
  },
  CPT: {
    desc: 'Vendedor paga frete até destino, mas risco passa ao comprador na entrega ao transportador.',
    resp: [
      { icon: 'box',     name: 'Embalagem',                      who: 'sel' },
      { icon: 'ship',    name: 'Frete até destino',              who: 'sel' },
      { icon: 'shield',  name: 'Seguro',                         who: 'buy' },
      { icon: 'doc',     name: 'Despacho exportação',            who: 'sel' },
      { icon: 'customs', name: 'Desembaraço importação',         who: 'buy' },
    ],
  },
}

// ── Checklist ──────────────────────────────────
export interface ChecklistItem {
  n: string
  r: 'ob' | 'op'
}

export interface ChecklistSection {
  title: string
  items: Record<string, ChecklistItem>
}

export const CHECKLIST_IMP: ChecklistSection[] = [
  {
    title: 'Documentos Comerciais',
    items: {
      invoice:     { n: 'Commercial Invoice',      r: 'ob' },
      packing:     { n: 'Packing List',            r: 'ob' },
      contrato:    { n: 'Contrato de Câmbio',       r: 'ob' },
      proforma:    { n: 'Proforma Invoice',         r: 'op' },
      catalogo:    { n: 'Catálogo Técnico',         r: 'op' },
    },
  },
  {
    title: 'Documentos de Transporte',
    items: {
      bl:          { n: 'Bill of Lading (BL)',      r: 'ob' },
      awb:         { n: 'Air Waybill (AWB)',        r: 'op' },
      ce:          { n: 'Conhecimento de Embarque', r: 'ob' },
    },
  },
  {
    title: 'Documentos Aduaneiros',
    items: {
      di:          { n: 'Declaração de Importação (DI)', r: 'ob' },
      li:          { n: 'Licença de Importação (LI)',    r: 'op' },
      laudo:       { n: 'Laudo Técnico',                 r: 'op' },
      certificado: { n: 'Certificado de Origem',         r: 'op' },
      seguro:      { n: 'Apólice de Seguro',             r: 'ob' },
    },
  },
]

export const CHECKLIST_EXP: ChecklistSection[] = [
  {
    title: 'Documentos Comerciais',
    items: {
      invoice:     { n: 'Commercial Invoice',      r: 'ob' },
      packing:     { n: 'Packing List',            r: 'ob' },
      contrato:    { n: 'Contrato de Câmbio',       r: 'op' },
    },
  },
  {
    title: 'Documentos de Exportação',
    items: {
      due:         { n: 'Declaração Única de Exportação (DUE)', r: 'ob' },
      re:          { n: 'Registro de Exportação (RE)',          r: 'ob' },
      origem:      { n: 'Certificado de Origem',                r: 'op' },
    },
  },
  {
    title: 'Documentos de Transporte',
    items: {
      bl:          { n: 'Bill of Lading (BL)',      r: 'ob' },
      booking:     { n: 'Booking Confirmation',     r: 'ob' },
    },
  },
]

// ── News ──────────────────────────────────────
export const NEWS = [
  {
    id: 1,
    icon: 'alert',
    category: 'Alerta Regulatório · Siscomex',
    title: 'Siscomex anuncia mudanças no tratamento de importações de produtos controlados pela DFPC a partir de março',
    date: '6 Mar 2025',
    readTime: '4 min',
    theme: 'blue' as const,
  },
  {
    id: 2,
    icon: 'chart',
    category: 'Mercado',
    title: 'Governo anuncia redução de II para produtos tecnológicos visando inovação',
    date: '27 Fev 2025',
    readTime: '3 min',
    theme: 'green' as const,
  },
  {
    id: 3,
    icon: 'doc',
    category: 'Importação',
    title: 'IN nº 015/2025 — Adesão do Ministério da Defesa ao NPI',
    date: '27 Fev 2025',
    readTime: '2 min',
    theme: 'yellow' as const,
  },
]

// ── Client Logos ──────────────────────────────
export const CLIENT_LOGOS = [
  'ambev', 'vale', 'braskem', 'embraer', 'natura',
  'gerdau', 'suzano', 'ultrapar', 'weg', 'marcopolo',
  'tupy', 'randon', 'iochpe', 'fras-le', 'schulz',
  'metal-leve', 'mahle', 'dana', 'eaton', 'parker',
]
