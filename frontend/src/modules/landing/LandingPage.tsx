import { useNavigate } from '@tanstack/react-router'
import { LandingHeader } from './components/LandingHeader'
import { LandingFooter } from './components/LandingFooter'
import { HeroSection } from './sections/HeroSection'
import { CatalogPreviewSection } from './sections/CatalogPreviewSection'
import { PlansSection } from './sections/PlansSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { CtaSection } from './sections/CtaSection'

export function LandingPage() {
  const navigate = useNavigate()
  const goLogin = () => navigate({ to: '/login' })
  const goRegister = () => navigate({ to: '/register' })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(ellipse at 80% -20%, oklch(0.30 0.10 75) 0%, transparent 50%), radial-gradient(ellipse at 0% 80%, oklch(0.22 0.06 160) 0%, transparent 50%), var(--bg-0)',
      }}
    >
      <LandingHeader onLogin={goLogin} onRegister={goRegister} />
      <HeroSection onLogin={goLogin} onRegister={goRegister} />
      <CatalogPreviewSection />
      <PlansSection onRegister={goRegister} />
      <FeaturesSection />
      <CtaSection onRegister={goRegister} />
      <LandingFooter />
    </div>
  )
}
