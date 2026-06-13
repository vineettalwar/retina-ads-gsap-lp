# SkillsSection Specification

## Overview
- **Target file:** `src/components/SkillsSection.tsx`
- **Screenshot:** `docs/design-references/skills-desktop.png`
- **Interaction model:** scroll-driven sticky left panel + scrolling right accordion

## DOM Structure
```
#skills (section, bg: #0a0a0a, z-index: 30010)
  [inner wrapper] (display: flex, flex-row, align-items: flex-start)
    .skills-left (div, position: sticky, width: 864px, height: 751px, padding: 112.65px 64px 0 128px)
      .skills-subtitle — "Services"
      .skills-text — heading
      .skills-separator — horizontal line
      [contact-btn div] — "Contact me"
      .skills-arrow — large "↗" arrow in purple
    .skills-right#skills-right (div, width: 576px, padding: 112.65px 32px 375.5px 64px)
      .skill-group.open (×1) — Web Development (expanded)
      .skill-group (×7) — others (collapsed)
```

## Computed Styles

### #skills
- backgroundColor: rgb(10, 10, 10)
- position: relative
- zIndex: 30010
- paddingBottom: 225.3px

### Inner wrapper
- display: flex
- flexDirection: row
- alignItems: flex-start
- width: 100%

### .skills-left
- position: sticky
- top: 0
- width: 864px (60% of 1440)
- height: 751px (100vh)
- display: flex
- flexDirection: column
- justifyContent: flex-start
- paddingTop: 112.65px
- paddingLeft: 128px
- paddingRight: 64px

### .skills-subtitle
- fontFamily: Breton, sans-serif
- fontSize: 19.2px
- fontWeight: 300
- letterSpacing: -0.384px
- lineHeight: 23.04px
- color: rgb(240, 240, 240)
- marginBottom: 40px

### .skills-text
- fontFamily: Zirena, sans-serif
- fontSize: 40px → clamp(24px, 2.8vw, 40px)
- fontWeight: 800
- lineHeight: 44px → 1.1
- color: rgb(240, 240, 240)
- maxWidth: 672px

### .skills-separator
- backgroundColor: rgba(255, 255, 255, 0.15)
- height: 1px
- width: 672px
- marginTop: 48px
- marginBottom: 48px

### Contact Me button area
- fontSize: 16px
- fontFamily: Inter
- color: rgb(240, 240, 240)
- cursor: pointer

### .skills-arrow
- color: rgb(124, 60, 255)  ← purple accent
- fontSize: 192px
- lineHeight: 192px
- height: 240px
- width: 672px
- (displays "↗" or arrow character in purple)

### .skills-right
- width: 576px (40% of 1440)
- paddingTop: 112.65px
- paddingLeft: 32px
- paddingRight: 64px
- paddingBottom: 375.5px

### .skill-group
- width: 480px
- borderBottom: 1px solid rgba(255, 255, 255, 0.08)

### .skill-header
- display: flex
- flexDirection: row
- justifyContent: space-between
- alignItems: center
- paddingTop: 28.8px
- paddingBottom: 28.8px
- height: 127.594px
- cursor: pointer

### .skill-header-title
- fontFamily: Breton, sans-serif (approximate; could be Inter)
- fontSize: ~19.2px to ~24px
- color: rgb(240, 240, 240)
- letterSpacing: -0.384px

### .skill-header-icon
- A "+" or "×" icon (open/closed state)
- color: rgb(240, 240, 240)

### .skill-body (open)
- height: 279px
- overflow: hidden
- transition: height 0.4s ease

### .skill-body (closed)
- height: 0
- overflow: hidden

### .skill-body-inner (ul)
- paddingBottom: 28.8px
- list items with bullet points

## States & Behaviors

### Accordion: Click to expand/collapse
- **Trigger:** click on `.skill-header`
- **State A (closed):** `.skill-body` height: 0, overflow: hidden; icon shows "+"
- **State B (open):** `.skill-body` height: auto/279px; icon shows "×" or "−"
- **Transition:** height 0.4s ease (CSS transition or GSAP)
- Only one group is open at a time (or multiple — check original)

### Scroll behavior
- Left panel is `position: sticky; top: 0` so it stays visible while right panel scrolls
- INTERACTION MODEL: scroll-driven sticky layout + click accordion

## Per-State Content

### Skill Groups (8 total)
1. **Web Development** (open by default)
   - Landing pages GSAP haut de gamme
   - Applications frontend & backend
   - Interfaces immersives 3D
   - Architectures full-stack sur mesure
   - Expériences premium

2. **Video Generation**
   - Google Omni
   - Publicités de marque
   - Vidéos courtes / Reels
   - Hooks viraux
   - Ad Concepts

3. **Image Generation**
   - NanoBanana
   - Photos de produits
   - Bannières e-commerce
   - Modèles photoréalistes
   - Mockups créatifs

4. **n8n Automation**
   - Flux sur mesure
   - Capture de prospects
   - Synchronisation CRM
   - Publication automatisée
   - Traitement de données

5. **n8n Hosting**
   - Serveurs cloud dédiés
   - Uptime 99.9% garanti
   - Scalabilité cloud
   - Sauvegardes automatiques
   - Sécurité renforcée

6. **Target Audience**
   - Micro-influenceurs
   - Huge influencers
   - Petites marques DTC
   - Grands comptes
   - E-commerçants

7. **Retina Advantage**
   - Coûts extrêmement bas
   - Livraison ultra-rapide
   - Zéro frais inutiles
   - Support disponible
   - Volume de production élevé

8. **AI Technologies**
   - Google Omni
   - NanoBanana
   - n8n Automations
   - Cloud Stack

## Text Content (verbatim)
- Subtitle: "Services"
- Heading: "High-fidelity creative AI production and operational automation for small and huge brands, as well as influencers, at ultra-low costs."
- CTA button: "Contact me"
- Arrow: "↗"

## Assets
- None (text-only section)

## Responsive Behavior
- **Desktop (1440px):** 60/40 split, left sticky
- **Tablet (768px):** Left panel shrinks, right panel full width below
- **Mobile (390px):** Single column; left panel becomes header; skills stack
- **Breakpoint:** ~768px — switches to single column

## Implementation Notes
- Use `useState` for accordion open/close
- CSS transition for skill-body height: `grid-template-rows: 0fr → 1fr` trick or max-height
- Left sticky: `position: sticky; top: 0; height: 100vh`
