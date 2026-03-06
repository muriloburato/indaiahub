import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Topbar } from '@/components/layout/Topbar'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  title: 'INDAIA — Despacho Aduaneiro & Comércio Exterior',
  description: 'A extensão do seu departamento de COMEX. 58 anos de experiência em desembaraço aduaneiro, importação e exportação em Santos, SP.',
  keywords: 'despacho aduaneiro, importação, exportação, COMEX, Santos, drawback, OEA, RADAR',
  openGraph: {
    title: 'INDAIA — Despacho Aduaneiro & Comércio Exterior',
    description: 'A extensão do seu departamento de COMEX.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Topbar />
          <Navbar />
          <main style={{ paddingTop: 'var(--total-h)' }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
