# AboutSection Specification

## Overview
- **Target file:** `src/components/AboutSection.tsx`
- **Screenshot:** `docs/design-references/about-desktop.png`
- **Interaction model:** scroll-driven (elements animate into view)

## DOM Structure
```
#section-after (section, bg: #0a0a0a, z-index: 20010, relative)
  #about (div, position: relative, padding: 337.95px 64px 600.8px)
    #about-text (div) — large heading
    #about-sub (div) — body paragraph
    .about-btn (div, margin-left: ~262px) — "Info" button/link
    .about-version (div, margin-left: ~262px) — "V3.0"
    #about-photo-wrap (div, position: absolute) — profile photo
  #projects (div, position: relative, padding: 150.2px 0, z-index: 20010)
    #fluid-line-svg (svg, position: absolute) — animated SVG line
    .projects-inner (div, display: flex column align-center)
      .projects-list (div) — 10 project rows
```

## Computed Styles

### #section-after
- backgroundColor: rgb(10, 10, 10)
- position: relative
- width: 100%
- zIndex: 20010
- overflow: visible

### #about
- position: relative
- padding: 337.95px 64px 600.8px
- width: 100%

### #about-text
- fontFamily: Breton, sans-serif
- fontSize: 51.84px → use clamp(28px, 3.6vw, 52px)
- fontWeight: 400
- letterSpacing: -0.5184px
- lineHeight: 75.168px → lineHeight: 1.45
- color: rgb(240, 240, 240)
- maxWidth: 873.789px (60.7% of 1440)
- opacity: 1 (animates in)

### #about-sub
- fontFamily: Breton, sans-serif
- fontSize: 25.92px → use clamp(16px, 1.8vw, 26px)
- fontWeight: 400
- letterSpacing: -0.1296px
- lineHeight: 41.472px → lineHeight: 1.6
- color: rgb(240, 240, 240)
- maxWidth: 367.359px
- marginTop: 90.12px
- marginLeft: 262.398px (18.2% of 1440) — right-aligned under heading

### .about-btn
- fontSize: 16px
- fontFamily: Inter
- color: rgb(240, 240, 240)
- cursor: pointer
- marginTop: 56px
- marginLeft: 262.398px
- opacity: 1

### .about-version
- fontFamily: Breton, sans-serif
- fontSize: 51.84px
- fontWeight: 400
- letterSpacing: -0.5184px
- lineHeight: 75.168px
- color: rgb(240, 240, 240)
- marginTop: 120.16px
- opacity: 1

### #about-photo-wrap
- position: absolute
- width: 780px
- height: 707.633px
- overflow: hidden
- (position on right side of about section)

### Photo img
- src: /images/profile/prometheus.jpg
- width: 780px
- height: ~707px
- objectFit: cover

## Projects Section

### #projects
- position: relative
- width: 100%
- padding: 150.2px 0
- zIndex: 20010

### .projects-list
- display: flex
- flexDirection: column

### .proj-item
- fontFamily: Breton, sans-serif
- fontSize: 57.6px → use clamp(32px, 4vw, 58px)
- fontWeight: 400
- letterSpacing: -1.152px
- lineHeight: 74.88px → lineHeight: 1.3
- color: rgba(255, 255, 255, 0.2)  ← muted by default
- borderTop: 1px solid rgba(255, 255, 255, 0.08)
- borderBottom: 1px solid rgba(255, 255, 255, 0.08)
- paddingTop: 34.56px
- paddingBottom: 34.56px
- cursor: pointer
- display: block
- width: 475.203px (narrow left column)

### .proj-item hover state
- color changes from rgba(255,255,255,0.2) to rgba(255,255,255,1)
- transition: color 0.3s ease
- A project preview panel (#proj-preview) with thumbnail appears

## Per-State Content

### Projects List (10 items)
```
1. Coffee Grinder      | data-id: cyberdiag   | data-date: AD 01 | video: ad-01.mp4 | poster: gallery-1.png
2. Porsche GT3 RS      | data-id: anima       | data-date: AD 02 | video: ad-02.mp4 | poster: gallery-2.png
3. Nike Air Max        | data-id: cyberdiag-app | data-date: AD 03 | video: ad-03.mp4 | poster: gallery-3.png
4. Perfume Hallway     | data-id: zenith      | data-date: AD 04 | video: ad-04.mp4 | poster: gallery-4.png
5. Fantasia Dress      | data-id: skymcdb     | data-date: AD 05 | video: ad-05.mp4 | poster: gallery-5.png
6. Social Reel 01      | data-id: chromablock | data-date: AD 06 | video: ad-06.mp4 | poster: gallery-6.png
7. Social Reel 02      | data-id: symphony    | data-date: AD 07 | video: ad-07.mp4 | poster: gallery-7.png
8. Social Reel 03      | data-id: echo        | data-date: AD 08 | video: ad-08.mp4 | poster: gallery-8.png
9. Cake Campaign       | data-id: ad-cake     | data-date: AD 09 | video: ad-09.mp4 | poster: gallery-1.png
10. iPhone Campaign    | data-id: ad-iphone   | data-date: AD 10 | video: ad-10.mp4 | poster: gallery-2.png
```

## Text Content (verbatim)
- Heading: "As a next-generation creative agency, we marry generative AI and automation."
- Sub text: "We are Retina Ads. We believe world-class ad creatives, elite web development, and advanced business automation shouldn't carry a premium price tag. Utilizing Google's top and latest state-of-the-art model called Google Omni for cinematic video generation and NanoBanana for hyper-realistic product imagery, paired with high-end GSAP-powered landing pages that feel like they're worth millions and beyond."
- Version: "V3.0"
- Button: "Info"

## Assets
- Profile photo: `/images/profile/prometheus.jpg` (1024×929, covers 780×708px area)
- Project gallery images: `/images/retina-gallery/gallery-1.png` through `gallery-8.png`

## Responsive Behavior
- **Desktop (1440px):** About text left, photo right (absolute). Projects list narrow column
- **Mobile (390px):** Stacked, photo full width, font sizes scale down. Project items full width
- **Breakpoint:** ~768px — photo moves to flow, about-sub loses left margin

## Implementation Notes
- Use IntersectionObserver or GSAP ScrollTrigger to animate elements into view
- Project items: on hover show a floating preview div (right side) with poster image
- The about-sub has marginLeft: 262.398px creating a right-indented block under the heading
