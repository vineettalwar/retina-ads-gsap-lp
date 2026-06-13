# CircleGallery Specification

## Overview
- **Target file:** `src/components/CircleGallery.tsx`
- **Screenshot:** `docs/design-references/circle-gallery-desktop.png`
- **Interaction model:** scroll-driven with GSAP ScrollTrigger (pinned section)

## DOM Structure
```
#circle-gallery (section, bg: #0a0a0a, overflow: hidden, z-index: 20001)
  .pin-spacer (GSAP pin spacer, height: 4506px, paddingBottom: 3755px)
    [sticky inner] (display: flex, align-center, justify-center, height: 751px)
      .cg-img (×8 absolutely positioned divs — orbital image positions)
      #cg-phrase (p — center text)
```

## Computed Styles

### #circle-gallery
- backgroundColor: rgb(10, 10, 10)
- overflow: hidden
- position: relative
- zIndex: 20001
- height: ~4506px (scroll-through space for pinned animation)

### Sticky inner container
- display: flex
- flexDirection: row
- alignItems: center
- justifyContent: center
- width: 100vw
- height: 100vh (751px)
- position: sticky
- top: 0
- overflow: visible

### .cg-img (×8 orbital image containers)
- position: absolute
- width: ~201.594px
- height: ~134.391px
- opacity: 0 initially → animates to 1 as scroll progresses
- Each `.cg-img` is positioned around a circle
- Contains 10 children (one per project, cycling through)
- GSAP rotates them around center on scroll

### #cg-phrase
- fontFamily: Breton, sans-serif
- fontSize: 50.4px → clamp(28px, 3.5vw, 50px)
- fontWeight: 400
- lineHeight: 65.52px → 1.3
- color: rgb(255, 255, 255)
- position: absolute
- width: 600px
- textAlign: center (implied)
- (centered in viewport)

## Gallery Images
The 8 orbital positions show gallery images from:
- `/images/retina-gallery/gallery-1.png` through `gallery-8.png`

## Implementation Approach
Since we can't reproduce the exact GSAP ScrollTrigger orbital animation precisely without the original JS, implement as:

1. A **pinned section** using CSS `position: sticky`
2. A **rotating gallery ring** of 8 images arranged in a circle
3. On scroll, use JavaScript IntersectionObserver to detect scroll progress and rotate
4. Images appear/fade in as the section is scrolled through
5. Center text stays visible throughout

### Circle Arrangement (8 images at radius ~320px):
- Image 1: top (0°)
- Image 2: top-right (45°)
- Image 3: right (90°)
- Image 4: bottom-right (135°)
- Image 5: bottom (180°)
- Image 6: bottom-left (225°)
- Image 7: left (270°)
- Image 8: top-left (315°)

Each image offset from center:
- x = cos(angle) × 320px
- y = sin(angle) × 200px (elliptical)

## Text Content (verbatim)
"Each campaign is designed to maximize your impact, automate your growth and divide your costs."

## Responsive Behavior
- **Desktop (1440px):** Full circle gallery with images
- **Mobile (390px):** Images arranged in a tighter circle or grid; smaller phrase text
- **Breakpoint:** ~768px — radius reduces, images smaller

## Implementation Notes
- Use `useRef` + `useEffect` for scroll tracking
- Wrap in sufficient height div (~4000px) to allow scroll-through
- Inner element is sticky at top: 0
- Use CSS `transform: translate()` for orbital positions
- Image aspect ratio: ~3:2 (201×134 ≈ 1.5)
