'use client'

import { RETINA_COPY, RETINA_SOCIAL } from '@/content/retina-fr'

export function ContactSection() {
  return (
    <>
      <div id="contact-bg" aria-hidden="true" />
      <section id="contact">
        <div id="contact-pin">
          <h2 id="contact-title">{RETINA_COPY.contact.title}</h2>

          <p
            id="contact-dispo"
            style={{
              position: 'absolute',
              top: 'clamp(72px, 9vw, 130px)',
              left: 'clamp(380px, 50vw, 720px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              lineHeight: 1.6,
              color: '#0a0a0a',
              maxWidth: 180,
              margin: 0,
              zIndex: 2,
            }}
          >
            {RETINA_COPY.contact.dispo1.before}
            <span className="other-accent">{RETINA_COPY.contact.dispo1.accent}</span>
            {RETINA_COPY.contact.dispo1.after}
          </p>

          <div
            id="contact-frame"
            style={{
              position: 'absolute',
              top: 'clamp(72px, 9vw, 130px)',
              right: 'clamp(24px, 4.4vw, 64px)',
              width: 'clamp(180px, 22vw, 320px)',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <div id="contact-frame-img" style={{ willChange: 'transform' }}>
              <img
                src="/images/art/Untitled2.png"
                alt=""
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
              />
            </div>
          </div>

          <div
            id="contact-bottom"
            style={{
              position: 'absolute',
              bottom: 'clamp(120px, 18vh, 220px)',
              left: 'clamp(24px, 4.4vw, 64px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 22,
              width: 'clamp(160px, 14vw, 194px)',
              zIndex: 2,
            }}
          >
            <div id="contact-socials" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <a
                href={RETINA_SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                }}
              >
                LinkedIn
              </a>
              <a
                href={RETINA_SOCIAL.behance}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                }}
              >
                Behance
              </a>
            </div>
            <div id="contact-mail">
              <a
                href="mailto:theretina@proton.me"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#0a0a0a',
                  textDecoration: 'none',
                }}
              >
                theretina@proton.me
              </a>
            </div>
          </div>

          <div
            id="contact-frame-2"
            style={{
              position: 'absolute',
              bottom: 'clamp(48px, 10vh, 100px)',
              left: 'clamp(200px, 28vw, 400px)',
              width: 'clamp(280px, 35vw, 480px)',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <div id="contact-frame-img-2" style={{ willChange: 'transform' }}>
              <img
                src="/images/art/Untitled1.png"
                alt=""
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
              />
            </div>
          </div>

          <p
            id="contact-dispo-2"
            style={{
              position: 'absolute',
              bottom: 'clamp(160px, 24vh, 280px)',
              right: 'clamp(24px, 4.4vw, 64px)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              lineHeight: 1.6,
              color: '#0a0a0a',
              maxWidth: 180,
              margin: 0,
              textAlign: 'left',
              zIndex: 2,
            }}
          >
            {RETINA_COPY.contact.dispo2.before}
            <span className="other-accent">{RETINA_COPY.contact.dispo2.accent}</span>
            {RETINA_COPY.contact.dispo2.after}
          </p>
        </div>
      </section>
    </>
  )
}
