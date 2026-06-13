'use client'

import type { ReactNode } from 'react'

export function ProjectPreviewOverlay({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="proj-preview" id="proj-preview">
        <div className="proj-card" id="proj-card">
          <div className="proj-meta">
            <span className="proj-date" id="proj-date">
              AD 01
            </span>
            <span className="proj-label">Preview</span>
          </div>
          <video
            id="proj-cover"
            className="proj-video"
            src="/videos/ads/ad-01.mp4"
            poster="/images/retina-gallery/gallery-1.png"
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
      <div className="proj-cursor" id="proj-cursor">
        See project
      </div>
      {children}
    </>
  )
}
