'use client'

import { useRef } from 'react'
import type { ProjectItem } from '@/types'
import { useIntro } from '@/context/IntroContext'
import { useProjectsScroll } from '@/hooks/useProjectsScroll'

export const projects: ProjectItem[] = [
  { id: 'cyberdiag', title: 'Coffee Grinder', date: 'AD 01', video: '/videos/ads/ad-01.mp4', poster: '/images/retina-gallery/gallery-1.png' },
  { id: 'anima', title: 'Porsche GT3 RS', date: 'AD 02', video: '/videos/ads/ad-02.mp4', poster: '/images/retina-gallery/gallery-2.png' },
  { id: 'cyberdiag-app', title: 'Nike Air Max', date: 'AD 03', video: '/videos/ads/ad-03.mp4', poster: '/images/retina-gallery/gallery-3.png' },
  { id: 'zenith', title: 'Perfume Hallway', date: 'AD 04', video: '/videos/ads/ad-04.mp4', poster: '/images/retina-gallery/gallery-4.png' },
  { id: 'skymcdb', title: 'Fantasia Dress', date: 'AD 05', video: '/videos/ads/ad-05.mp4', poster: '/images/retina-gallery/gallery-5.png' },
  { id: 'chromablock', title: 'Social Reel 01', date: 'AD 06', video: '/videos/ads/ad-06.mp4', poster: '/images/retina-gallery/gallery-6.png' },
  { id: 'symphony', title: 'Social Reel 02', date: 'AD 07', video: '/videos/ads/ad-07.mp4', poster: '/images/retina-gallery/gallery-7.png' },
  { id: 'echo', title: 'Social Reel 03', date: 'AD 08', video: '/videos/ads/ad-08.mp4', poster: '/images/retina-gallery/gallery-8.png' },
  { id: 'ad-cake', title: 'Cake Campaign', date: 'AD 09', video: '/videos/ads/ad-09.mp4', poster: '/images/retina-gallery/gallery-1.png' },
  { id: 'ad-iphone', title: 'iPhone Campaign', date: 'AD 10', video: '/videos/ads/ad-10.mp4', poster: '/images/retina-gallery/gallery-2.png' },
]

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { introComplete } = useIntro()

  useProjectsScroll(sectionRef, introComplete)

  return (
    <div ref={sectionRef} className="projects" id="projects">
      <svg
        className="fluid-line-svg"
        id="fluid-line-svg"
        viewBox="0 0 1400 1400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          className="fluid-line"
          id="fluid-line"
          d="M -80,0 C 300,-20 600,150 540,400 C 490,650 0,655 300,1050 C 600,1385 650,1250 850,1200 C 1050,1150 1350,1250 1540,1300"
        />
      </svg>

      <div className="projects-inner">
        <div className="projects-list" id="projects-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="proj-item"
              data-id={project.id}
              data-video={project.video}
              data-poster={project.poster}
              data-date={project.date}
            >
              {project.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
