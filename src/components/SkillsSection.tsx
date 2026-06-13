'use client'

import { useState } from 'react'
import { useScrollTo } from '@/context/ScrollSmootherContext'
import { getContactScrollOffset } from '@/lib/scroll-targets'

interface SkillGroupData {
  title: string
  items: string[]
}

const skillGroups: SkillGroupData[] = [
  {
    title: 'Web Development',
    items: ['Premium GSAP landing pages', 'Frontend & backend applications', 'Immersive 3D interfaces', 'Custom full-stack architectures', 'Premium animated experiences', 'Ultra-fast performance'],
  },
  {
    title: 'Video Generation',
    items: ['Google Omni', 'Brand advertisements', 'Short videos / Reels', 'Viral hooks', 'Ad concepts', 'AI motion'],
  },
  {
    title: 'Image Generation',
    items: ['NanoBanana', 'Product photos', 'E-commerce banners', 'Photorealistic models', 'Creative mockups', 'Campaign visuals'],
  },
  {
    title: 'n8n Automation',
    items: ['Custom workflows', 'Lead capture', 'CRM synchronization', 'Automated publishing', 'Data processing', 'AI reports'],
  },
  {
    title: 'n8n Hosting',
    items: ['Dedicated cloud servers', '99.9% uptime guarantee', 'Cloud scalability', 'Automatic backups', 'Enhanced security', 'Managed instances'],
  },
  {
    title: 'Target Audience',
    items: ['Micro-influencers', 'Huge influencers', 'Small DTC brands', 'Enterprise accounts', 'E-commerce sellers', 'Content creators'],
  },
  {
    title: 'Retina Advantage',
    items: ['Extremely low costs', 'Ultra-fast delivery', 'Zero unnecessary fees', 'Available support', 'Scalable volume', 'ROI-focused approach'],
  },
  {
    title: 'AI Technologies',
    items: ['Google Omni', 'NanoBanana', 'n8n Automations', 'Cloud Stack'],
  },
]

function SkillGroup({ title, items, isOpen, onToggle }: SkillGroupData & { isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '28.8px',
          paddingBottom: isOpen ? '16px' : '28.8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'Breton, sans-serif',
            fontSize: 'clamp(18px, 1.7vw, 24px)',
            fontWeight: 400,
            letterSpacing: '-0.3px',
            color: '#f0f0f0',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 20,
            color: '#f0f0f0',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            display: 'inline-block',
            lineHeight: 1,
            marginLeft: 16,
          }}
        >
          +
        </span>
      </div>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? '500px' : '0',
          transition: 'max-height 0.4s ease',
        }}
      >
        <ul style={{ listStyle: 'none', padding: '0 0 28.8px 0', margin: 0 }}>
          {items.map((item) => (
            <li
              key={item}
              style={{
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
                color: 'rgba(240,240,240,0.65)',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ color: 'rgba(124,60,255,0.8)', flexShrink: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function SkillsSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const scrollTo = useScrollTo()

  return (
    <section
      id="skills"
      style={{
        backgroundColor: '#0a0a0a',
        position: 'relative',
        zIndex: 'var(--z-skills)' as unknown as number,
        paddingBottom: '225.3px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>

        {/* LEFT — sticky */}
        <div
          className="skills-left"
          style={{
            position: 'sticky',
            top: 0,
            width: '60%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'clamp(64px, 7.8vw, 112px)',
            paddingLeft: 'clamp(32px, 8.9vw, 128px)',
            paddingRight: 'clamp(16px, 4.4vw, 64px)',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="skills-subtitle"
            style={{
              fontFamily: 'Breton, sans-serif',
              fontSize: 19.2,
              fontWeight: 300,
              letterSpacing: '-0.384px',
              lineHeight: '23.04px',
              color: '#f0f0f0',
              marginBottom: 40,
            }}
          >
            Services
          </div>

          <div
            className="skills-text"
            style={{
              fontFamily: 'Zirena, sans-serif',
              fontSize: 'clamp(22px, 2.8vw, 40px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#f0f0f0',
              maxWidth: '100%',
            }}
          >
            High-fidelity creative AI production and operational automation for small and huge brands, as well as influencers, at ultra-low costs.
          </div>

          <div
            className="skills-separator"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              height: 1,
              width: '100%',
              marginTop: 48,
              marginBottom: 48,
            }}
          />

          <button
            type="button"
            onClick={() => scrollTo('#contact', getContactScrollOffset())}
            style={{
              fontSize: 16,
              fontFamily: 'Inter, sans-serif',
              color: '#f0f0f0',
              cursor: 'pointer',
              opacity: 0.8,
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            Contact me
          </button>

          {/* Purple arrow */}
          <div
            className="skills-arrow"
            style={{
              color: 'rgb(124,60,255)',
              fontSize: 'clamp(60px, 13vw, 192px)',
              lineHeight: 1,
              marginTop: 'auto',
              cursor: 'pointer',
            }}
          >
            ↗
          </div>
        </div>

        {/* RIGHT — scrolling accordion */}
        <div
          id="skills-right"
          style={{
            width: '40%',
            paddingTop: 'clamp(64px, 7.8vw, 112px)',
            paddingLeft: 'clamp(16px, 2.2vw, 32px)',
            paddingRight: 'clamp(16px, 4.4vw, 64px)',
            paddingBottom: '375.5px',
            boxSizing: 'border-box',
          }}
        >
          {skillGroups.map((group, i) => (
            <SkillGroup
              key={group.title}
              {...group}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
