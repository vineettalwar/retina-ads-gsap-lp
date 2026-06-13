'use client'

import { useRef } from 'react'
import { useIntro } from '@/context/IntroContext'
import { ProjectsSection } from '@/components/ProjectsSection'
import {
  registerGsapPlugins,
  gsap,
  useGSAP,
  scrollTriggerDefaults,
} from '@/lib/gsap/register'

function wrapWords(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)

  textNodes.forEach((node) => {
    const words = node.textContent?.split(/(\s+)/) ?? []
    const frag = document.createDocumentFragment()
    words.forEach((w) => {
      if (/^\s+$/.test(w)) {
        frag.appendChild(document.createTextNode(w))
      } else if (w) {
        const span = document.createElement('span')
        span.className = 'word'
        span.textContent = w
        frag.appendChild(span)
      }
    })
    node.parentNode?.replaceChild(frag, node)
  })
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { introComplete } = useIntro()

  useGSAP(
    () => {
      if (!introComplete) return
      registerGsapPlugins()

      const aboutText = document.getElementById('about-text')
      const aboutSub = document.getElementById('about-sub')
      const aboutVersion = document.querySelector('.about-version')
      const photoWrap = document.getElementById('about-photo-wrap')
      const photo = photoWrap?.querySelector('.about-photo') as HTMLImageElement | null

      if (!aboutText || !aboutSub || !aboutVersion || !photoWrap || !photo) return

      const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches

      const aboutIcon = aboutVersion.querySelector('svg')
      if (aboutIcon) aboutIcon.classList.add('word')

      wrapWords(aboutText)
      wrapWords(aboutVersion as HTMLElement)

      if (isMobile) {
        ;[...aboutText.querySelectorAll('.word'), ...aboutVersion.querySelectorAll('.word')].forEach(
          (w) => {
            ;(w as HTMLElement).style.filter = 'none'
          },
        )
      }

      ;[...aboutText.querySelectorAll('.word'), ...aboutVersion.querySelectorAll('.word')].forEach(
        (word) => {
          gsap.to(word, {
            opacity: 1,
            ...(isMobile ? {} : { filter: 'blur(0px)' }),
            ease: 'none',
            scrollTrigger: {
              trigger: word,
              start: 'top 75%',
              end: 'top 60%',
              scrub: true,
              ...scrollTriggerDefaults,
            },
          })
        },
      )

      gsap.set(aboutSub, isMobile ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)' })
      gsap.to(aboutSub, {
        opacity: 1,
        ...(isMobile ? {} : { filter: 'blur(0px)' }),
        ease: 'none',
        scrollTrigger: {
          trigger: aboutSub,
          start: 'top 80%',
          end: 'top 60%',
          scrub: true,
          ...scrollTriggerDefaults,
        },
      })

      const initPhotoScroll = () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: photoWrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            ...scrollTriggerDefaults,
          },
        })
        tl.fromTo(photo, { y: '-50%' }, { y: '50%', ease: 'none' }, 0)
        tl.fromTo(
          photo,
          { opacity: 0, filter: 'blur(20px)' },
          { opacity: 1, filter: 'blur(0px)', ease: 'none', duration: 0.3 },
          0,
        )
      }

      if (photo.decode) {
        photo.decode().then(initPhotoScroll).catch(initPhotoScroll)
      } else if (photo.complete) {
        initPhotoScroll()
      } else {
        photo.onload = initPhotoScroll
      }
    },
    { scope: sectionRef, dependencies: [introComplete] },
  )

  return (
    <section
      ref={sectionRef}
      id="section-after"
      style={{
        position: 'relative',
        zIndex: 'var(--z-section-after)' as unknown as number,
      }}
    >
      <div id="about">
        <div id="about-text">
          As a next-generation
          <span className="other-accent"> creative agency</span>, we marry generative AI and{' '}
          <span className="other-accent">automation.</span>
        </div>

        <div id="about-sub">
          We are Retina Ads. We believe world-class ad creatives, elite web development, and
          advanced business automation shouldn&apos;t carry a premium price tag. Utilizing
          Google&apos;s top and latest state-of-the-art model called Google Omni for cinematic video
          generation and NanoBanana for hyper-realistic product imagery, paired with high-end
          GSAP-powered landing pages that feel like they&apos;re worth millions and beyond.
        </div>

        <div className="about-btn">Info →</div>

        <div className="about-version">
          <svg
            style={{ width: '1.25em', height: '1.25em', verticalAlign: '-0.25em' }}
            viewBox="0 0 84 85"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" />
          </svg>
          V3.0
        </div>

        <div id="about-photo-wrap">
          <img
            className="about-photo"
            src="/images/profile/prometheus.jpg"
            alt="Retina Ads"
            decoding="async"
            width={2500}
            height={3001}
          />
        </div>
      </div>

      <ProjectsSection />
    </section>
  )
}
