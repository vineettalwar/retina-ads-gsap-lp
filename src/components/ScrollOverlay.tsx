'use client'

import { useRef } from 'react'
import { useIntro } from '@/context/IntroContext'
import { useScrollTo } from '@/context/ScrollSmootherContext'
import {
  registerGsapPlugins,
  gsap,
  ScrollTrigger,
  useGSAP,
  refreshScrollTriggers,
  SCROLL_REFRESH_PRIORITY,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'

const SECTION_DEFS = [
  { id: 'about', name: 'About' },
  { id: 'projects', name: 'Projects' },
  { id: 'circle-gallery', name: 'Gallery' },
  { id: 'skills', name: 'Skills' },
  { id: 'testimonials', name: 'Reviews' },
  { id: 'contact', name: 'Contact' },
]

function isMobileViewport() {
  return window.matchMedia('(max-width: 768px)').matches
}

export function ScrollOverlay() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const { introComplete } = useIntro()
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      if (!introComplete) return
      registerGsapPlugins()

      const timeline = scopeRef.current?.querySelector('#scroll-timeline') as HTMLElement | null
      const bar = barRef.current
      const label = scopeRef.current?.querySelector('#st-label') as HTMLElement | null
      const pctEl = scopeRef.current?.querySelector('#scroll-pct') as HTMLElement | null

      if (!timeline || !bar || !label || !pctEl) return

      const sections = SECTION_DEFS.filter((sec) => {
        if (sec.id === 'circle-gallery' && isMobileViewport()) return false
        return document.getElementById(sec.id)
      })

      if (!sections.length) return

      bar.innerHTML = ''

      const scrollY0 = window.scrollY || window.pageYOffset
      const firstEl = document.getElementById(sections[0].id)!
      const lastEl = document.getElementById(sections[sections.length - 1].id)!
      const zoneTop = firstEl.getBoundingClientRect().top + scrollY0
      const zoneBottom = lastEl.getBoundingClientRect().top + lastEl.offsetHeight + scrollY0
      const zoneH = zoneBottom - zoneTop

      const segEls: { seg: HTMLDivElement; fill: HTMLDivElement }[] = []

      const sectionData = sections.map((sec) => {
        const el = document.getElementById(sec.id)!
        const elTop = el.getBoundingClientRect().top + scrollY0
        const ratio = el.offsetHeight / zoneH
        return { ...sec, top: elTop, bottom: elTop + el.offsetHeight, ratio }
      })

      sectionData.forEach((sec) => {
        const seg = document.createElement('div')
        seg.className = 'st-seg'
        seg.style.flex = sec.ratio.toFixed(4)
        seg.title = sec.name

        const fill = document.createElement('div')
        fill.className = 'st-seg-fill'
        seg.appendChild(fill)
        bar.appendChild(seg)

        seg.addEventListener('click', () => scrollTo(`#${sec.id}`))
        segEls.push({ seg, fill })
      })

      ScrollTrigger.create({
        trigger: `#${sections[0].id}`,
        start: 'top bottom',
        endTrigger: `#${sections[sections.length - 1].id}`,
        end: 'bottom bottom',
        refreshPriority: SCROLL_REFRESH_PRIORITY.overlay,
        ...scrollTriggerDefaults,
        onUpdate: (self) => {
          const progress = self.progress
          const docH = document.documentElement.scrollHeight - window.innerHeight
          const pageP = docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0
          pctEl.textContent = `(${pageP})`

          if (progress <= 0 || progress >= 0.9) {
            timeline.classList.remove('visible')
            pctEl.classList.remove('visible')
            return
          }

          timeline.classList.add('visible')
          pctEl.classList.add('visible')

          let activeIdx = 0
          let cumul = 0

          for (let i = 0; i < sectionData.length; i++) {
            const segStart = cumul
            const segEnd = cumul + sectionData[i].ratio

            if (progress < segEnd) {
              const inner = (progress - segStart) / sectionData[i].ratio
              segEls[i].fill.style.height = `${(Math.min(1, Math.max(0, inner)) * 100).toFixed(1)}%`
              activeIdx = i
              for (let j = i + 1; j < sectionData.length; j++) {
                segEls[j].fill.style.height = '0%'
              }
              break
            }

            segEls[i].fill.style.height = '100%'
            cumul = segEnd
          }

          label.textContent = sectionData[activeIdx].name
          label.style.top = `${(progress * 100).toFixed(1)}%`
        },
      })

      refreshScrollTriggers()
    },
    { scope: scopeRef, dependencies: [introComplete] },
  )

  return (
    <div ref={scopeRef} aria-hidden="true">
      <div id="scroll-pct">(0)</div>
      <div id="scroll-timeline">
        <span id="st-label" />
        <div id="st-bar" ref={barRef} />
      </div>
    </div>
  )
}

export function WorkTransitionOverlay() {
  const { introComplete } = useIntro()

  useGSAP(() => {
    if (!introComplete) return
    registerGsapPlugins()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const resetWorkTransition = () => {
      gsap.set('#work-transition-overlay, #flying-title, #work-flying-text', {
        opacity: 0,
        y: 0,
      })
    }

    gsap
      .timeline({
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 75%',
          end: 'top 35%',
          scrub: 0.6,
          refreshPriority: SCROLL_REFRESH_PRIORITY.about,
          ...scrollTriggerDefaults,
          onLeave: resetWorkTransition,
          onLeaveBack: resetWorkTransition,
        },
      })
      .to('#work-transition-overlay', { opacity: 0.2, duration: 0.15 }, 0)
      .to('#flying-title', { opacity: 1, y: -20, duration: 0.25 }, 0.08)
      .to('#work-flying-text', { opacity: 0.8, y: 20, duration: 0.25 }, 0.12)
      .to(
        '#work-transition-overlay, #flying-title, #work-flying-text',
        { opacity: 0, y: 0, duration: 0.2 },
        0.65,
      )
  }, { dependencies: [introComplete] })

  return (
    <>
      <div id="work-transition-overlay" />
      <div id="flying-title">Work</div>
      <div id="work-flying-text">(10)</div>
    </>
  )
}

export function PageOverlays() {
  const { introComplete } = useIntro()

  useGSAP(() => {
    if (!introComplete) return
    registerGsapPlugins()

    gsap.to('#page-fade', {
      opacity: 0.15,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 40%',
        end: 'bottom top',
        scrub: 1,
        refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
        ...scrollTriggerDefaults,
      },
    })
  }, { dependencies: [introComplete] })

  return (
    <>
      <div id="contact-blob-wrap">
        <div id="contact-blob" />
      </div>
      <div id="page-fade" />
    </>
  )
}
