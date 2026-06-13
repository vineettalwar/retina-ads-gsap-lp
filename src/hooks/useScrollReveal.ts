'use client'

import { type RefObject } from 'react'
import {
  registerGsapPlugins,
  gsap,
  ScrollTrigger,
  useGSAP,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'

type ScrollRevealOptions = {
  selector?: string
  start?: string
  stagger?: number
  y?: number
}

export function useScrollReveal(
  scopeRef: RefObject<HTMLElement | null>,
  {
    selector = '.reveal-hidden',
    start = 'top 85%',
    stagger = 0.12,
    y = 32,
  }: ScrollRevealOptions = {},
) {
  useGSAP(
    () => {
      const scope = scopeRef.current
      if (!scope) return

      registerGsapPlugins()

      const elements = scope.querySelectorAll(selector)
      if (!elements.length) return

      gsap.set(elements, { opacity: 0, y })

      ScrollTrigger.batch(elements, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger,
            ease: 'power2.out',
            overwrite: true,
          })
        },
        start,
        once: true,
        ...scrollTriggerDefaults,
      })
    },
    { scope: scopeRef },
  )
}
