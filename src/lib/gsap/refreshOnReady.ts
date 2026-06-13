'use client'

import { refreshScrollTriggers } from '@/lib/gsap/register'

let debounceId: ReturnType<typeof setTimeout> | null = null

export function debouncedScrollRefresh(delayMs = 200) {
  if (typeof window === 'undefined') return
  if (debounceId) clearTimeout(debounceId)
  debounceId = setTimeout(() => {
    debounceId = null
    refreshScrollTriggers()
  }, delayMs)
}

export function setupScrollRefreshOnReady(rootSelector = '#smooth-content') {
  if (typeof window === 'undefined') return () => {}

  const onResize = () => debouncedScrollRefresh()
  window.addEventListener('resize', onResize)
  window.addEventListener('load', onResize)
  document.fonts?.ready.then(() => debouncedScrollRefresh())

  const root = document.querySelector(rootSelector)
  const images = root?.querySelectorAll('img') ?? []
  let pending = images.length

  const onImageSettled = () => {
    pending -= 1
    if (pending <= 0) debouncedScrollRefresh()
  }

  images.forEach((img) => {
    if (img.complete) {
      onImageSettled()
    } else {
      img.addEventListener('load', onImageSettled, { once: true })
      img.addEventListener('error', onImageSettled, { once: true })
    }
  })

  if (pending === 0) debouncedScrollRefresh()

  return () => {
    window.removeEventListener('resize', onResize)
    window.removeEventListener('load', onResize)
    if (debounceId) clearTimeout(debounceId)
  }
}
