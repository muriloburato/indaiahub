'use client'

import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      setDark(localStorage.getItem('indaia-theme') === 'dark')
    } catch {}
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    try { localStorage.setItem('indaia-theme', next ? 'dark' : 'light') } catch {}
  }

  return (
    <button className={styles.btn} onClick={toggle} aria-label="Alternar tema">
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
