'use client'

import { useLayoutEffect, useRef } from 'react'
import { useScrollTo } from '@/context/ScrollSmootherContext'
import { getContactScrollOffset } from '@/lib/scroll-targets'
import { useIntro } from '@/context/IntroContext'
import { HeroCanvas } from '@/components/HeroCanvas'
import { buildChrHoverElement } from '@/lib/i18n'
import {
  registerGsapPlugins,
  gsap,
  useGSAP,
} from '@/lib/gsap/register'

const NAV_TARGETS: Record<string, string> = {
  WORK: '#projects',
  INFO: '#about',
  CONTACT: '#contact',
}

const SOCIAL_LINKS = {
  BEHANCE: 'https://www.behance.net/',
  LINKEDIN: 'https://www.linkedin.com/',
  GITHUB: 'https://github.com/',
} as const

const SOCIAL_LABELS = ['BEHANCE', 'LINKEDIN', 'GITHUB'] as const
const NAV_LABELS = ['WORK', 'INFO', 'CONTACT'] as const

const heroChromeStyle = {
  fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: 'rgba(240, 240, 240, 0.7)',
}

function mountChrHover(scope: ParentNode) {
  scope.querySelectorAll<HTMLElement>('.chr-hover[data-chr]').forEach((el) => {
    const text = el.getAttribute('data-chr')
    if (!text) return
    el.replaceChildren(buildChrHoverElement(text))
  })
}

function revealHeroChrHover(scope: ParentNode) {
  gsap.set(scope.querySelectorAll('.chr-hover .ch-top'), {
    clipPath: 'inset(0 0 0 0)',
  })
}

export function HeroSection() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const scrollTo = useScrollTo()
  const { introComplete } = useIntro()

  useGSAP(
    () => {
      registerGsapPlugins()
      const shouldSkipIntro =
        !!sessionStorage.getItem('index-return-fade') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (introComplete || shouldSkipIntro) return
      gsap.set('#hero-tagline, #hero-bar', { opacity: 0, clipPath: 'inset(0 0 100% 0)' })
      gsap.set('#hero-line', { scaleX: 0, transformOrigin: 'left center' })
    },
    { scope: scopeRef, dependencies: [introComplete] },
  )

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    registerGsapPlugins()
    mountChrHover(scope)

    const chrHoverTl = gsap.timeline({ paused: true })
    scope.querySelectorAll('.chr-hover').forEach((el, elIdx) => {
      el.querySelectorAll('.ch-top').forEach((ch, i) => {
        const pos = elIdx * 0.08 + i * 0.03
        chrHoverTl.fromTo(
          ch,
          { clipPath: 'inset(100% 0 0 0)', immediateRender: false },
          { clipPath: 'inset(0 0 0 0)', duration: 0.7, ease: 'power3.out' },
          pos,
        )
      })
    })

    const playChrHover = () => chrHoverTl.play()

    if (introComplete) {
      revealHeroChrHover(scope)
    } else {
      window.addEventListener('intro-complete', playChrHover, { once: true })
    }

    return () => window.removeEventListener('intro-complete', playChrHover)
  }, [introComplete])

  const handleNavClick = (label: string) => {
    const target = NAV_TARGETS[label]
    if (target) {
      scrollTo(target, label === 'CONTACT' ? getContactScrollOffset() : 0)
    }
  }

  return (
    <div ref={scopeRef}>
      <div id="scroll-wrap" style={{ height: '400vh', position: 'relative' }}>
        <section
          id="hero"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            width: '100%',
            opacity: 0,
            backgroundColor: '#0a0a0a',
            zIndex: 10,
          }}
        >
          <h1 className="sr-only">Retina Ads — AI driven ad agency.</h1>

          <div
            id="hero-canvas"
            style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%' }}
          />
          <HeroCanvas />

          <div
            id="hero-tagline"
            style={{
              position: 'absolute',
              top: 'clamp(24px, 3.3vw, 48px)',
              left: 'clamp(16px, 3.3vw, 48px)',
              maxWidth: '448px',
              fontFamily: 'Breton, sans-serif',
              fontSize: '13.6px',
              lineHeight: '23.12px',
              letterSpacing: '0.136px',
              color: '#f0f0f0',
              zIndex: 1,
            }}
          >
            Augmented creativity, <em className="other-accent">preserved budgets</em>. Premium GSAP
            landing pages, AI video ads, and n8n workflows.
          </div>

          <div
            id="hero-line"
            style={{
              position: 'absolute',
              bottom: '92.8px',
              left: 'clamp(16px, 3.3vw, 48px)',
              right: 'clamp(16px, 3.3vw, 48px)',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.5)',
              zIndex: 1,
            }}
          />

          <div
            id="hero-bar"
            style={{
              position: 'absolute',
              bottom: '48px',
              left: 'clamp(16px, 3.3vw, 48px)',
              right: 'clamp(16px, 3.3vw, 48px)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              height: '22px',
              zIndex: 2,
              pointerEvents: 'auto',
            }}
          >
            <div className="hero-bar-left chr-hover" data-chr="→ V3.0" style={heroChromeStyle} />

            <nav
              className="hero-bar-center"
              style={{
                ...heroChromeStyle,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              aria-label="Social links"
            >
              {SOCIAL_LABELS.map((label, index) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  <a
                    href={SOCIAL_LINKS[label]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chr-hover"
                    data-chr={label}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  />
                </span>
              ))}
            </nav>

            <nav
              className="hero-bar-right"
              style={{
                ...heroChromeStyle,
                display: 'flex',
                gap: '24px',
              }}
              aria-label="Navigation"
            >
              {NAV_LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="chr-hover"
                  data-chr={label}
                  onClick={() => handleNavClick(label)}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    letterSpacing: 'inherit',
                    textTransform: 'inherit',
                    color: 'inherit',
                  }}
                />
              ))}
            </nav>
          </div>
        </section>
      </div>
    </div>
  )
}
