# Behaviors — Retina Ads (https://retina-ads.vercel.app/)

Extracted via browser inspection + clone implementation audit. English copy used in clone.

## Global

| Property | Value |
|----------|-------|
| Smooth scroll | **Lenis** active (`.lenis` class on html/body) |
| Animation library | **GSAP** + ScrollTrigger |
| Total scroll height | ~18,756px at 1440×900 |
| Fonts | Breton (sans), Machine (display), Zirena (serif headings), Inter (UI) |

## 1. Intro Preloader (time-driven)

**INTERACTION MODEL:** time-driven GSAP timeline on page load

- **Trigger:** First visit (skipped on `sessionStorage.index-return-fade` or `prefers-reduced-motion`)
- **Sequence:**
  1. Char-split animation on `#preloader-content` ("R" / "etina" / "Ads" / ".")
  2. Red panel (`#t-panel-red`) and dark panel (`#t-panel-dark`) wipe across viewport
  3. Hero (`#hero`) fades in; shader canvas initializes via `CoreRenderer`
  4. `#hero-tagline`, `#hero-bar`, `#hero-line` clip-path reveal
  5. Dispatches `intro-complete` event; Lenis starts
- **Skip path:** Return visits fade hero in immediately, no long intro

## 2. Hero Section (scroll-driven)

**INTERACTION MODEL:** scroll-driven with sticky container

| Element | Behavior |
|---------|----------|
| `#scroll-wrap` | Height = **4× viewport** (3600px at 900vh, 3004px at 751vh) — creates scroll-through space |
| `#hero` | `position: sticky; top: 0; height: 100vh` — stays pinned while scrolling through wrap |
| `#name-layer` | **Fixed** at z-index 10005 — title stays centered during hero scroll |
| `#hero-canvas` | WebGL shader (`CoreRenderer`) — purple mesh gradient, mouse-reactive |
| `#hero-tagline` | Top-left copy; fades out on scroll via RevealLayer timeline |
| `#hero-bar` | Bottom nav: "→ V3.0" / social links / WORK INFO CONTACT |
| Nav links | **Click-driven** — smooth scroll to `#projects`, `#about`, `#contact` |
| `.chr-hover` | **Hover-driven** — char clip-path stagger animation on nav items |

### Hero scroll timeline (RevealLayer)
- **Trigger:** `#scroll-wrap` top→bottom, scrub 0.5
- Title pieces exit left/right; reveal images scale in
- Phrase "Essentially, we generate your ads using AI." chars blur-in
- On `#section-after` enter: reveal layer exits upward with backdrop blur

## 3. About Section (scroll-driven reveal)

**INTERACTION MODEL:** scroll-driven fade-up via IntersectionObserver (`useScrollReveal`)

- `.reveal-hidden` elements animate in when entering viewport
- About copy blocks + profile photo on right
- "Info →" link scrolls to about
- "V3.0" version label at low opacity

## 4. Projects List (hover-driven)

**INTERACTION MODEL:** hover-driven preview panel

- **Trigger:** `mouseenter` on `.proj-item`
- **Effect:** Fixed `#proj-preview` panel shows project video at cursor Y position
- Row text opacity: 0.2 → 1.0 on hover
- 10 projects with AD 01–10 labels and MP4 previews

## 5. Circle Gallery (scroll-driven pin)

**INTERACTION MODEL:** scroll-driven with ScrollTrigger pin + scrub

- **Trigger:** `#circle-gallery` pinned at `top top`
- **End:** `+=3755` scroll distance
- Ring rotates 270°; images fade in with stagger
- Center phrase scales up
- Lenis lerp changes: 0.04 inside gallery, 0.06 outside

## 6. Skills Section (click + sticky)

**INTERACTION MODEL:** sticky left panel + click-driven accordion

| Side | Behavior |
|------|----------|
| Left (60%) | `position: sticky; top: 0; height: 100vh` — "Services" heading + description |
| Right (40%) | Accordion groups — **click** toggles open/close (+ rotates 45°) |
| Default | First group open (index 0) |
| "Contact me" | Smooth scroll to `#contact` |

## 7. Testimonials (time-driven marquee)

**INTERACTION MODEL:** time-driven CSS animation + scroll entrance

- Two rows: row 1 scrolls **left**, row 2 scrolls **right**
- Animation: 40s linear infinite (`marquee-left` / `marquee-right`)
- Pauses on hover (`.marquee-row:hover .marquee-track { animation-play-state: paused }`)
- Section fades up on scroll enter (GSAP once trigger)

## 8. Contact Section (scroll-driven)

**INTERACTION MODEL:** scroll-driven scrub timeline

- **Background:** `#contact-bg` fixed light (#f0f0f0) appears on contact enter
- **Title:** "Contact" slides in from right (x: 110vw → 0)
- Social links + email clip-path reveal
- Image frames parallax upward on scroll
- Copy blocks fade/clip out as frames move
- Scroll timeline dots + % indicator fade out

## 9. Footer (scroll-driven reveal)

**INTERACTION MODEL:** scroll-driven fixed footer reveal

- **Position:** `fixed; bottom: 0; visibility: hidden` until footer transition
- **Trigger:** `#footer-transition` enters viewport
- ASCII art slides in from left/right (generated from PNG sources)
- Footer name chars animate up with stagger
- Mouse parallax on ASCII layers when visible
- `.chr-hover` on email + social links

## 10. Global Overlays

| Overlay | Behavior |
|---------|----------|
| `#scroll-pct` | Shows scroll progress `(0)`–`(100)` |
| `#scroll-timeline` | 7 dots — active section via ScrollTrigger `onEnter` |
| `#work-transition-overlay` | Flying "Work" text on projects approach |
| `#proj-cursor` | Custom cursor during project hover |

## Responsive Notes

| Breakpoint | Changes |
|------------|---------|
| ≤768px | Intro layout adjusts char positions; reveal exit distances reduced (35vw vs 55vw); footer ASCII cols: 50 vs 80 |
| 390px | Hero bar may stack; skills goes single column (check globals.css media queries) |

## Design References

- Desktop: `docs/design-references/retina-ads-desktop-1440.png`
- Mobile: `docs/design-references/retina-ads-mobile-390.png`
