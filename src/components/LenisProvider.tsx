'use client'

import { useLayoutEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import {
  ScrollStoreProvider,
  useStableScrollStore,
} from '@/context/ScrollSmootherContext'
import { useIntro } from '@/context/IntroContext'
import { setupScrollRefreshOnReady } from '@/lib/gsap/refreshOnReady'
import { getContactScrollOffset } from '@/lib/scroll-targets'
import {
  registerGsapPlugins,
  gsap,
  ScrollTrigger,
  refreshScrollTriggers,
} from '@/lib/gsap/register'

function LenisRuntime({ children }: { children: ReactNode }) {
  const store = useStableScrollStore()
  const { introComplete, registerLenisStart } = useIntro()

  useLayoutEffect(() => {
    registerGsapPlugins()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('lenis')

    const lenis = new Lenis({
      lerp: reducedMotion ? 1 : 0.06,
      smoothWheel: !reducedMotion,
      autoRaf: false,
    })

    store.setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    lenis.stop()
    lenis.scrollTo(0, { immediate: true })

    registerLenisStart(() => {
      lenis.start()
      lenis.scrollTo(0, { immediate: true })
      document.documentElement.style.overflow = ''
      refreshScrollTriggers()
    })

    const cleanupRefresh = setupScrollRefreshOnReady('#main-content')

    return () => {
      cleanupRefresh()
      gsap.ticker.remove(ticker)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
      store.setLenis(null)
    }
  }, [store, registerLenisStart])

  useLayoutEffect(() => {
    if (introComplete) {
      const lenis = store.getLenis()
      if (lenis) {
        lenis.start()
        if (window.location.hash === '#contact') {
          const contact = document.querySelector('#contact')
          if (contact) {
            lenis.scrollTo(contact as HTMLElement, {
              offset: getContactScrollOffset(),
              immediate: true,
            })
          } else {
            lenis.scrollTo(0, { immediate: true })
          }
        } else {
          lenis.scrollTo(0, { immediate: true })
        }
        refreshScrollTriggers()
      }
      const contactBg = document.getElementById('contact-bg')
      const blobWrap = document.getElementById('contact-blob-wrap')
      if (contactBg) contactBg.style.display = 'none'
      if (blobWrap) blobWrap.style.visibility = 'hidden'
    }
  }, [introComplete, store])

  return <ScrollStoreProvider store={store}>{children}</ScrollStoreProvider>
}

export function LenisProvider({ children }: { children: ReactNode }) {
  return <LenisRuntime>{children}</LenisRuntime>
}

/** @deprecated use LenisProvider */
export const ScrollSmootherProvider = LenisProvider
