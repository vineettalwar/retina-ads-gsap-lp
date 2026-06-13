# HeroSection Specification

## Overview
- **Target file:** `src/components/HeroSection.tsx`
- **Screenshot:** `docs/design-references/hero-desktop.png`
- **Interaction model:** scroll-driven + canvas background + Lenis smooth scroll

## Architecture
The hero is split into two pieces:
1. `#name-layer` — `position: fixed`, `z-index: 10005`, full viewport (1440×751px), centered, contains the huge "Retina Ads." title
2. `#scroll-wrap` — `position: relative`, `height: 3004px`, contains the sticky `#hero` section

The sticky `#hero` section creates scroll-through space. As user scrolls through 3004px, the canvas animates. The title in `#name-layer` is FIXED so it stays visible during hero scroll.

## DOM Structure

```
#name-layer (fixed, centered, z-10005)
  .preloader-content (flex row, align-items: baseline)
    #preloader-logo (div, position: relative)    → "R"
    #preloader-luke (span, position: absolute)   → "etina"
    #preloader-baffait (span, position: absolute) → "Ads"
    #preloader-dot (span, position: absolute)    → "."

#scroll-wrap (relative, height: 3004px)
  #hero (section, position: sticky, top: 0, height: 751px, overflow: hidden)
    h1.sr-only → "Retina Ads — AI driven ad agency."
    #hero-canvas (position: absolute, z-index: 0) → canvas background
    .hero-content (position: relative, z-index: 1, padding: 32px 48px)
      #hero-tagline (position: absolute, top: 48px, left: 48px)
        p → "Augmented creativity, preserved budgets..."
      #hero-line (position: absolute, 1px horizontal line, 50% opacity)
      #hero-bar (position: absolute, bottom: 48px, left/right: 48px, flex row space-between)
        .hero-bar-left  → "→ V3.0"
        .hero-bar-center (nav) → "Behance / LinkedIn / GitHub"
        .hero-bar-right (nav) → "Work Info Contact"
```

## Computed Styles (exact from getComputedStyle)

### #name-layer
- position: fixed
- display: flex
- flexDirection: row
- alignItems: center
- justifyContent: center
- width: 100vw (1440px computed)
- height: 751px (100vh at hero viewport)
- zIndex: 10005
- overflow: hidden
- backgroundColor: transparent

### .preloader-content
- display: flex
- flexDirection: row
- alignItems: baseline
- position: relative
- width: 179.727px (just the "R" width — "etina" and "Ads." are absolutely positioned)
- height: 328.266px

### #preloader-logo (R)
- fontFamily: Breton, sans-serif
- fontSize: 273.556px
- fontWeight: 300
- letterSpacing: -5.47113px
- lineHeight: 328.268px
- color: rgb(240, 240, 240)
- display: block
- position: relative
- width: 179.727px
- height: 328.266px

### #preloader-luke (etina)
- fontFamily: Breton, sans-serif
- fontSize: 273.556px
- fontWeight: 300
- letterSpacing: -21.8845px
- lineHeight: 328.268px
- color: rgb(240, 240, 240)
- position: absolute
- left: 179.727px
- width: 528.797px
- height: 328.266px

### #preloader-baffait (Ads)
- fontFamily: Machine, sans-serif (named "other" in CSS)
- fontSize: 273.556px
- fontWeight: 400
- letterSpacing: -21.8845px
- lineHeight: 328.268px
- color: rgb(240, 240, 240)
- position: absolute
- left: 859.457px
- bottom: 16.4062px (slight vertical offset to align baseline with serifs)
- width: 430.32px
- height: 328.266px

### #preloader-dot (.)
- fontFamily: Machine, sans-serif
- fontSize: 273.556px
- fontWeight: 400
- lineHeight: 328.268px
- color: rgb(240, 240, 240)
- position: absolute
- left: 1289.46px
- bottom: 16.4062px
- width: 59.3672px

### #hero (section)
- position: sticky
- top: 0
- width: 100%
- height: 100vh (751px computed)
- overflow: hidden
- backgroundColor: transparent (canvas shows through)

### #hero-canvas
- position: absolute
- top: 0; left: 0
- width: 100%; height: 100%
- zIndex: 0

### .hero-content
- position: relative
- zIndex: 1
- display: flex
- flexDirection: column
- justifyContent: space-between
- width: 100%
- height: 100%
- padding: 32px 48px

### #hero-tagline
- position: absolute
- top: 48px
- left: 48px
- maxWidth: 448px
- fontFamily: Breton, sans-serif
- fontSize: 13.6px
- fontWeight: 400
- letterSpacing: 0.136px
- lineHeight: 23.12px
- color: rgb(240, 240, 240)
- opacity: 1 (animates from 0 on page load via GSAP)

### #hero-line
- position: absolute
- bottom: 92.8px
- left: 48px
- right: 48px
- height: 1px
- backgroundColor: rgba(255, 255, 255, 0.5)
- opacity: 0.062 → animates to 1

### #hero-bar
- position: absolute
- bottom: 48px
- left: 48px
- right: 48px
- display: flex
- flexDirection: row
- justifyContent: space-between
- alignItems: flex-end
- height: 22px
- color: rgb(240, 240, 240)
- fontSize: 16px
- fontFamily: Inter

### .hero-bar-left / .hero-bar-center / .hero-bar-right
- fontSize: 11px (uppercase tracking)
- fontFamily: Inter
- letterSpacing: 0.5px (approximated)
- color: rgb(240, 240, 240)
- opacity: 0.7 (approximate)

## States & Behaviors

### Canvas Background
- A 2D canvas renders an animated purple gradient with particle/blob effect
- In our clone: use a CSS radial gradient `background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(80, 20, 180, 0.55) 0%, rgba(30, 10, 80, 0.6) 45%, rgba(10, 10, 10, 1) 100%)`
- Animate a gentle slow pulse using CSS animation or requestAnimationFrame

### Scroll-Through
- `#scroll-wrap` is 3004px tall, hero is `position: sticky`
- As user scrolls, the hero stays fixed and canvas animates
- In our clone: keep the sticky layout but animate the gradient background on scroll

### GSAP Intro Animation
- On load: tagline, line, bar animate from opacity 0 to 1 with staggered delay
- Title letters animate from bottom (translateY) up
- Implement with GSAP on client

## Assets
- Canvas background: CSS radial gradient (no image needed)
- Fonts: Breton (`/fonts/Breton.woff2`), Machine (`/fonts/Machine.otf`)

## Text Content (verbatim)
- Hero title: "Retina Ads."  ("Retina" in Breton, " Ads." in Machine)
- Tagline: "Augmented creativity, preserved budgets. Premium GSAP landing pages, AI video ads, and n8n workflows."
- Bar left: "→ V3.0"
- Bar center: "BEHANCE / LINKEDIN / GITHUB"
- Bar right: "WORK  INFO  CONTACT"
- h1 (sr-only): "Retina Ads — AI driven ad agency."

## Responsive Behavior
- **Desktop (1440px):** Full layout as described
- **Tablet (768px):** fontSize scales down proportionally; hero-bar may stack
- **Mobile (390px):** Title font-size ~25vw; bar hides center nav; tagline smaller

## Implementation Notes
- Install: `npm install gsap lenis`
- Use `'use client'` directive
- Use `useEffect` for GSAP animations after mount
- Lenis smooth scroll: initialize in a provider/layout
- For the title sizing: use `clamp()` or `vw` units so it scales
- Exact desktop size: 273.556px ≈ 19vw at 1440px → use `clamp(80px, 19vw, 280px)`
