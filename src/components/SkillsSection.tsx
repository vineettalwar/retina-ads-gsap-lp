'use client'

import { useState } from 'react'
import { useScrollTo } from '@/context/ScrollSmootherContext'
import { getContactScrollOffset } from '@/lib/scroll-targets'
import { RETINA_COPY } from '@/content/retina-fr'

interface SkillGroupData {
  title: string
  items: string[]
}

const skillGroups: SkillGroupData[] = RETINA_COPY.skills.groups.map((group) => ({
  title: group.title,
  items: [...group.items],
}))

function SkillGroup({ title, items, isOpen, onToggle }: SkillGroupData & { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="skill-group" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', width: '100%' }}>
      <div
        className="skill-header"
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
          className="skill-header-title"
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
          className="skill-toggle"
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
        className="skill-items"
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
    <section id="skills">
      <div className="skills-inner">
        <div className="skills-left">
          <div className="skills-subtitle">{RETINA_COPY.skills.subtitle}</div>
          <div className="skills-text">{RETINA_COPY.skills.text}</div>
          <div className="skills-separator" />
          <button
            type="button"
            className="skills-contact-btn"
            onClick={() => scrollTo('#contact', getContactScrollOffset())}
          >
            {RETINA_COPY.skills.contactCta}
          </button>
          <div className="skills-arrow" aria-hidden="true">
            ↗
          </div>
        </div>

        <div className="skills-right" id="skills-right">
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
