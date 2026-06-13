# Page Topology — Retina Ads

## URL
https://retina-ads.vercel.app/

## Overall Architecture
The page uses a layered z-index stacking system with GSAP + Lenis smooth scroll.
Body children are a mix of fixed overlays and scrolling sections.

## Z-Index Layers (bottom to top)
- Z 5: `#contact-bg` (fixed, hidden background)
- Z 20001: `#circle-gallery` (section)
- Z 20007: `#footer-transition`
- Z 20008: `#footer` (FIXED — revealed as you scroll)
- Z 20010: `#section-after` + `#projects` (sections)
- Z 30005: `#proj-preview` (fixed project preview panel)
- Z 30006: `#proj-cursor` (fixed cursor effect)
- Z 30010: `#skills`, `#testimonials`
- Z 30012: `#contact-blob-wrap`, `#page-fade`
- Z 30015: `#contact`, `#scroll-pct`, `#scroll-timeline`
- Z 30030: `#flying-title`, `#work-transition-overlay`
- Z 30035: `#work-flying-text`
- Z 10002: `#reveal-image-wrap` (fixed)
- Z 10005: `#name-layer` (FIXED — the "Retina Ads." title)

## Sections (Top to Bottom, Scroll Order)

### 1. HERO (sticky, inside #scroll-wrap)
- **Position:** Fixed overlay + Sticky scroll
- **Height:** 3004px (scroll-wrap) / 751px (viewport)
- **Z-index:** 10005 (name-layer)
- **Interaction:** Scroll-driven (canvas animates, title stays fixed)
- **Components:** NameLayer (title), HeroSection (canvas + bar)

### 2. ABOUT (#section-after > #about)
- **Position:** Relative, flow
- **Height:** ~2363px (padded for scroll space)
- **Z-index:** 20010
- **Interaction:** Static with scroll-reveal animations
- **Components:** AboutSection

### 3. PROJECTS (#section-after > #projects)
- **Position:** Relative, flow
- **Height:** ~1051px
- **Z-index:** 20010
- **Interaction:** Hover for project preview
- **Components:** ProjectsList (part of AboutSection)

### 4. CIRCLE GALLERY (#circle-gallery)
- **Position:** Relative, pinned with GSAP ScrollTrigger
- **Height:** ~4506px (scroll-through)
- **Z-index:** 20001
- **Interaction:** Scroll-driven orbital gallery

### 5. SKILLS (#skills)
- **Position:** Relative with sticky left panel
- **Height:** ~2013px
- **Z-index:** 30010
- **Interaction:** Left sticky + right accordion (click)

### 6. TESTIMONIALS (#testimonials)
- **Position:** Relative, flow
- **Height:** ~1362px
- **Z-index:** 30010
- **Interaction:** Auto-scrolling marquee (time-driven)

### 7. CONTACT (#contact)
- **Position:** Relative, flow
- **Height:** ~1351px
- **Z-index:** 30015
- **Interaction:** Static

### 8. FOOTER (#footer)
- **Position:** FIXED at bottom
- **Height:** 751px (full viewport)
- **Z-index:** 20008
- **Interaction:** Revealed as contact section scrolls past

## Fixed Overlays (Always Present)
- `#name-layer`: Hero title "Retina Ads." (z: 10005)
- `#footer`: Footer (z: 20008)
- `#proj-preview`: Project thumbnail preview (z: 30005)
- `#scroll-pct`: Debug "(0)" scroll indicator (z: 30015)
- `#scroll-timeline`: Timeline dots (z: 30015)

## Total Page Height
~16,253px (from scrollHeight)

## Libraries
- **GSAP** + ScrollTrigger: All animations
- **Lenis**: Smooth scroll (replaces native scroll)
- **SplitText**: Letter-by-letter text splitting for GSAP animations
