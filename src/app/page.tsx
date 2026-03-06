import { Hero } from '@/components/home/Hero'
import { ServicesExplorer } from '@/components/home/ServicesExplorer'
import { StatsBand } from '@/components/home/StatsBand'
import { NewsSection } from '@/components/home/NewsSection'
import { LiveRates } from '@/components/cotacao/LiveRates'
import { QuoteForm } from '@/components/home/QuoteForm'
import { ClientLogos } from '@/components/home/ClientLogos'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <ServicesExplorer />
      <NewsSection />
      <LiveRates />
      <ClientLogos />
      <QuoteForm />
    </>
  )
}
