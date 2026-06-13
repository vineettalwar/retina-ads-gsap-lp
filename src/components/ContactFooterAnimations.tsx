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

const FOOTER_TRIGGER = {
  trigger: '#footer-transition',
  start: 'top bottom+=500',
  end: 'bottom bottom',
} as const

export function ContactFooterAnimations() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const { introComplete } = useIntro()

  useGSAP(
    () => {
      if (!introComplete) return
      registerGsapPlugins()

      const blobWrap = document.getElementById('contact-blob-wrap')
      const contactBg = document.getElementById('contact-bg')
      const blob = document.getElementById('contact-blob')
      const title = document.getElementById('contact-title')
      const socials = document.getElementById('contact-socials')
      const mailEl = document.getElementById('contact-mail')
      const dispo = document.getElementById('contact-dispo')
      const frame = document.getElementById('contact-frame')
      const frameImg = document.getElementById('contact-frame-img')
      const dispo2 = document.getElementById('contact-dispo-2')
      const frame2 = document.getElementById('contact-frame-2')
      const frameImg2 = document.getElementById('contact-frame-img-2')
      const stTimeline = document.getElementById('scroll-timeline')
      const pctEl = document.getElementById('scroll-pct')
      const footerEl = document.getElementById('footer')
      const revealWrap = document.getElementById('reveal-image-wrap')
      const contactPin = document.getElementById('contact-pin')
      const contactSection = document.getElementById('contact')

      if (!blob || !blobWrap || !title) return

      const setContactOverlay = (visible: boolean) => {
        blobWrap.style.visibility = visible ? 'visible' : 'hidden'
        if (contactBg) contactBg.style.display = visible ? 'block' : 'none'
        if (revealWrap) revealWrap.style.visibility = visible ? 'hidden' : 'visible'
      }

      setContactOverlay(false)

      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top bottom',
        endTrigger: '#footer-transition',
        end: 'bottom bottom',
        refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
        ...scrollTriggerDefaults,
        onEnter: () => setContactOverlay(true),
        onLeave: () => setContactOverlay(false),
        onLeaveBack: () => setContactOverlay(false),
        onEnterBack: () => setContactOverlay(true),
      })

      const frameY = () => window.innerHeight * 1.1
      const frameYEnd = () => -window.innerHeight * 1.4
      const dispoY = () => window.innerHeight * 1.1
      const dispoYEnd = () => -window.innerHeight * 1.65

      if (frame) gsap.set(frame, { yPercent: -50, y: frameY() })
      if (frameImg) gsap.set(frameImg, { yPercent: -30 })
      if (frame2) gsap.set(frame2, { yPercent: -50, y: window.innerHeight * 1.3 })
      if (frameImg2) gsap.set(frameImg2, { yPercent: -30 })
      if (dispo) gsap.set(dispo, { yPercent: -50, y: dispoY(), opacity: 1, clipPath: 'inset(0% 0 0% 0)' })
      if (dispo2) gsap.set(dispo2, { yPercent: -50, y: frameY(), opacity: 1, clipPath: 'inset(0% 0 0% 0)' })

      gsap.set(title, { yPercent: 0, x: window.innerWidth * 1.1 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#contact',
          start: 'top bottom',
          end: 'bottom bottom',
          pin: '#contact-pin',
          scrub: true,
          anticipatePin: 1,
          refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
          ...scrollTriggerDefaults,
        },
      })

      tl.fromTo(blob, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'none' }, 0)

      if (stTimeline && pctEl) {
        tl.to([stTimeline, pctEl], { opacity: 0, duration: 0.08 }, 0.1)
      }

      tl.fromTo(
        title,
        { x: window.innerWidth * 1.1, immediateRender: false },
        { x: 0, duration: 0.3, ease: 'power3.out' },
        0.18,
      )

      if (socials) {
        tl.fromTo(socials, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.2, ease: 'none' }, 0.28)
      }
      if (mailEl) {
        tl.fromTo(mailEl, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.2, ease: 'none' }, 0.36)
      }

      const pairStart = 0.22
      const frameDur = 0.65

      if (frame && frameImg) {
        tl.to(frame, { y: frameYEnd(), duration: frameDur, ease: 'none' }, pairStart)
        tl.to(frameImg, { yPercent: 30, duration: frameDur, ease: 'none' }, pairStart)
      }
      if (dispo) {
        tl.to(dispo, { y: dispoYEnd(), duration: frameDur, ease: 'none' }, pairStart)
        tl.to(dispo, { opacity: 0, clipPath: 'inset(100% 0 0% 0)', duration: 0.15, ease: 'power2.in' }, pairStart + 0.45)
      }
      if (frame2 && frameImg2) {
        tl.to(frame2, { y: frameYEnd(), duration: frameDur, ease: 'none' }, pairStart + 0.07)
        tl.to(frameImg2, { yPercent: 30, duration: frameDur, ease: 'none' }, pairStart + 0.07)
      }
      if (dispo2) {
        tl.to(dispo2, { y: frameYEnd(), duration: frameDur, ease: 'none' }, pairStart)
        tl.to(dispo2, { opacity: 0, clipPath: 'inset(100% 0 0% 0)', duration: 0.15, ease: 'power2.in' }, pairStart + 0.45)
      }

      if (footerEl && contactPin && contactSection && contactBg) {
        ScrollTrigger.create({
          ...FOOTER_TRIGGER,
          refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
          ...scrollTriggerDefaults,
          onEnter: () => {
            footerEl.style.visibility = 'visible'
            window.dispatchEvent(new CustomEvent('footer-visible', { detail: true }))
          },
          onEnterBack: () => {
            footerEl.style.visibility = 'visible'
            window.dispatchEvent(new CustomEvent('footer-visible', { detail: true }))
          },
          onLeaveBack: () => {
            footerEl.style.visibility = 'hidden'
            window.dispatchEvent(new CustomEvent('footer-visible', { detail: false }))
          },
        })
        footerEl.style.visibility = 'hidden'

        const ftl = gsap.timeline({
          scrollTrigger: {
            trigger: '#footer-transition',
            start: 'top bottom+=550',
            end: 'bottom bottom',
            scrub: true,
            refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
            ...scrollTriggerDefaults,
            onUpdate: (self) => {
              if (self.progress > 0.2) {
                contactBg.style.display = 'none'
                contactSection.style.pointerEvents = 'none'
              } else {
                contactBg.style.display = 'block'
                contactSection.style.pointerEvents = ''
              }
            },
          },
        })

        ftl.set(
          blobWrap,
          {
            height: '110vh',
            overflow: 'hidden',
            borderRadius: '0 0 0px 0px',
          },
          0,
        )

        ftl.to(
          blobWrap,
          {
            borderRadius: '0 0 50px 50px',
            duration: 0.15,
            ease: 'power2.out',
          },
          0,
        )

        ftl.to(
          blobWrap,
          {
            y: () => -(window.innerHeight * 1.8 + 400),
            immediateRender: false,
            duration: 1.0,
            ease: 'none',
          },
          0,
        )

        ftl.fromTo(
          contactPin,
          { y: 0, immediateRender: false },
          { y: '-40vh', pointerEvents: 'none', duration: 1.0, ease: 'none' },
          0,
        )

        if (socials && mailEl) {
          ftl.fromTo(
            [socials, mailEl],
            { clipPath: 'inset(0 0 0% 0)' },
            { clipPath: 'inset(0 0 100% 0)', duration: 0.1, ease: 'none' },
            0,
          )
        }

        ftl.fromTo(
          title,
          { clipPath: 'inset(0 0 0% 0)' },
          { clipPath: 'inset(0 0 100% 0)', duration: 0.25, ease: 'power2.in' },
          0,
        )
      }

      const asciiLeftWrap = document.querySelector('.footer-ascii.left')
      const asciiRightWrap = document.querySelector('.footer-ascii.right')
      if (asciiLeftWrap && asciiRightWrap) {
        gsap.fromTo(
          asciiLeftWrap,
          { xPercent: -100 },
          {
            xPercent: 0,
            ease: 'none',
            scrollTrigger: {
              ...FOOTER_TRIGGER,
              scrub: true,
              refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
              ...scrollTriggerDefaults,
            },
          },
        )
        gsap.fromTo(
          asciiRightWrap,
          { xPercent: 100 },
          {
            xPercent: 0,
            ease: 'none',
            scrollTrigger: {
              ...FOOTER_TRIGGER,
              scrub: true,
              refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
              ...scrollTriggerDefaults,
            },
          },
        )
      }

      const footerTopChars = document.querySelectorAll('#footer .footer-top .chr-hover .ch-top')
      if (footerTopChars.length) {
        gsap.set(footerTopChars, { clipPath: 'inset(100% 0 0 0)' })
        gsap.to(footerTopChars, {
          clipPath: 'inset(0 0 0 0)',
          ease: 'power3.out',
          stagger: { each: 0.015, from: 'start' },
          scrollTrigger: {
            trigger: '#footer-transition',
            start: 'center bottom+=500',
            end: 'bottom bottom',
            scrub: true,
            refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
            ...scrollTriggerDefaults,
          },
        })
      }

      const lukeEl = document.querySelector('.footer-name-luke')
      const baffaitEl = document.querySelector('.footer-name-baffait')
      const dotEl = document.querySelector('.footer-name-dot')
      if (lukeEl && baffaitEl) {
        const rebuildChars = (el: Element) => {
          const text = el.textContent ?? ''
          el.textContent = ''
          const inners: HTMLElement[] = []
          for (let i = 0; i < text.length; i++) {
            const outer = document.createElement('span')
            outer.style.display = 'inline-block'
            outer.style.overflow = 'hidden'
            outer.style.verticalAlign = 'top'
            outer.style.padding = '0.1em 0.3em'
            outer.style.margin = '-0.1em -0.3em'
            const inner = document.createElement('span')
            inner.style.display = 'inline-block'
            inner.style.willChange = 'transform'
            inner.textContent = text[i]
            outer.appendChild(inner)
            el.appendChild(outer)
            inners.push(inner)
          }
          return inners
        }

        const lukeChars = rebuildChars(lukeEl)
        const baffaitChars = rebuildChars(baffaitEl)
        const dotChars = dotEl ? rebuildChars(dotEl) : []
        const ordered: HTMLElement[] = []
        const lukeRev = lukeChars.slice().reverse()
        const rightSide = baffaitChars.concat(dotChars)
        const maxLen = Math.max(lukeRev.length, rightSide.length)
        for (let i = 0; i < maxLen; i++) {
          if (rightSide[i]) ordered.push(rightSide[i])
          if (lukeRev[i]) ordered.push(lukeRev[i])
        }

        gsap.set(ordered, { yPercent: 110 })
        gsap.to(ordered, {
          yPercent: 0,
          ease: 'power3.out',
          stagger: { each: 0.04, from: 'start' },
          scrollTrigger: {
            trigger: '#footer-transition',
            start: 'center bottom+=500',
            end: 'bottom bottom',
            scrub: true,
            refreshPriority: SCROLL_REFRESH_PRIORITY.contact,
            ...scrollTriggerDefaults,
          },
        })
      }
    },
    { scope: scopeRef, dependencies: [introComplete] },
  )

  return <div ref={scopeRef} aria-hidden="true" />
}
