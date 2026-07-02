'use client'
// components/ui/SidebarNav.tsx

import { useScene } from '@/components/providers/SceneProvider'
import { PROFILE } from '@/data/profile'
import type { SceneID } from '@/types'

const ITEMS: { num: string; label: string; scene: SceneID }[] = [
  { num: '01', label: 'WELCOME',    scene: 'asteroid_belt' },
  { num: '02', label: 'ABOUT ME',   scene: 'asteroid_belt' },
  { num: '03', label: 'UNIVERSE',   scene: 'solar_hub' },
  { num: '04', label: 'PROJECTS',   scene: 'project_stars' },
  { num: '05', label: 'SKILLS',     scene: 'solar_hub' },
  { num: '06', label: 'EXPERIENCE', scene: 'experience_station' },
  { num: '07', label: 'CONTACT',    scene: 'contact_station' },
]

const SOCIALS = [
  { icon: 'in', link: PROFILE.linkedin, label: 'LinkedIn' },
  { icon: '⬡',  link: PROFILE.github,   label: 'GitHub' },
  { icon: '✉',  link: `mailto:${PROFILE.email}`, label: 'Email' },
  { icon: '📄', link: PROFILE.resume,   label: 'Resume' },
]

export default function SidebarNav() {
  const { currentScene, navigateTo, setShowAbout } = useScene()

  return (
    <>
      {/* Left sidebar — numbered nav (hidden on asteroid belt hero) */}
      {currentScene !== 'asteroid_belt' && (
        <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-1 hidden lg:flex">
          {ITEMS.map(item => {
            const isActive = item.scene === currentScene
            return (
              <button
                key={item.num}
                onClick={() => navigateTo(item.scene)}
                className="flex items-center gap-3 group text-left"
              >
                <span
                  className="font-mono text-[8px] tracking-[2px] transition-all duration-300 w-7"
                  style={{ color: isActive ? '#8B7FFF' : '#333' }}
                >
                  {item.num}
                </span>
                <div
                  className="h-[1px] transition-all duration-300"
                  style={{ width: isActive ? 24 : 10, background: isActive ? '#8B7FFF' : '#2a2a3a' }}
                />
                <span
                  className="font-mono text-[8px] tracking-[2px] transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ color: '#8B7FFF' }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      )}

      {/* Left social icons — on hero scene */}
      {currentScene === 'asteroid_belt' && (
        <div className="fixed left-5 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.link}
              target={s.link.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              title={s.label}
              className="w-9 h-9 flex items-center justify-center font-mono text-[11px] transition-all duration-300 hover:scale-110"
              style={{
                color:      '#555',
                border:     '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(5,5,15,0.6)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#8B7FFF'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,127,255,0.4)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      )}

      {/* Scroll hint */}
      {currentScene === 'asteroid_belt' && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-mono text-[8px] tracking-[4px] text-[#2a2a3a]">SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-[rgba(139,127,255,0.4)] to-transparent" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        </div>
      )}
    </>
  )
}
