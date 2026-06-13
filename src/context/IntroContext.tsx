'use client'

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

type IntroStore = {
  introComplete: boolean
  setIntroComplete: (value: boolean) => void
  registerLenisStart: (fn: () => void) => void
  startLenis: () => void
  registerShaderStart: (fn: () => void) => void
  startShader: () => void
}

const IntroContext = createContext<IntroStore | null>(null)

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false)
  const lenisStartRef = useRef<(() => void) | null>(null)
  const shaderStartRef = useRef<(() => void) | null>(null)

  const store = useMemo<IntroStore>(
    () => ({
      introComplete,
      setIntroComplete,
      registerLenisStart: (fn) => {
        lenisStartRef.current = fn
      },
      startLenis: () => {
        lenisStartRef.current?.()
      },
      registerShaderStart: (fn) => {
        shaderStartRef.current = fn
      },
      startShader: () => {
        shaderStartRef.current?.()
      },
    }),
    [introComplete],
  )

  return <IntroContext.Provider value={store}>{children}</IntroContext.Provider>
}

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used within IntroProvider')
  return ctx
}
