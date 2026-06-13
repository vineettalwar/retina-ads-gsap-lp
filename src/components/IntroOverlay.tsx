'use client'

import { useLayoutEffect, useRef } from 'react'
import {
  registerGsapPlugins,
  gsap,
  refreshScrollTriggers,
} from '@/lib/gsap/register'
import { useIntro } from '@/context/IntroContext'

function splitIntoChars(el: HTMLElement) {
  const raw = el.textContent ?? ''
  el.innerHTML = ''
  const inners: HTMLElement[] = []
  raw.split('').forEach((ch) => {
    const outer = document.createElement('span')
    outer.style.cssText =
      'display:inline-block;overflow:hidden;vertical-align:top;padding:0.15em 0.3em;margin:-0.15em -0.3em;'
    const inner = document.createElement('span')
    inner.className = 'char'
    inner.style.display = 'inline-block'
    inner.textContent = ch === ' ' ? '\u00a0' : ch
    outer.appendChild(inner)
    el.appendChild(outer)
    inners.push(inner)
  })
  return inners
}

export function IntroOverlay() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const { introComplete, setIntroComplete, startLenis, startShader } = useIntro()

  useLayoutEffect(() => {
    if (introComplete) return

    registerGsapPlugins()

    let cancelled = false
    let master: gsap.core.Timeline | null = null
    let forceScrollTop: (() => void) | null = null
    let resizeHandler: (() => void) | null = null

    const run = () => {
      if (cancelled || introComplete) return

      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0

      const shouldSkipLongIntro = !!sessionStorage.getItem('index-return-fade')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const mustSkip = shouldSkipLongIntro || prefersReducedMotion

      const pContent = document.getElementById('preloader-content')
      const pLogo = document.getElementById('preloader-logo')
      const pLuke = document.getElementById('preloader-luke')
      const pBaffait = document.getElementById('preloader-baffait')
      const pDot = document.getElementById('preloader-dot')
      const tPanelRed = document.getElementById('t-panel-red')
      const tPanelDark = document.getElementById('t-panel-dark')
      const hero = document.getElementById('hero')
      const nameLayer = document.getElementById('name-layer')
      const introBg = document.getElementById('intro-bg')

      if (!pContent || !pLogo || !pLuke || !pBaffait || !pDot || !tPanelRed || !tPanelDark || !hero || !nameLayer || !introBg) {
        requestAnimationFrame(run)
        return
      }

      const getViewportSize = () => ({
        width: document.documentElement.clientWidth || window.innerWidth,
        height: window.innerHeight,
      })

      const isMobileViewport = () => getViewportSize().width <= 768

      const layoutNames = () => {
        const logoFs = parseFloat(getComputedStyle(pLogo).fontSize)
        const baffaitFs = parseFloat(getComputedStyle(pBaffait).fontSize)
        if (!logoFs || !baffaitFs) return

        const baselineOffset = -0.06
        const logoWidth = pLogo.offsetWidth
        const gapPx = baffaitFs * 0.55

        pLuke.style.position = 'absolute'
        pLuke.style.left = `${logoWidth / logoFs}em`
        pLuke.style.top = '0'

        const lukeLeft = logoWidth
        const lukeWidth = pLuke.offsetWidth
        const baffaitLeftPx = lukeLeft + lukeWidth + gapPx
        pBaffait.style.left = `${baffaitLeftPx / baffaitFs}em`
        pBaffait.style.top = `${baselineOffset}em`

        const dotLeftPx = baffaitLeftPx + pBaffait.offsetWidth
        pDot.style.left = `${dotLeftPx / baffaitFs}em`
        pDot.style.top = `${baselineOffset}em`
      }

      const getTotalWidth = () => {
        layoutNames()
        return pDot.offsetLeft + pDot.offsetWidth
      }

      let keepIntroNameAnchored = false
      let nameAnchorRaf = 0

      const placeIntroNameAtBottom = () => {
        layoutNames()
        const mobile = isMobileViewport()
        const pad = mobile ? 20 : 48
        const viewportSize = getViewportSize()
        const vh = viewportSize.height
        const bottomPad = mobile ? Math.max(vh * 0.18, 110) : 80

        const centerX = viewportSize.width / 2
        const boxW = pContent.offsetWidth
        const boxH = pContent.offsetHeight
        const targetLeft = pad
        const x = targetLeft - centerX + boxW / 2

        const targetBottom = vh - bottomPad
        const boxTop = vh / 2 - boxH / 2
        const y = targetBottom - boxH - boxTop

        gsap.set(pContent, { x, y, transformOrigin: '50% 50%' })
      }

      const refreshIntroNameAnchor = () => {
        if (!keepIntroNameAnchored) return
        if (nameAnchorRaf) cancelAnimationFrame(nameAnchorRaf)
        nameAnchorRaf = requestAnimationFrame(() => {
          nameAnchorRaf = 0
          applySettledTitleState()
        })
      }

      resizeHandler = refreshIntroNameAnchor
      window.addEventListener('resize', refreshIntroNameAnchor)

      const finishIntro = () => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.documentElement.style.overflow = ''
        setIntroComplete(true)
        startLenis()
        sessionStorage.setItem('index-return-fade', '1')
        window.dispatchEvent(new Event('intro-complete'))
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
          refreshScrollTriggers()
        })
      }

      const applySettledTitleState = () => {
        const mobile = isMobileViewport()
        const pad = mobile ? 20 : 48
        const viewportSize = getViewportSize()
        layoutNames()
        const currentW = getTotalWidth()
        if (!currentW) return
        const targetW = viewportSize.width - pad * 2
        const scale = targetW / currentW
        const baseFontSize = parseFloat(getComputedStyle(pLogo).fontSize)
        const newFontSize = baseFontSize * scale
        const vwSize = (newFontSize / viewportSize.width) * 100

        gsap.set(pContent, { scale: 1, x: 0, y: 0 })
        gsap.set(nameLayer, { mixBlendMode: 'difference' })
        ;[pLogo, pLuke, pBaffait, pDot].forEach((el) => {
          el.style.fontSize = `${vwSize}vw`
        })
        void pContent.offsetWidth
        layoutNames()
        placeIntroNameAtBottom()
        keepIntroNameAnchored = true
      }

      const showHeroChrome = () => {
        gsap.set('#hero-tagline, #hero-bar', { opacity: 1, clipPath: 'inset(0 0 0% 0)' })
        gsap.set('#hero-line', { opacity: 1, scaleX: 1, transformOrigin: 'left center' })
      }

      layoutNames()

      const finishIntroSetup = () => {
        gsap.set(introBg, { display: 'none' })
        gsap.set(hero, { opacity: 1 })
        gsap.set([tPanelRed, tPanelDark], { y: '-100%' })
        showHeroChrome()
        applySettledTitleState()
        startShader()
        finishIntro()
      }

      if (mustSkip) {
        const logoChars = splitIntoChars(pLogo)
        const lukeChars = splitIntoChars(pLuke)
        const baffaitChars = splitIntoChars(pBaffait)
        gsap.set([...logoChars, ...lukeChars, ...baffaitChars], { yPercent: 0 })
        gsap.set(pDot, { opacity: 1 })
        layoutNames()
        finishIntroSetup()
        return
      }

      const logoChars = splitIntoChars(pLogo)
      const lukeChars = splitIntoChars(pLuke)
      const baffaitChars = splitIntoChars(pBaffait)
      const allRevealEls = [...logoChars, ...lukeChars, ...baffaitChars]

      gsap.set(pLogo, { opacity: 1 })
      gsap.set(pLuke, { opacity: 1 })
      gsap.set(pBaffait, { opacity: 1 })
      gsap.set(allRevealEls, { yPercent: 110 })
      gsap.set(pDot, { opacity: 0 })
      gsap.set([pContent, tPanelRed, tPanelDark], { willChange: 'transform' })
      gsap.set(hero, { opacity: 0 })

      forceScrollTop = () => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
      }
      forceScrollTop()
      window.addEventListener('scroll', forceScrollTop)
      document.documentElement.style.overflow = 'hidden'

      master = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          if (forceScrollTop) window.removeEventListener('scroll', forceScrollTop)
          finishIntro()
        },
      })

      master
        .add(() => {
          layoutNames()
          gsap.set(pContent, { x: -(getTotalWidth() / 2 - pLogo.offsetWidth / 2) })
          gsap.set(pLuke, { x: 0 })
        })
        .to(allRevealEls, {
          yPercent: 0,
          duration: 0.4,
          ease: 'power3.out',
          stagger: { each: 0.025, from: 'center' },
        })
        .add(() => layoutNames())
        .to(pDot, { opacity: 1, duration: 0.25, ease: 'power2.out' })
        .add(() => startShader())
        .to({}, { duration: 0.3 })
        .add(() => {
          const mobile = isMobileViewport()
          const pad = mobile ? 20 : 48
          const currentW = getTotalWidth()
          const viewportSize = getViewportSize()
          const targetW = viewportSize.width - pad * 2
          const scale = targetW / currentW
          const visualCenterX = getTotalWidth() / 2
          const visualCenterY = pContent.offsetHeight / 2
          gsap.set(pContent, { transformOrigin: `${visualCenterX}px ${visualCenterY}px` })
          const vh = viewportSize.height
          const bottomPad = mobile ? Math.max(vh * 0.18, 110) : 80
          const targetBottom = vh - bottomPad
          const contentRect = pContent.getBoundingClientRect()
          const curVisualCenterY = contentRect.top + visualCenterY
          const targetVisualCenterY = targetBottom - (pContent.offsetHeight * scale) / 2
          const deltaY = targetVisualCenterY - curVisualCenterY

          gsap.to(pContent, {
            scale,
            y: `+=${deltaY}`,
            duration: 0.75,
            ease: 'power3.inOut',
            onComplete: () => {
              pContent.style.visibility = 'hidden'
              applySettledTitleState()
              pContent.style.visibility = 'visible'
            },
          })
        })
        .to(tPanelDark, { y: '0%', duration: 0.45, ease: 'power3.inOut' }, '<+=0.05')
        .to(tPanelRed, { y: '0%', duration: 0.45, ease: 'power3.inOut' }, '-=0.3')
        .set(introBg, { display: 'none' })
        .set(hero, { opacity: 1 })
        .to(tPanelRed, { y: '-100%', duration: 0.55, ease: 'power3.inOut' }, '+=0.05')
        .to(tPanelDark, { y: '-100%', duration: 0.55, ease: 'power3.inOut' }, '-=0.4')
        .to(
          '#hero-tagline',
          { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.inOut' },
          '-=0.2',
        )
        .to(
          '#hero-bar',
          { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: 'power3.inOut' },
          '-=0.8',
        )
        .fromTo(
          '#hero-line',
          { opacity: 1, scaleX: 0 },
          { scaleX: 1, duration: 1.0, ease: 'power3.inOut' },
          '<',
        )

    }

    run()

    return () => {
      cancelled = true
      master?.kill()
      if (forceScrollTop) window.removeEventListener('scroll', forceScrollTop)
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      document.documentElement.style.overflow = ''
    }
  }, [introComplete, setIntroComplete, startLenis, startShader])

  return (
    <div ref={scopeRef} aria-hidden="true">
      <div id="intro-bg" />
      <div id="transition-panel">
        <div id="t-panel-red" />
        <div id="t-panel-dark" />
      </div>
    </div>
  )
}
