'use client'

import { useRef } from 'react'
import { useIntro } from '@/context/IntroContext'
import {
  registerGsapPlugins,
  gsap,
  ScrollTrigger,
  useGSAP,
  SCROLL_REFRESH_PRIORITY,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'
import { createHeroSequencePlayer, REVEAL_FRAME_TIMELINE } from '@/lib/heroSequence'

export function RevealLayer() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { introComplete } = useIntro()

  useGSAP(
    () => {
      if (!introComplete) return

      let cancelled = false
      let triggers: ScrollTrigger[] = []
      let sequencePlayer: ReturnType<typeof createHeroSequencePlayer> | null = null

      const setup = async () => {
        if (cancelled) return

        registerGsapPlugins()

        const revealWrap = scopeRef.current
        const canvas = canvasRef.current
        const phraseEl = document.getElementById('reveal-phrase')
        const revealOverlay = document.getElementById('reveal-overlay')
        const scrollWrap = document.getElementById('scroll-wrap')
        const sectionAfter = document.getElementById('section-after')
        const nameLayer = document.getElementById('name-layer')
        const pContent = document.getElementById('preloader-content')
        const pLogo = document.getElementById('preloader-logo')
        const pLuke = document.getElementById('preloader-luke')
        const pBaffait = document.getElementById('preloader-baffait')
        const pDot = document.getElementById('preloader-dot')

        if (!revealWrap || !canvas || !phraseEl || !scrollWrap || !sectionAfter) {
          requestAnimationFrame(() => {
            void setup()
          })
          return
        }

        const isMobile = window.innerWidth <= 768
        const revealSeq = revealWrap.querySelectorAll('.reveal-seq')
        const phraseChars = phraseEl.querySelectorAll('.rp-char')

        gsap.set(revealWrap, { opacity: 0, y: 0 })
        gsap.set([pLogo, pLuke, pBaffait, pDot].filter(Boolean), { x: 0, opacity: 1 })
        if (nameLayer) gsap.set(nameLayer, { autoAlpha: 1 })
        gsap.set(phraseChars, isMobile ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' })

        sequencePlayer = createHeroSequencePlayer(canvas, { isMobile })
        const loaded = await sequencePlayer.load()
        if (cancelled) {
          sequencePlayer.destroy()
          return
        }
        if (!loaded) {
          console.error('No hero sequence frames loaded')
          sequencePlayer.destroy()
          return
        }

        const { phaseStart, phaseDuration, progressAtExitStart } = REVEAL_FRAME_TIMELINE
        const drawFrameAtProgress = (progress: number) => {
          sequencePlayer?.drawFrameAtProgress(progress)
        }

        const scrollTl = gsap.timeline({ paused: true })

        if (pContent) {
          const settledX = Number(gsap.getProperty(pContent, 'x') ?? 0)
          const settledY = Number(gsap.getProperty(pContent, 'y') ?? 0)
          scrollTl.fromTo(
            pContent,
            { x: settledX, y: settledY },
            { x: settledX, y: settledY, duration: 0.3, ease: 'none' },
            0,
          )
        }
        scrollTl.fromTo('#hero-tagline', { opacity: 1 }, { opacity: 0, duration: 0.15, ease: 'none' }, 0)
        scrollTl.fromTo('#hero-bar', { opacity: 1 }, { opacity: 0, duration: 0.15, ease: 'none' }, 0)
        scrollTl.fromTo('#hero-line', { opacity: 1 }, { opacity: 0, duration: 0.15, ease: 'none' }, 0)
        scrollTl.fromTo(revealWrap, { opacity: 0 }, { opacity: 1, duration: 0.01 }, phaseStart)
        scrollTl.fromTo(revealSeq, { scale: 0 }, { scale: 1, duration: phaseDuration, ease: 'none' }, phaseStart)

        const exitLeft = isMobile ? '-35vw' : '-55vw'
        const exitRight = isMobile ? '35vw' : '55vw'
        if (pLogo) {
          scrollTl.fromTo(pLogo, { x: '0vw', opacity: 1 }, { x: exitLeft, opacity: 0, duration: 0.7, ease: 'none' }, phaseStart)
        }
        if (pLuke) {
          scrollTl.fromTo(pLuke, { x: '0vw', opacity: 1 }, { x: exitLeft, opacity: 0, duration: 0.7, ease: 'none' }, phaseStart)
        }
        if (pBaffait) {
          scrollTl.fromTo(pBaffait, { x: '0vw', opacity: 1 }, { x: exitRight, opacity: 0, duration: 0.7, ease: 'none' }, phaseStart)
        }
        if (pDot) {
          scrollTl.fromTo(pDot, { x: '0vw', opacity: 1 }, { x: exitRight, opacity: 0, duration: 0.7, ease: 'none' }, phaseStart)
        }
        if (nameLayer) scrollTl.set(nameLayer, { autoAlpha: 0 }, 0.98)

        scrollTl.to(
          phraseChars,
          {
            opacity: 1,
            ...(isMobile ? {} : { filter: 'blur(0px)' }),
            duration: 0.06,
            ease: 'none',
            stagger: { each: 0.007, from: 'start' },
          },
          0.62,
        )

        triggers.push(
          ScrollTrigger.create({
            trigger: scrollWrap,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            animation: scrollTl,
            refreshPriority: SCROLL_REFRESH_PRIORITY.hero,
            ...scrollTriggerDefaults,
            onUpdate: (self) => {
              const p = self.progress
              if (p < phaseStart) {
                drawFrameAtProgress(0)
                return
              }
              const phase2 = Math.min(1, Math.max(0, (p - phaseStart) / phaseDuration))
              drawFrameAtProgress(phase2 * progressAtExitStart)
            },
          }),
        )

        const exitTl = gsap.timeline({ paused: true })
        exitTl.to(revealWrap, { y: '-50vh', ease: 'none', duration: 1 }, 0)
        if (revealOverlay) {
          exitTl.to(revealOverlay, { opacity: 0.7, ease: 'none', duration: 0.66 }, 0)
          if (
            !isMobile &&
            (CSS.supports('backdrop-filter', 'blur(1px)') ||
              CSS.supports('-webkit-backdrop-filter', 'blur(1px)'))
          ) {
            gsap.set(revealOverlay, { backdropFilter: 'blur(0px)' })
            exitTl.to(revealOverlay, { backdropFilter: 'blur(16px)', ease: 'none', duration: 1 }, 0)
          }
        }

        const phraseExitTl = gsap.timeline({ paused: true })
        phraseExitTl.to(phraseChars, {
          opacity: 0,
          duration: 0.2,
          ease: 'none',
          stagger: { each: 0.01, from: 'end' },
        })

        triggers.push(
          ScrollTrigger.create({
            trigger: sectionAfter,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            animation: phraseExitTl,
            refreshPriority: SCROLL_REFRESH_PRIORITY.about,
            ...scrollTriggerDefaults,
          }),
        )

        triggers.push(
          ScrollTrigger.create({
            trigger: sectionAfter,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            animation: exitTl,
            refreshPriority: SCROLL_REFRESH_PRIORITY.about,
            ...scrollTriggerDefaults,
            onUpdate: (self) => {
              const exitFrameProgress =
                progressAtExitStart + self.progress * (1 - progressAtExitStart)
              drawFrameAtProgress(exitFrameProgress)
            },
            onLeave: () => drawFrameAtProgress(1),
            onLeaveBack: () => drawFrameAtProgress(progressAtExitStart),
          }),
        )

        triggers.push(
          ScrollTrigger.create({
            trigger: sectionAfter,
            start: 'top 95%',
            refreshPriority: SCROLL_REFRESH_PRIORITY.about,
            ...scrollTriggerDefaults,
            onEnter: () => {
              gsap.set(revealWrap, { opacity: 0, y: '-50vh', pointerEvents: 'none' })
            },
            onLeaveBack: () => {
              gsap.set(revealWrap, { y: 0, pointerEvents: 'none' })
            },
          }),
        )

        ScrollTrigger.refresh()
      }

      void setup()

      return () => {
        cancelled = true
        triggers.forEach((trigger) => trigger.kill())
        triggers = []
        sequencePlayer?.destroy()
        sequencePlayer = null
      }
    },
    { scope: scopeRef, dependencies: [introComplete] },
  )

  return (
    <div ref={scopeRef} id="reveal-image-wrap">
      <canvas ref={canvasRef} className="reveal-image reveal-seq" id="reveal-canvas" />
      <div className="reveal-frame reveal-seq">
        <span className="reveal-corner tl" />
        <span className="reveal-corner tr" />
        <span className="reveal-corner bl" />
        <span className="reveal-corner br" />
      </div>
      <div id="reveal-overlay" />
      <p id="reveal-phrase">
        {[
          ...'Essentially, we generate your ads using AI.',
        ].map((ch, i) => (
          <span key={i} className="rp-char" style={{ display: 'inline-block' }}>
            {ch === ' ' ? '\u00a0' : ch}
          </span>
        ))}
      </p>
    </div>
  )
}
