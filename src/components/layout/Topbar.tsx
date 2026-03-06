'use client'

import styles from './Topbar.module.css'

export function Topbar() {
  return (
    <div className={styles.topbar}>

      {/* Left: contact info */}
      <div className={styles.left}>
        <span className={styles.item}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Seg–Sex 08:00–18:00
        </span>
        <span className={styles.sep} />
        <span className={styles.item}>
          <a href="mailto:contato@indaia.com.br">contato@indaia.com.br</a>
        </span>
        <span className={styles.sep} />
        <span className={styles.item}>
          <a href="tel:+551332898000">+55 13 3289-8000</a>
        </span>
      </div>

      {/* Right: social links */}
      <div className={styles.right}>
        <a
          href="https://www.instagram.com/indaialogistica/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Instagram"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
          </svg>
          <span>Instagram</span>
        </a>

        <span className={styles.sep} />

        <a
          href="https://br.linkedin.com/company/indai-log-sticainternacional"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="LinkedIn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          <span>LinkedIn</span>
        </a>
      </div>

    </div>
  )
}
