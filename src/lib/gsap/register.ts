'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

let registered = false

export function registerGsapPlugins() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, useGSAP)
  registered = true
}

export function refreshScrollTriggers() {
  if (typeof window === 'undefined') return
  registerGsapPlugins()
  ScrollTrigger.refresh()
}

export const SCROLL_REFRESH_PRIORITY = {
  hero: 0,
  gallery: 10,
  about: 20,
  testimonials: 30,
  contact: 40,
  overlay: 90,
} as const

export const scrollTriggerDefaults = {
  markers: process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_GSAP_MARKERS === 'true',
}

export { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, useGSAP }
