'use client'

import { useRef } from 'react'
import { useLenis } from '@/context/ScrollSmootherContext'
import {
  registerGsapPlugins,
  gsap,
  ScrollTrigger,
  useGSAP,
  SCROLL_REFRESH_PRIORITY,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'

const IMAGE_COUNT = 8
const galleryImages = [
  '/images/retina-gallery/gallery-1.png',
  '/images/retina-gallery/gallery-2.png',
  '/images/retina-gallery/gallery-3.png',
  '/images/retina-gallery/gallery-4.png',
  '/images/retina-gallery/gallery-5.png',
  '/images/retina-gallery/gallery-6.png',
  '/images/retina-gallery/gallery-7.png',
  '/images/retina-gallery/gallery-8.png',
]

export function CircleGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLParagraphElement>(null)
  const lenis = useLenis()

  useGSAP(
    () => {
      registerGsapPlugins()

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reducedMotion) {
        gsap.set('.cg-img', { opacity: 1 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3755',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: SCROLL_REFRESH_PRIORITY.gallery,
          ...scrollTriggerDefaults,
        },
      })

      tl.to(ringRef.current, { rotation: 270, ease: 'none' })
        .to(
          '.cg-img',
          { opacity: 1, stagger: 0.04, duration: 0.15, ease: 'power1.out' },
          0,
        )
        .fromTo(
          phraseRef.current,
          { scale: 0.96, opacity: 0.85 },
          { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' },
          0.1,
        )

      if (lenis) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          refreshPriority: SCROLL_REFRESH_PRIORITY.gallery,
          ...scrollTriggerDefaults,
          onEnter: () => {
            lenis.options.lerp = 0.04
          },
          onLeave: () => {
            lenis.options.lerp = 0.06
          },
          onEnterBack: () => {
            lenis.options.lerp = 0.04
          },
          onLeaveBack: () => {
            lenis.options.lerp = 0.06
          },
        })
      }
    },
    { scope: sectionRef, dependencies: [lenis] },
  )

  return (
    <section
      id="circle-gallery"
      ref={sectionRef}
      style={{
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 'var(--z-circle-gallery)' as unknown as number,
        minHeight: '100vh',
      }}
    >
      <div className="cg-stage">
        <div ref={ringRef} className="cg-ring">
          {galleryImages.map((src, i) => {
            const angle = (i / IMAGE_COUNT) * 360
            return (
              <div
                key={src}
                className="cg-img"
                style={{
                  transform: `rotate(${angle}deg) translateX(min(22vw, 320px)) rotate(-${angle}deg)`,
                }}
              >
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
              </div>
            )
          })}
        </div>

        <p ref={phraseRef} id="cg-phrase">
          Each campaign is designed to maximize your impact, automate your growth and divide your
          costs.
        </p>
      </div>
    </section>
  )
}
