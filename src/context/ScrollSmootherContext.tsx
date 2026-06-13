'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type Lenis from 'lenis'

type ScrollStore = {
  getLenis: () => Lenis | null
  setLenis: (instance: Lenis | null) => void
}

const ScrollContext = createContext<ScrollStore | null>(null)

export function useLenis() {
  return useContext(ScrollContext)?.getLenis() ?? null
}

export function useScrollTo() {
  const store = useContext(ScrollContext)

  return (target: string, offset = 0) => {
    const lenis = store?.getLenis()
    const el = document.querySelector(target)
    if (!el) return
    if (lenis) {
      lenis.scrollTo(el as HTMLElement, { offset, duration: 1.2 })
    } else {
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }
}

/** @deprecated use useLenis */
export function useScrollSmoother() {
  return useLenis()
}

export function ScrollStoreProvider({
  store,
  children,
}: {
  store: ScrollStore
  children: ReactNode
}) {
  return <ScrollContext.Provider value={store}>{children}</ScrollContext.Provider>
}

/** @deprecated use ScrollStoreProvider */
export const ScrollSmootherStoreProvider = ScrollStoreProvider

export function createScrollStore(): ScrollStore {
  const lenisRef = { current: null as Lenis | null }

  return {
    getLenis: () => lenisRef.current,
    setLenis: (instance) => {
      lenisRef.current = instance
    },
  }
}

/** @deprecated use createScrollStore */
export const createScrollSmootherStore = createScrollStore

export function useStableScrollStore() {
  return useMemo(() => createScrollStore(), [])
}

/** @deprecated use useStableScrollStore */
export const useStableScrollSmootherStore = useStableScrollStore
