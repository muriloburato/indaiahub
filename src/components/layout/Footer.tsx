import Link from 'next/link'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        {/* Top */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
  <img src="/logo-indaia.png" alt="INDAIA" style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)' }} /> 
</div>
            <p className={styles.tagline}>
              Despacho Aduaneiro & Comércio Exterior<br />
              Santos, SP — desde 1966
            </p>
            <div className={styles.socials}>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener" className={styles.socialLink} aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/indaialogistica" target="_blank" rel="noopener" className={styles.socialLink} aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/551332898000" target="_blank" rel="noopener" className={styles.socialLink} aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.cols}>
            <div className={styles.col}>
              <div className={styles.colTitle}>Serviços</div>
              {['Gerenciamento de Processos', 'Desembaraço Aduaneiro', 'Logística Internacional', 'Transportation Management', 'Drawback & OEA', 'Habilitação RADAR'].map(s => (
                <Link key={s} href="/servicos" className={styles.colLink}>{s}</Link>
              ))}
            </div>

            <div className={styles.col}>
              <div className={styles.colTitle}>Ferramentas</div>
              {[
                ['Simulador de DI', '/ferramentas#simulador'],
                ['Comparador Incoterms', '/ferramentas#incoterms'],
                ['Checklist Documental', '/ferramentas#checklist'],
                ['Consulta NCM', '/ferramentas#ncm'],
                ['Cotações PTAX', '/cotacoes'],
                ['Status dos Portos', '/cotacoes#portos'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className={styles.colLink}>{label}</Link>
              ))}
            </div>

            <div className={styles.col}>
              <div className={styles.colTitle}>Empresa</div>
              {[
                ['Quem Somos', '/sobre'],
                ['Notícias COMEX', '/noticias'],
                ['Área do Cliente', 'https://www.myindaiaweb.com.br'],
                ['Power BI', 'https://app.powerbi.com'],
                ['App Mobile', 'https://app.myindaia.com.br'],
                ['Contato', '/contato'],
              ].map(([label, href]) => (
                <a key={label} href={href} className={styles.colLink} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">{label}</a>
              ))}
            </div>

            <div className={styles.col}>
              <div className={styles.colTitle}>Contato</div>

              {/* Endereço */}
              <div className={styles.contactItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:2}}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Rua XV de Novembro, 195<br />Centro — Santos, SP<br />CEP 11010-151</span>
              </div>

              {/* Telefone */}
              <div className={styles.contactItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:2}}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <a href="tel:+551332898000">+55 13 3289-8000</a>
              </div>

              {/* Email */}
              <div className={styles.contactItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:2}}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:contato@indaia.com.br">contato@indaia.com.br</a>
              </div>

              {/* Horário */}
              <div className={styles.contactItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginTop:2}}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Seg–Sex 08:00–18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span>© {year} INDAIA Assessoria em Comércio Exterior Ltda. CNPJ 00.000.000/0001-00</span>
          <div className={styles.bottomLinks}>
            <a href="#">Política de Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
