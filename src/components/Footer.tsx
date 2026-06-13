'use client'

import { useEffect } from 'react'
import { useScrollTo } from '@/context/ScrollSmootherContext'
import { loadAsciiFromImage } from '@/lib/asciiArt'
import { buildChrHoverElement } from '@/lib/i18n'

const SOCIAL_LINKS = {
  LinkedIn: 'https://www.linkedin.com/in/chanchal-choudhary-6bb126408/?skipRedirect=true',
  Behance: 'https://www.behance.net/',
} as const

const NAV_TARGETS = {
  Work: '#projects',
  Info: '#about',
  Contact: '#contact',
} as const

export function Footer() {
  const scrollTo = useScrollTo()

  useEffect(() => {
    const cols = window.innerWidth <= 768 ? 50 : 80
    loadAsciiFromImage('/images/footer/left.png', 'ascii-left', cols)
    loadAsciiFromImage('/images/footer/right.png', 'ascii-right', cols)

    document.querySelectorAll('[data-chr-footer]').forEach((el) => {
      const text = el.getAttribute('data-chr-footer')
      if (!text) return
      el.innerHTML = ''
      el.appendChild(buildChrHoverElement(text))
    })

    let mx = 0
    let my = 0
    let sx = 0
    let sy = 0
    let footerVisible = false
    const asciiLeftPre = document.getElementById('ascii-left')
    const asciiRightPre = document.getElementById('ascii-right')

    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const parallaxLoop = () => {
      if (!footerVisible) return
      sx += (mx - sx) * 0.05
      sy += (my - sy) * 0.05
      const lx = Math.min(0, sx * -15 - 15)
      const rx = Math.max(0, sx * 15 + 15)
      const py = sy * -10
      if (asciiLeftPre) asciiLeftPre.style.transform = `translate(${lx}px, ${py}px)`
      if (asciiRightPre) asciiRightPre.style.transform = `translate(${rx}px, ${py}px)`
      requestAnimationFrame(parallaxLoop)
    }

    const onFooterVisible = (e: Event) => {
      footerVisible = (e as CustomEvent<boolean>).detail === true
      if (footerVisible) parallaxLoop()
    }

    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener('footer-visible', onFooterVisible as EventListener)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('footer-visible', onFooterVisible as EventListener)
    }
  }, [])

  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-top-col">
            <a
              className="chr-hover footer-mail"
              href="mailto:theretina@proton.me"
              data-chr-footer="theretina@proton.me"
              aria-label="Send email"
            />
            <span className="chr-hover footer-date" data-chr-footer="© 2026" />
          </div>
          <nav className="footer-top-col" aria-label="Social links">
            {(['LinkedIn', 'Behance'] as const).map((link) => (
              <a
                key={link}
                href={SOCIAL_LINKS[link]}
                target="_blank"
                rel="noopener noreferrer"
                className="chr-hover"
                data-chr-footer={link}
                aria-label={link}
              />
            ))}
          </nav>
          <nav className="footer-top-col" aria-label="Footer navigation">
            {(Object.keys(NAV_TARGETS) as Array<keyof typeof NAV_TARGETS>).map((label) => (
              <a
                key={label}
                href={NAV_TARGETS[label]}
                className="chr-hover"
                data-chr-footer={label}
                aria-label={label}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(NAV_TARGETS[label])
                }}
              />
            ))}
            <a
              href="https://freedns.afraid.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="chr-hover"
              data-chr-footer="Free DNS"
              aria-label="Free DNS"
            />
          </nav>
        </div>

        <div className="footer-ascii-wrap">
          <div className="footer-ascii left">
            <pre id="ascii-left" />
          </div>
          <div className="footer-ascii right">
            <pre id="ascii-right" />
          </div>
        </div>

        <div className="footer-name">
          <span className="footer-name-luke">
            <span className="first-letter">R</span>etina
          </span>
          <span className="footer-name-baffait-wrap">
            <span className="footer-name-baffait">Ads</span>
            <span className="footer-name-dot">.</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
