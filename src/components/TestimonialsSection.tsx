'use client'

import { useRef } from 'react'
import type { TestimonialCard } from '@/types'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import {
  registerGsapPlugins,
  gsap,
  useGSAP,
  SCROLL_REFRESH_PRIORITY,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'

const row1Cards: TestimonialCard[] = [
  { stars: '★★★★★', rating: '5.0', name: 'Sarah Jenkins', role: 'CEO, Bloom & Glow E-com', quote: '"Retina Ads completely transformed our digital presence. Their immersive GSAP-powered landing page looks like it is worth a million dollars and loads instantly, while their AI video ads outperformed our standard creative assets by 40%. Pure magic."' },
  { stars: '★★★★½', rating: '4.5', name: 'Marc Dubois', role: 'Founder, Café Joyeux', quote: '"Great experience! Retina Ads built a custom backend app for our logistics and beautiful product imagery for our coffee brand. It\'s super fast, robust, and completely revolutionized our daily operations."' },
  { stars: '★★★★☆', rating: '4.0', name: 'Dave K.', role: 'Growth Lead, SneakerDrop', quote: '"The GSAP-powered interactive sneaker page they built for us feels like a million bucks. Shoes float in 3D as you scroll, and our conversion rate is now higher than my daily caffeine intake. Simply brilliant."' },
  { stars: '★★★★★', rating: '5.0', name: 'Sophie Martin', role: 'Director, Maison Green', quote: '"The custom full-stack web application developed by Retina Ads, paired with Google Omni AI video ads, is a game-changer. Our customer acquisition cost dropped by 35% and the system runs autonomously."' },
  { stars: '★★★★½', rating: '4.5', name: 'Alex Rivera', role: 'Founder, HydrateNow', quote: '"Our new GSAP one-pager looks insanely premium—like a million-dollar site, honestly. Plus, their backend dashboard helps us track every single order effortlessly. Excellent engineering team."' },
  { stars: '★★★★★', rating: '5.0', name: 'Chloé Bernard', role: 'Creator, Bijoux Célestes', quote: '"I asked for a simple store but got a GSAP-powered masterpiece that literally makes jewelry sparkle on screen! My conversion rate is up 60%. I think the website is now worth more than my actual stock!"' },
  { stars: '★★★★☆', rating: '4.0', name: 'Liam Patel', role: 'Operations, EcoClean Co.', quote: '"Bespoke n8n workflows integrated into a custom frontend client dashboard built by Retina Ads. Excellent service, clean code, and our customer onboarding is now 100% automated."' },
  { stars: '★★★★½', rating: '4.5', name: 'Marie Dubois', role: 'Founder, E-com Seller', quote: '"Top-tier product visuals and a stunning GSAP landing page. We finally have a million-dollar brand image without spending our entire annual budget. Truly highly recommended."' },
  { stars: '★★★½☆', rating: '3.5', name: 'Jack Thornton', role: 'CEO, FitFuel DTC', quote: '"Our last dev agency took months for a basic React app. Retina Ads built a high-performance GSAP page and robust backend in 10 days. The design looks so rich I felt underdressed browsing it."' },
]

const row2Cards: TestimonialCard[] = [
  { stars: '★★★★★', rating: '5.0', name: 'Emilie Roux', role: 'Digital Director', quote: '"The Google Omni model combined with Retina Ads\' full-stack web development revolutionized our client acquisition. Our animated GSAP web experiences run continuously and generate high-quality leads."' },
  { stars: '★★★★½', rating: '4.5', name: 'Tariq Al-Mansoor', role: 'CTO, Fintech Startup', quote: '"Super fast turnarounds on both our backend API and high-end frontend layout. The GSAP transitions are smooth as butter. Customer support is top-notch and always available."' },
  { stars: '★★★★★', rating: '5.0', name: 'Lucie Petit', role: 'CMO, Fashion Brand', quote: '"A GSAP landing page so stunningly interactive that I spent 20 minutes just playing with the scroll animations. Sales skyrocketed instantly. My boss thinks we paid a million dollars for this!"' },
  { stars: '★★★★☆', rating: '4.0', name: 'Marcus V.', role: 'Founder, WatchCraft', quote: '"Their high-end GSAP landing page for our luxury watches is a masterpiece. The smooth kinetic animations give the brand a premium feel that is easily worth a million dollars, boosting our sales instantly."' },
  { stars: '★★★★½', rating: '4.5', name: 'Nico & Claire', role: 'Co-founders, ToyWorld', quote: '"We needed a playful GSAP-animated page for our new toy collection and a simple backend registry. Retina Ads delivered beautiful, colorful designs that matched our brand vibe perfectly within days."' },
  { stars: '★★★★★', rating: '5.0', name: 'Samir Benali', role: 'Operations Lead', quote: '"They delivered a custom backend application integrated with n8n that completely automates our order routing. It works on its own while our GSAP landing page closes deals. Pure magic."' },
  { stars: '★★★★★', rating: '5.0', name: 'Isabella Rossi', role: 'Brand Director', quote: '"An incredible GSAP interactive showcase linked to a powerful backend app. Retina Ads combined elite web development with Google Omni AI video creatives to double our DTC brand conversion rate in weeks."' },
  { stars: '★★★½☆', rating: '3.5', name: 'Olivier G.', role: 'E-commerce Manager', quote: '"A fast and robust full-stack dashboard connected to our storefront. Combined with high-converting AI ads and a beautiful GSAP landing page, we have scaled our operations seamlessly."' },
]

function Card({ card }: { card: TestimonialCard }) {
  const initials = card.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
  return (
    <div
      style={{
        backgroundColor: 'rgba(14,14,14,0.45)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: '28.8px',
        width: 380,
        minHeight: 380,
        flexShrink: 0,
        marginRight: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18, color: '#f0f0f0' }}>{card.stars}</span>
        <span style={{ fontSize: 13, color: 'rgba(240,240,240,0.5)' }}>{card.rating}</span>
      </div>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          lineHeight: 1.65,
          color: 'rgba(240,240,240,0.85)',
          flexGrow: 1,
          margin: 0,
        }}
      >
        {card.quote}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(124,60,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#f0f0f0',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f0f0' }}>{card.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(240,240,240,0.5)' }}>{card.role}</div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ cards, direction }: { cards: TestimonialCard[]; direction: 'left' | 'right' }) {
  const doubled = [...cards, ...cards]
  return (
    <div className={`testimonials-marquee marquee-row marquee-${direction}`} style={{ overflow: 'hidden', width: '100%' }}>
      <div className={`marquee-track marquee-track--${direction}`} style={{ display: 'flex', flexDirection: 'row', width: 'max-content' }}>
        {doubled.map((card, i) => (
          <Card key={`${card.name}-${i}`} card={card} />
        ))}
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollReveal(sectionRef, { selector: '.testimonials-reveal' })

  useGSAP(
    () => {
      registerGsapPlugins()
      gsap.from('.testimonials-marquee-wrap', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
          refreshPriority: SCROLL_REFRESH_PRIORITY.testimonials,
          ...scrollTriggerDefaults,
        },
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 'var(--z-skills)' as unknown as number,
        paddingTop: 'clamp(64px, 7.8vw, 112px)',
        paddingBottom: 'clamp(64px, 7.8vw, 112px)',
      }}
    >
      <div className="testimonials-inner">
        <div className="testimonials-header testimonials-reveal reveal-hidden" style={{ paddingLeft: 'clamp(24px, 4.4vw, 64px)', marginBottom: 48 }}>
          <div
            className="testimonials-subtitle"
            style={{
              fontFamily: 'Breton, sans-serif',
              fontSize: 19.2,
              fontWeight: 300,
              letterSpacing: '-0.384px',
              lineHeight: '23.04px',
              color: '#f0f0f0',
              marginBottom: 24,
            }}
          >
            Reviews
          </div>
          <div
            className="testimonials-title"
            style={{
              fontFamily: 'Zirena, sans-serif',
              fontSize: 'clamp(26px, 3vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#f0f0f0',
            }}
          >
            What our partners say about us.
          </div>
        </div>

        <div
          className="testimonials-marquee-wrap"
          style={{ display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 32, paddingBottom: 32 }}
        >
          <MarqueeRow cards={row1Cards} direction="left" />
          <MarqueeRow cards={row2Cards} direction="right" />
        </div>
      </div>
    </section>
  )
}
