import { HeroSection } from '@/components/HeroSection'
import { HeroTitleLayer } from '@/components/HeroTitleLayer'
import { IntroOverlay } from '@/components/IntroOverlay'
import { AboutSection } from '@/components/AboutSection'
import { CircleGallery } from '@/components/CircleGallery'
import { SkillsSection } from '@/components/SkillsSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { ContactSection } from '@/components/ContactSection'
import { FooterTransitionSection } from '@/components/FooterTransitionSection'
import { Footer } from '@/components/Footer'
import { LenisProvider } from '@/components/LenisProvider'
import { IntroProvider } from '@/context/IntroContext'
import { ProjectPreviewOverlay } from '@/components/ProjectPreviewOverlay'
import { RevealLayer } from '@/components/RevealLayer'
import { ContactFooterAnimations } from '@/components/ContactFooterAnimations'
import {
  ScrollOverlay,
  WorkTransitionOverlay,
  PageOverlays,
} from '@/components/ScrollOverlay'

export default function Home() {
  return (
    <IntroProvider>
      <LenisProvider>
        <ProjectPreviewOverlay>
          <IntroOverlay />
          <HeroTitleLayer />
          <Footer />
          <RevealLayer />

          <div id="main-content">
            <HeroSection />
            <AboutSection />
            <CircleGallery />
            <SkillsSection />
            <TestimonialsSection />
            <ContactSection />
            <FooterTransitionSection />
          </div>

          <WorkTransitionOverlay />
          <ScrollOverlay />
          <PageOverlays />
          <ContactFooterAnimations />
        </ProjectPreviewOverlay>
      </LenisProvider>
    </IntroProvider>
  )
}
