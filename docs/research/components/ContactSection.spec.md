# ContactSection + Footer Specification

## Overview
- **Target file:** `src/components/ContactSection.tsx` and `src/components/Footer.tsx`
- **Screenshot:** `docs/design-references/contact-desktop.png`
- **Interaction model:** static (scroll-reveal)

## DOM Structure — Contact

```
#contact (section, position: relative, overflow: hidden, zIndex: 30015, bg: varies)
  #contact-title (div, position: absolute) — "Contact"
  #contact-dispo (div, position: absolute) — description text
  #contact-frame (div, position: absolute) — [social link buttons]
  #contact-dispo-2 (div) — secondary description
  #contact-frame-2 (div) — [social link buttons]
  #contact-bottom (div, position: absolute) — links + email
```

## Computed Styles — Contact

### #contact
- position: relative
- overflow: hidden
- height: 1351.8px
- width: 100%
- zIndex: 30015
- (background may be light/off-white as contact title is black text)

### #contact-title
- fontFamily: Zirena, sans-serif
- fontSize: 187.2px → use clamp(80px, 13vw, 187px)
- fontWeight: 800
- letterSpacing: -5.616px
- lineHeight: 168.48px → 0.9
- color: rgb(10, 10, 10) ← BLACK text (background must be light)
- position: absolute
- width: 700.602px

### #contact-dispo
- fontFamily: Inter
- fontSize: 16px
- fontWeight: 400
- color: rgb(240, 240, 240) OR dark color depending on bg
- position: absolute
- width: 180px
- lineHeight: 1.6

### #contact-frame (social links frame)
- Contains social/CTA buttons: LinkedIn, Behance
- Likely flex row of link buttons

### #contact-bottom
- display: flex
- flexDirection: column
- alignItems: flex-start
- gap: 22.4px
- position: absolute
- width: ~193.562px
- Contains: LinkedIn link, Behance link, theretina@proton.me email

## Text Content (verbatim)
- Title: "Contact"
- Dispo text: "Ready to scale your advertising and automate your operations? Our team is available immediately for campaigns."
- Dispo text 2: "We deliver custom n8n workflows and AI video/image ads for all budgets worldwide."
- Links: LinkedIn, Behance
- Email: theretina@proton.me

## DOM Structure — Footer

```
#footer (footer, position: fixed, bg: #0a0a0a, zIndex: 20008, height: 751px, width: 100vw)
  [inner] (display: flex, flexDirection: column, justifyContent: flex-end, height: 751px)
    .footer-top (position: absolute, padding: 40px 48px, justify-between)
      [left] — theretina@proton.me + © 2026
      [right nav] — LinkedIn / Behance / GitHub
    .footer-ascii-wrap (position: absolute, overflow: hidden)
      [ascii art animation — two columns]
    .footer-name (position: absolute, padding: 0 21.6px, justify-between, align-baseline)
      "Retina" (Breton font, large)
      "Ads." (Machine font, large)
```

## Computed Styles — Footer

### #footer
- position: fixed
- bottom: 0
- left: 0
- width: 100vw
- height: 751px (100vh)
- backgroundColor: rgb(10, 10, 10)
- zIndex: 20008
- overflow: hidden
- (fixed to bottom, revealed as you scroll to end)

### .footer-top
- position: absolute
- top: 0
- width: 100%
- padding: 40px 48px
- display: flex
- flexDirection: row
- justifyContent: space-between
- fontSize: 14px
- fontFamily: Inter
- color: rgb(240, 240, 240)
- opacity: 0.6

### .footer-name
- position: absolute
- bottom: 0 (or near bottom)
- width: 100%
- padding: 0 21.6px
- display: flex
- flexDirection: row
- justifyContent: space-between
- alignItems: baseline
- (Contains "Retina" left, "Ads." right in large Breton/Machine fonts)
- fontSize: ~170-200px (based on footer width / 2)

### .footer-ascii-wrap
- position: absolute
- overflow: hidden
- (middle section with ASCII art animation)

## Text Content (verbatim)
- Footer top left: theretina@proton.me  |  © 2026
- Footer top right: LinkedIn / Behance / GitHub
- Footer bottom: "Retina" (left) + "Ads." (right)

## Behavior
- Footer is FIXED at bottom (z-index: 20008)
- It appears to peek out from behind as content scrolls over it
- The contact section above it has a higher z-index (30015) and scrolls over the footer
- As you reach the end of the page, the footer becomes fully visible

## Responsive Behavior
- **Desktop (1440px):** Fixed footer visible at bottom
- **Mobile (390px):** Footer smaller, font sizes reduce
