'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  {
    label: 'Serviços',
    href: '/servicos',
    mega: true,
    cols: [
      {
        title: 'Importação',
        items: [
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            ),
            label: 'Gerenciamento de Processos', sub: 'DI, LI, parametrização', href: '/servicos#gerenciamento',
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
            label: 'Desembaraço Aduaneiro', sub: 'Todos os portos do Brasil', href: '/servicos#desembaraco',
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            ),
            label: 'Drawback & OEA', sub: 'Regimes especiais', href: '/servicos#drawback',
          },
        ],
      },
      {
        title: 'Exportação & Logística',
        items: [
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
            ),
            label: 'Logística Internacional', sub: 'Door-to-door, agenciamento', href: '/servicos#logistica',
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
            label: 'Transportation Management', sub: 'Transporte nacional', href: '/servicos#transporte',
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            ),
            label: 'Habilitação RADAR', sub: 'Receita Federal', href: '/servicos#radar',
          },
        ],
      },
    ],
  },
  {
    label: 'Ferramentas',
    href: '/ferramentas',
    items: [
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        ),
        label: 'Simulador de DI', sub: 'Calcule impostos de importação', href: '/ferramentas#simulador',
      },
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          </svg>
        ),
        label: 'Comparador Incoterms', sub: 'FOB, CIF, EXW e mais', href: '/ferramentas#incoterms',
      },
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        ),
        label: 'Checklist Documental', sub: 'Importação e exportação', href: '/ferramentas#checklist',
      },
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        ),
        label: 'Consulta NCM', sub: 'Alíquotas e tributação', href: '/ncm',
      },
    ],
  },
  {
    label: 'Câmbio & Operações',
    href: '/cotacoes',
    items: [
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        ),
        label: 'Câmbio ao Vivo', sub: 'USD, EUR, CNY — BCB PTAX', href: '/cotacoes#cambio',
      },
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        ),
        label: 'Tabela PTAX Mensal', sub: 'Histórico do Banco Central', href: '/cotacoes#ptax',
      },
      {
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
            <path d="M12 13a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
        ),
        label: 'Status dos Portos', sub: 'Condições meteorológicas', href: '/portos',
      },
    ],
  },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Sobre',    href: '/sobre' },
  { label: 'Contato',  href: '/contato' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleMobile = useCallback(() => setMobileOpen(p => !p), [])

  function handleEnter(label: string) {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setActiveMenu(label)
  }

  function handleLeave() {
    leaveTimer.current = setTimeout(() => setActiveMenu(null), 180)
  }

  return (
    <nav className={styles.nav}>
      {/* ── Logo ── */}
      <Link href="/" className={styles.logo}>
        <img
          src="/logo-indaia.png"
          alt="INDAIA Logística Internacional"
          className={styles.logoImg}
        />
      </Link>

      <div className={styles.div} />

      {/* ── Desktop links ── */}
      <ul className={styles.links}>
        {NAV_ITEMS.map(item => (
          <li
            key={item.label}
            className={styles.navItem}
            onMouseEnter={() => handleEnter(item.label)}
            onMouseLeave={handleLeave}
          >
            {item.items || item.cols ? (
              <>
                <button className={styles.navBtn}>
                  {item.label}
                  <svg className={styles.caret} width="8" height="5" viewBox="0 0 8 5" fill="none">
                    <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown */}
                <div className={`${styles.dropdown} ${item.mega ? styles.mega : ''} ${activeMenu === item.label ? styles.open : ''}`}>
                  {item.mega && item.cols ? (
                    <div className={styles.megaCols}>
                      {item.cols.map(col => (
                        <div key={col.title}>
                          <div className={styles.colTitle}>{col.title}</div>
                          {col.items.map(dd => (
                            <Link key={dd.label} href={dd.href} className={styles.ddItem}>
                              <div className={styles.ddIcon}>{dd.icon}</div>
                              <div>
                                <div className={styles.ddLabel}>{dd.label}</div>
                                <div className={styles.ddSub}>{dd.sub}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    item.items?.map(dd => (
                      <Link key={dd.label} href={dd.href} className={styles.ddItem}>
                        <div className={styles.ddIcon}>{dd.icon}</div>
                        <div>
                          <div className={styles.ddLabel}>{dd.label}</div>
                          <div className={styles.ddSub}>{dd.sub}</div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </>
            ) : (
              <Link href={item.href} className={styles.navLink}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>

      {/* ── Right controls ── */}
      <div className={styles.right}>
        {/* Área do Cliente */}
        <div
          className={styles.navItem}
          onMouseEnter={() => handleEnter('cliente')}
          onMouseLeave={handleLeave}
          style={{ position: 'relative' }}
        >
          <button className={styles.btnGhost}>
            Área do Cliente
            <svg style={{ marginLeft: 5, display: 'inline', verticalAlign: 'middle', transition: 'transform 0.2s', transform: activeMenu === 'cliente' ? 'rotate(180deg)' : 'none' }} width="8" height="5" viewBox="0 0 8 5" fill="none">
              <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={`${styles.dropdown} ${styles.clientDd} ${activeMenu === 'cliente' ? styles.open : ''}`}>
            <div className={styles.clientHead}>
              {/* Cadeado */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <div>
                <div className={styles.clientHeadTitle}>Área do Cliente INDAIA</div>
                <div className={styles.clientHeadSub}>Selecione a plataforma de acesso</div>
              </div>
            </div>
            {[
              {
                badge: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                ),
                cls: styles.clBlue,
                label: 'MyINDAIA Web',
                sub: 'Portal de processos e documentos',
                href: 'https://www.myindaiaweb.com.br/autentica.asp',
              },
              {
                badge: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                cls: styles.clYellow,
                label: 'Power BI — Dashboards',
                sub: 'Indicadores e relatórios gerenciais',
                href: 'https://app.powerbi.com',
              },
              {
                badge: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                ),
                cls: styles.clGreen,
                label: 'App Mobile',
                sub: 'iOS e Android',
                href: 'https://app.myindaia.com.br/',
              },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener" className={styles.clientLink}>
                <div className={`${styles.clientBadge} ${link.cls}`}>{link.badge}</div>
                <div>
                  <div className={styles.clientLinkLabel}>{link.label}</div>
                  <div className={styles.clientLinkSub}>{link.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <Link href="/contato" className={styles.btnFill}>
          Solicitar Cotação
        </Link>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={toggleMobile} aria-label="Menu">
          <span className={mobileOpen ? styles.barOpen1 : styles.bar} />
          <span className={mobileOpen ? styles.barOpen2 : styles.bar} />
          <span className={mobileOpen ? styles.barOpen3 : styles.bar} />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.mobileSep} />
          <a href="https://www.myindaiaweb.com.br" target="_blank" rel="noopener" className={styles.mobileLink}>
            MyINDAIA Web →
          </a>
          <Link href="/contato" className={styles.mobileCta} onClick={() => setMobileOpen(false)}>
            Solicitar Cotação
          </Link>
        </div>
      )}
    </nav>
  )
}
