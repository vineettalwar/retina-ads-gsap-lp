# TestimonialsSection Specification

## Overview
- **Target file:** `src/components/TestimonialsSection.tsx`
- **Screenshot:** `docs/design-references/testimonials-desktop.png`
- **Interaction model:** time-driven (auto-scrolling marquee, 2 rows in opposite directions)

## DOM Structure
```
#testimonials (section, bg: #0a0a0a, borderTop: 1px solid rgba(255,255,255,0.05))
  .testimonials-inner
    .testimonials-header
      .testimonials-subtitle — "Reviews"
      .testimonials-title — heading (animated, split text)
    .testimonials-marquee-wrap (flex column, gap: 40px, padding: 32px 0)
      .testimonials-marquee.marquee-left (row 1, scrolls left)
        .testimonial-card (×9 unique + duplicates for infinite loop)
      .testimonials-marquee.marquee-right (row 2, scrolls right)
        .testimonial-card (×9 unique + duplicates for infinite loop)
```

## Computed Styles

### #testimonials
- backgroundColor: rgb(10, 10, 10)
- borderTop: 1px solid rgba(255, 255, 255, 0.05)
- paddingTop: 112.65px
- paddingBottom: 112.65px
- overflow: hidden
- zIndex: 30010

### .testimonials-header
- paddingLeft: 48px or 64px (aligned with page)

### .testimonials-subtitle
- fontFamily: Breton, sans-serif
- fontSize: 19.2px
- fontWeight: 300
- letterSpacing: -0.384px
- color: rgb(240, 240, 240)
- marginBottom: 24px

### .testimonials-title
- fontFamily: Zirena, sans-serif (matches skills-text pattern) OR Breton
- fontSize: ~40-48px → clamp(24px, 3vw, 48px)
- fontWeight: 800
- color: rgb(240, 240, 240)
- lineHeight: 1.1
- marginBottom: 48px

### .testimonials-marquee-wrap
- display: flex
- flexDirection: column
- gap: 40px
- paddingTop: 32px
- paddingBottom: 32px
- overflow: visible (marquees clip via parent)

### .testimonials-marquee
- display: flex
- flexDirection: row
- height: 404.727px
- overflow: hidden
- width: 1440px

### .marquee-left track
- animation: marquee-left 40s linear infinite
- (scrolls from right to left)

### .marquee-right track
- animation: marquee-right 40s linear infinite
- (scrolls from left to right, opposite direction)

### .testimonial-card
- backgroundColor: rgba(14, 14, 14, 0.45)
- border: 1px solid rgba(255, 255, 255, 0.05)
- borderRadius: 16px
- padding: 40px
- display: flex
- flexDirection: column
- gap: 28.8px
- width: 380px
- height: 404.727px
- flexShrink: 0
- marginRight: 24px (gap between cards)

### .tc-stars
- fontSize: ~20px
- color: rgb(240, 240, 240) (star characters: ★★★★★)

### .tc-rating-num
- fontSize: 14px
- color: rgba(240, 240, 240, 0.6)
- marginLeft: 8px

### .tc-text (p)
- fontSize: 14px or 15px
- fontFamily: Inter
- lineHeight: 1.6
- color: rgb(240, 240, 240)
- opacity: 0.85
- flexGrow: 1

### .tc-name
- fontSize: 14px
- fontWeight: 600
- color: rgb(240, 240, 240)

### .tc-role
- fontSize: 12px
- color: rgba(240, 240, 240, 0.5)

