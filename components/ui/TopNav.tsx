'use client'
// components/ui/TopNav.tsx

import { useScene } from '@/components/providers/SceneProvider'
import { SCENE_CONFIGS } from '@/data/scene-configs'
import type { SceneID } from '@/types'

const NAV_ITEMS: { label: string; scene: SceneID | null; id: string }[] = [
  { label: 'HOME',       scene: 'asteroid_belt',      id: '01' },
  { label: 'ABOUT',      scene: 'asteroid_belt',      id: '02' },
  { label: 'UNIVERSE',   scene: 'solar_hub',          id: '03' },
  { label: 'PROJECTS',   scene: 'project_stars',      id: '04' },
  { label: 'SKILLS',     scene: 'solar_hub',          id: '05' },
  { label: 'EXPERIENCE', scene: 'experience_station', id: '06' },
  { label: 'CONTACT',    scene: 'contact_station',    id: '07' },
]

export default function TopNav() {
  const { currentScene, navigateTo, soundEnabled, setSoundEnabled } = useScene()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4"
      style={{
        background: 'linear-gradient(to bottom, rgba(5,5,15,0.9) 0%, transparent 100%)',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm text-white"
          style={{ background: 'rgba(139,127,255,0.2)', border: '1px solid rgba(139,127,255,0.4)' }}
        >
          SP
        </div>
        <span className="font-mono text-[10px] tracking-[4px] text-[#8B7FFF] hidden sm:block">
          SHYAM'S UNIVERSE
        </span>
      </div>

      {/* Center Nav Links */}
      <div
        className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full"
        style={{ background: 'rgba(10,10,30,0.7)', border: '1px solid rgba(139,127,255,0.15)' }}
      >
        {NAV_ITEMS.map(item => {
          const isActive = item.scene === currentScene
          return (
            <button
              key={item.id}
              onClick={() => item.scene && navigateTo(item.scene)}
              className="relative px-4 py-1.5 font-mono text-[9px] tracking-[2px] transition-all duration-300 rounded-full"
              style={{
                color:      isActive ? '#fff' : '#444',
                background: isActive ? 'rgba(139,127,255,0.25)' : 'transparent',
                borderBottom: isActive ? '1px solid #8B7FFF' : '1px solid transparent',
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] tracking-[2px] transition-all duration-300"
          style={{
            color:   soundEnabled ? '#8B7FFF' : '#333',
            border:  `1px solid ${soundEnabled ? 'rgba(139,127,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
            background: soundEnabled ? 'rgba(139,127,255,0.1)' : 'transparent',
          }}
        >
          <span>{soundEnabled ? '🔊' : '🔇'}</span>
          <span className="hidden sm:inline">SOUND {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Menu dots (mobile) */}
        <button className="md:hidden flex flex-col gap-1 p-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-4 h-[1px] bg-[#8B7FFF]" />
          ))}
        </button>
      </div>
    </nav>
  )
}
