'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('indaia-theme')
      if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        // Garante que o tema claro é aplicado corretamente,
        // removendo qualquer data-theme residual (ex: vindo do NCM ou SSR)
        document.documentElement.removeAttribute('data-theme')
      }
    } catch {}
  }, [])

  return <>{children}</>
}