## Testimonial Data (Row 1 — marquee-left, 9 unique cards repeated)
```
1. ★★★★★ 5.0 | Sarah Jenkins | CEO, Bloom & Glow E-com
   "Retina Ads completely transformed our digital presence. Their immersive GSAP-powered landing page looks like it is worth a million dollars and loads instantly, while their AI video ads outperformed our standard creative assets by 40%. Pure magic."

2. ★★★★½ 4.5 | Marc Dubois | Fondateur, Café Joyeux
   "Great experience! Retina Ads built a custom backend app for our logistics and beautiful product imagery for our coffee brand. It's super fast, robust, and completely revolutionized our daily operations."

3. ★★★★☆ 4.0 | Dave K. | Growth Lead, SneakerDrop
   "The GSAP-powered interactive sneaker page they built for us feels like a million bucks. Shoes float in 3D as you scroll, and our conversion rate is now higher than my daily caffeine intake. Simply brilliant."

4. ★★★★★ 5.0 | Sophie Martin | Directrice, Maison Green
   "The custom full-stack web application developed by Retina Ads, paired with Google Omni AI video ads, is a game-changer. Our customer acquisition cost dropped by 35% and the system runs autonomously."

5. ★★★★½ 4.5 | Alex Rivera | Founder, HydrateNow
   "Our new GSAP one-pager looks insanely premium—like a million-dollar site, honestly. Plus, their backend dashboard helps us track every single order effortlessly. Excellent engineering team."

6. ★★★★★ 5.0 | Chloé Bernard | Créatrice, Bijoux Célestes
   "I asked for a simple store but got a GSAP-powered masterpiece that literally makes jewelry sparkle on screen! My conversion rate is up 60%. I think the website is now worth more than my actual stock!"

7. ★★★★☆ 4.0 | Liam Patel | Operations, EcoClean Co.
   "Bespoke n8n workflows integrated into a custom frontend client dashboard built by Retina Ads. Excellent service, clean code, and our customer onboarding is now 100% automated."

8. ★★★★½ 4.5 | Marie Dubois | Fondatrice, E-com Seller
   "Top-tier product visuals and a stunning GSAP landing page. We finally have a million-dollar brand image without spending our entire annual budget. Truly highly recommended."

9. ★★★½☆ 3.5 | Jack Thornton | CEO, FitFuel DTC
   "Our last dev agency took months for a basic React app. Retina Ads built a high-performance GSAP page and robust backend in 10 days. The design looks so rich I felt underdressed browsing it."
```

## Testimonial Data (Row 2 — marquee-right, moves right)
```
10. ★★★★★ 5.0 | Emilie Roux | (role unknown)
    "The Google Omni model combined with Retina Ads' full-stack web development revolutionized our client acquisition. Our animated GSAP web experiences run continuously and generate high-quality leads."

11. ★★★★½ 4.5 | Tariq Al-Mansoor | (role unknown)
    "Super fast turnarounds on both our backend API and high-end frontend layout. The GSAP transitions are smooth as butter. Customer support is top-notch and always available."

12. ★★★★★ 5.0 | Lucie Petit | (role unknown)
    "A GSAP landing page so stunningly interactive that I spent 20 minutes just playing with the scroll animations. Sales skyrocketed instantly. My boss thinks we paid a million dollars for this!"

13. ★★★★☆ 4.0 | Marcus V. | (role unknown)
    "Their high-end GSAP landing page for our luxury watches is a masterpiece. The smooth kinetic animations give the brand a premium feel that is easily worth a million dollars, boosting our sales instantly."

14. ★★★★½ 4.5 | Nico & Claire | (role unknown)
    "We needed a playful GSAP-animated page for our new toy collection and a simple backend registry. Retina Ads delivered beautiful, colorful designs that matched our brand vibe perfectly within days."

15. ★★★★★ 5.0 | Samir Benali | (role unknown)
    "They delivered a custom backend application integrated with n8n that completely automates our order routing. It works on its own while our GSAP landing page closes deals. Pure magic."

16. ★★★★★ 5.0 | Isabella Rossi | (role unknown)
    "An incredible GSAP interactive showcase linked to a powerful backend app. Retina Ads combined elite web development with Google Omni AI video creatives to double our DTC brand conversion rate in weeks."

17. ★★★½☆ 3.5 | Olivier G. | (role unknown)
    "A fast and robust full-stack dashboard connected to our storefront. Combined with high-converting AI ads and a beautiful GSAP landing page, we have scaled our operations seamlessly."
```

## Text Content (verbatim)
- Subtitle: "Reviews"
- Title: "What our partners say about us."

## Assets
- No images required (avatar images were blocked/not loading on original)
- Use initials or colored circle placeholders for avatars

## States & Behaviors

### Marquee Animation
- Row 1 (marquee-left): scrolls left continuously, animation: marquee-left 40s linear infinite
- Row 2 (marquee-right): scrolls right continuously, animation: marquee-right 40s linear infinite
- Both rows pause on hover: `animation-play-state: paused` on hover
- Cards duplicate for seamless loop: render each set twice in a `.marquee-track` div

### Scroll reveal
- Header and marquee wrap fade in when entering viewport (opacity 0 → 1)
- `opacity: 0` initial → GSAP ScrollTrigger trigger

## Responsive Behavior
- **Desktop (1440px):** Two rows of scrolling cards
- **Mobile (390px):** Single row or vertically stacked cards; animation may be simpler
- **Breakpoint:** ~768px — reduce card width, adjust animation speed

## Implementation Notes
- For infinite marquee: duplicate card set inside `.marquee-track`, animate the whole track
- Track width = (card width + gap) × number_of_cards × 2
- CSS: `@keyframes marquee-left { from: translateX(0); to: translateX(-50%) }`
- Pause on hover: add `:hover { animation-play-state: paused }` to `.marquee-track`
