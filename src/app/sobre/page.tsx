import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre a INDAIA — Despacho Aduaneiro desde 1966',
}

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--brand-deep)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brand-sky)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--brand-sky)' }} />
              Quem Somos
            </div>
            <h1 style={{ fontSize: 'clamp(36px,4vw,60px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
              58 anos conectando<br />o Brasil ao <span style={{ color: 'var(--brand-sky)' }}>mundo</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 460 }}>
              Fundada em 1966 em Santos, a INDAIA é uma das mais tradicionais empresas de despacho aduaneiro do Brasil.
              Com mais de 58 anos de história, atendemos mais de 340 clientes ativos, processando 18 mil operações por ano
              com excelência e transparência.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { n: '1966', label: 'Fundação em Santos, SP' },
              { n: '18K+', label: 'Processos por ano' },
              { n: '340+', label: 'Clientes ativos' },
              { n: '99%', label: 'Taxa de aprovação DI' },
            ].map(s => (
              <div key={s.n} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontFamily: 'DM Mono', fontSize: 32, fontWeight: 500, color: 'var(--brand-sky)', marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="sec" style={{ background: 'var(--bg)' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
            {[
              { icon: '🎯', title: 'Missão', desc: 'Ser a extensão do departamento de Comércio Exterior de nossos clientes, entregando excelência operacional, transparência e agilidade em cada processo.' },
              { icon: '👁️', title: 'Visão', desc: 'Ser reconhecida como a empresa de despacho aduaneiro mais inovadora e confiável do Brasil até 2030, expandindo nossa presença nos principais portos e aeroportos.' },
              { icon: '⭐', title: 'Valores', desc: 'Transparência, excelência técnica, relacionamento de longo prazo, inovação contínua e responsabilidade com nossos clientes, colaboradores e sociedade.' },
            ].map(v => (
              <div key={v.title} style={{ padding: 36, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 20 }}>{v.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>{v.title}</div>
                <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="sec" style={{ background: 'var(--bg-alt)' }}>
        <div className="wrap">
          <div className="sec-eye">Nossa História</div>
          <h2 className="sec-h">58 anos de <span>tradição</span></h2>

          <div style={{ marginTop: 52, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { year: '1966', title: 'Fundação em Santos', desc: 'A INDAIA é fundada em Santos, SP, com foco em despacho aduaneiro portuário.' },
              { year: '1985', title: 'Expansão para aeroportos', desc: 'Início das operações em GRU e GIG, ampliando o portfólio de serviços logísticos.' },
              { year: '2000', title: 'Digitalização dos processos', desc: 'Implementação de sistemas eletrônicos integrados ao Siscomex, pioneirismo no setor.' },
              { year: '2015', title: 'Lançamento do MyINDAIA', desc: 'Portal exclusivo para clientes com rastreamento em tempo real e Power BI integrado.' },
              { year: '2024', title: 'INDAIA Portal V9', desc: 'Novo portal institucional com ferramentas COMEX, cotações ao vivo e área do cliente.' },
            ].map((t, i) => (
              <div key={t.year} style={{ display: 'flex', gap: 40, padding: '28px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'DM Mono', fontSize: 22, fontWeight: 500, color: 'var(--brand-core)', width: 60, flexShrink: 0, paddingTop: 2 }}>{t.year}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.title}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
