'use client'

import { type RefObject } from 'react'
import { useLenis } from '@/context/ScrollSmootherContext'
import {
  registerGsapPlugins,
  gsap,
  ScrollTrigger,
  useGSAP,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'

function isMobileViewport() {
  return window.matchMedia('(max-width: 768px)').matches
}

export function useProjectsScroll(
  scopeRef: RefObject<HTMLElement | null>,
  introComplete: boolean,
) {
  const lenis = useLenis()

  useGSAP(
    () => {
      if (!introComplete || !scopeRef.current) return
      registerGsapPlugins()

      const items = scopeRef.current.querySelectorAll<HTMLElement>('.proj-item')
      const card = document.getElementById('proj-card')
      const cover = document.getElementById('proj-cover') as HTMLVideoElement | null
      const dateEl = document.getElementById('proj-date')
      const preview = document.getElementById('proj-preview')
      const linePath = document.getElementById('fluid-line') as SVGPathElement | null
      const projectsEl = document.getElementById('projects')
      const projCursor = document.getElementById('proj-cursor')

      if (!items.length || !card || !cover || !dateEl || !preview || !linePath || !projectsEl) {
        return
      }

      const cardEl = card
      const coverEl = cover
      const dateLabel = dateEl
      const previewEl = preview
      const linePathEl = linePath
      const projectsSection = projectsEl

      let currentIdx = -1
      let projectsVisible = false

      gsap.set(cardEl, { opacity: 0 })

      items.forEach((item) => {
        if (item.dataset.video) {
          const video = document.createElement('video')
          video.preload = 'metadata'
          video.muted = true
          video.playsInline = true
          video.src = item.dataset.video
        } else if (item.dataset.poster) {
          const img = new Image()
          img.src = item.dataset.poster
          if (img.decode) img.decode().catch(() => {})
        }
      })

      const itemQuickX = [...items].map((item) =>
        gsap.quickTo(item, 'x', { duration: 0.6, ease: 'power2.out' }),
      )

      function setPreviewMedia(item: HTMLElement) {
        if (item.dataset.poster) coverEl.poster = item.dataset.poster
        if (item.dataset.video) {
          if (coverEl.getAttribute('src') !== item.dataset.video) {
            coverEl.src = item.dataset.video
            coverEl.load()
          }
          coverEl.muted = true
          coverEl.loop = true
          coverEl.playsInline = true
          const playPromise = coverEl.play()
          if (playPromise?.catch) playPromise.catch(() => {})
        }
      }

      function deactivateAll() {
        if (currentIdx >= 0) items[currentIdx].classList.remove('active')
        currentIdx = -1
        gsap.to(cardEl, { opacity: 0, duration: 0.25, ease: 'power2.in' })
      }

      function activateProject(i: number) {
        if (i === currentIdx) return
        if (currentIdx >= 0) items[currentIdx].classList.remove('active')
        items[i].classList.add('active')

        if (currentIdx === -1) {
          setPreviewMedia(items[i])
          dateLabel.textContent = items[i].dataset.date ?? ''
          gsap.to(cardEl, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        } else {
          gsap.to(cardEl, {
            opacity: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
              setPreviewMedia(items[i])
              dateLabel.textContent = items[i].dataset.date ?? ''
              gsap.to(cardEl, { opacity: 1, duration: 0.3, ease: 'power2.out' })
            },
          })
        }
        currentIdx = i
      }

      function onProjectsScroll() {
        if (!projectsVisible) {
          if (currentIdx >= 0) deactivateAll()
          return
        }

        const cy = window.innerHeight / 2
        const halfH = window.innerHeight / 2
        let closestIdx = -1
        let closestDist = Infinity

        items.forEach((item, i) => {
          const rect = item.getBoundingClientRect()
          const itemCy = rect.top + rect.height / 2
          const dist = Math.abs(itemCy - cy)

          itemQuickX[i](Math.min(dist / halfH, 1) * 80)

          if (dist < closestDist) {
            closestDist = dist
            closestIdx = i
          }
        })

        if (closestIdx >= 0 && closestDist < window.innerHeight * 0.45) {
          activateProject(closestIdx)
        } else {
          deactivateAll()
        }
      }

      function setProjectsVisible(visible: boolean) {
        projectsVisible = visible
        previewEl.classList.toggle('visible', visible)
        onProjectsScroll()
      }

      const visibilityTrigger = ScrollTrigger.create({
        trigger: projectsSection,
        start: 'top 80%',
        end: 'bottom 20%',
        ...scrollTriggerDefaults,
        onEnter: () => setProjectsVisible(true),
        onLeave: () => setProjectsVisible(false),
        onEnterBack: () => setProjectsVisible(true),
        onLeaveBack: () => setProjectsVisible(false),
        onUpdate: () => onProjectsScroll(),
      })

      const scrollSyncTrigger = ScrollTrigger.create({
        trigger: projectsSection,
        start: 'top bottom',
        end: 'bottom top',
        ...scrollTriggerDefaults,
        onUpdate: () => onProjectsScroll(),
      })

      if (visibilityTrigger.isActive) {
        setProjectsVisible(true)
      }

      const scrollHandler = () => onProjectsScroll()
      const unsubscribeScroll = lenis?.on('scroll', scrollHandler)
      onProjectsScroll()

      items.forEach((item, i) => {
        item.addEventListener('click', () => {
          if (item.classList.contains('active')) return
          activateProject(i)

          let docTop = 0
          let el: HTMLElement | null = item
          while (el) {
            docTop += el.offsetTop
            el = el.offsetParent as HTMLElement | null
          }
          lenis?.scrollTo(docTop - window.innerHeight / 2 + item.offsetHeight / 2, {
            duration: 1.2,
          })
        })
      })

      let tiltTargetRY = 0
      let tiltTargetRX = 0
      let tiltRY = 0
      let tiltRX = 0

      const qCursorX = projCursor
        ? gsap.quickTo(projCursor, 'left', { duration: 0.35, ease: 'power3.out' })
        : null
      const qCursorY = projCursor
        ? gsap.quickTo(projCursor, 'top', { duration: 0.35, ease: 'power3.out' })
        : null

      coverEl.addEventListener('mouseenter', () => {
        projCursor?.classList.add('active')
      })
      coverEl.addEventListener('mouseleave', () => {
        projCursor?.classList.remove('active')
      })

      const onMouseMove = (e: MouseEvent) => {
        if (projectsVisible) {
          qCursorX?.(e.clientX)
          qCursorY?.(e.clientY)
        }
        if (projectsVisible) {
          const rect = cardEl.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const ry = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))
          const rx = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
          tiltTargetRY = ry * 6
          tiltTargetRX = -rx * 5
        }
      }
      document.addEventListener('mousemove', onMouseMove)

      const tickerFn = () => {
        if (projectsVisible) {
          tiltRY += (tiltTargetRY - tiltRY) * 0.12
          tiltRX += (tiltTargetRX - tiltRX) * 0.12
          cardEl.style.transform = `rotateY(${tiltRY.toFixed(2)}deg) rotateX(${tiltRX.toFixed(2)}deg)`
        }
      }
      gsap.ticker.add(tickerFn)

      const lerpTriggers: ScrollTrigger[] = []
      if (!isMobileViewport()) {
        items.forEach((item) => {
          lerpTriggers.push(
            ScrollTrigger.create({
              trigger: item,
              start: 'top 52%',
              end: 'bottom 48%',
              ...scrollTriggerDefaults,
              onEnter: () => {
                if (lenis?.options) lenis.options.lerp = 0.04
              },
              onLeave: () => {
                if (lenis?.options) lenis.options.lerp = 0.06
              },
              onEnterBack: () => {
                if (lenis?.options) lenis.options.lerp = 0.04
              },
              onLeaveBack: () => {
                if (lenis?.options) lenis.options.lerp = 0.06
              },
            }),
          )
        })
      }

      const lineLen = linePathEl.getTotalLength()
      gsap.set(linePathEl, { strokeDasharray: lineLen, strokeDashoffset: lineLen })

      const lineTween = gsap.to(linePathEl, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1,
          ...scrollTriggerDefaults,
        },
      })

      return () => {
        unsubscribeScroll?.()
        document.removeEventListener('mousemove', onMouseMove)
        gsap.ticker.remove(tickerFn)
        visibilityTrigger.kill()
        scrollSyncTrigger.kill()
        lerpTriggers.forEach((t) => t.kill())
        lineTween.scrollTrigger?.kill()
        lineTween.kill()
      }
    },
    { scope: scopeRef, dependencies: [introComplete, lenis] },
  )
}
