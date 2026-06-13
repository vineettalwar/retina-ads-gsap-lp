'use client'

import { useCallback, useEffect, useRef } from 'react'
import Script from 'next/script'
import { useIntro } from '@/context/IntroContext'

declare global {
  interface Window {
    _heroProjectData?: object
    CoreRenderer?: {
      init: () => Promise<void>
      destroy?: () => void
    }
  }
}

export function HeroCanvas() {
  const { registerShaderStart, startShader, introComplete } = useIntro()
  const scriptsReady = useRef({ hero: false, core: false })
  const shaderStarted = useRef(false)

  const tryStartShader = useCallback(() => {
    if (!scriptsReady.current.hero || !scriptsReady.current.core) return

    registerShaderStart(() => {
      if (shaderStarted.current || typeof window === 'undefined') return
      shaderStarted.current = true

      const projectData = window._heroProjectData
      if (!projectData || !window.CoreRenderer) return

      const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' })
      const blobUrl = URL.createObjectURL(blob)
      const container = document.getElementById('hero-canvas')
      if (!container) return

      container.setAttribute('data-cr-project-src', blobUrl)
      window.CoreRenderer.init()
        .then(() => {
          URL.revokeObjectURL(blobUrl)
          const mx = window.innerWidth / 2
          const my = window.innerHeight / 2
          window.dispatchEvent(new MouseEvent('mousemove', { clientX: mx, clientY: my, bubbles: true }))
          window.dispatchEvent(new Event('scroll'))
        })
        .catch((err: Error) => console.error('CoreRenderer init failed:', err))
    })

    startShader()
  }, [registerShaderStart, startShader])

  // If intro already finished before vendor scripts load (return visits), start shader immediately.
  useEffect(() => {
    if (introComplete) tryStartShader()
  }, [introComplete, tryStartShader])

  return (
    <>
      <Script
        src="/vendor/hero-project.js"
        strategy="afterInteractive"
        onLoad={() => {
          scriptsReady.current.hero = true
          tryStartShader()
        }}
      />
      <Script
        src="/vendor/core-renderer.js"
        strategy="afterInteractive"
        onLoad={() => {
          scriptsReady.current.core = true
          tryStartShader()
        }}
      />
    </>
  )
}
