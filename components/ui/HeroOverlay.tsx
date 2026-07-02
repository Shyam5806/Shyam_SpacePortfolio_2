'use client'
// components/ui/HeroOverlay.tsx

import { useScene } from '@/components/providers/SceneProvider'
import { PROFILE } from '@/data/profile'

export default function HeroOverlay() {
  const { currentScene, navigateTo, isTransitioning } = useScene()
  if (currentScene !== 'asteroid_belt') return null

  return (
    <>
      {/* Role pills — centered below name (Three.js renders the name) */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[90] flex flex-wrap justify-center gap-2"
        style={{ top: 'calc(50% + 40px)' }}
      >
        {PROFILE.roles.map(role => (
          <span
            key={role}
            className="font-mono text-[9px] tracking-[2px] px-4 py-1.5"
            style={{
              border:     '1px solid rgba(139,127,255,0.3)',
              background: 'rgba(5,5,15,0.7)',
              color:      '#8B7FFF',
            }}
          >
            {role}
          </span>
        ))}
      </div>

      {/* Enter Universe button */}
      <div className="fixed bottom-10 left-1/2 z-[200]" style={{ transform: 'translateX(-50%)' }}>
        <button
          onClick={() => !isTransitioning && navigateTo('solar_hub')}
          disabled={isTransitioning}
          className="flex items-center gap-3 font-mono text-[11px] tracking-[5px] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            padding:    '14px 40px',
            border:     '1px solid rgba(139,127,255,0.5)',
            background: 'rgba(139,127,255,0.08)',
            boxShadow:  '0 0 30px rgba(139,127,255,0.15), inset 0 0 30px rgba(139,127,255,0.05)',
            animation:  'floatY 2.4s ease-in-out infinite',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(139,127,255,0.18)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(139,127,255,0.08)'}
        >
          <span>🚀</span>
          EXPLORE THE UNIVERSE
          <span>→</span>
        </button>
      </div>

      {/* Location / status widget — top right */}
      <div
        className="fixed top-[72px] right-5 z-[100] font-mono text-[9px] p-4 w-[190px] hidden lg:block"
        style={{
          background: 'rgba(5,5,15,0.8)',
          border:     '1px solid rgba(139,127,255,0.15)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" style={{ animation: 'blink 1.5s ease-in-out infinite' }} />
          <span className="text-[#1D9E75] tracking-[3px]">SYSTEM ONLINE</span>
        </div>
        <div className="space-y-2">
          {[
            { k: 'LOCATION', v: PROFILE.location.split(',')[1]?.trim() ?? 'India' },
            { k: 'STATUS',   v: 'EXPLORING UNIVERSE' },
            { k: 'MISSION',  v: 'BUILDING IMPACT' },
          ].map(({ k, v }) => (
            <div key={k} className="flex justify-between">
              <span className="text-[#333]">{k}</span>
              <span className="text-[#8B7FFF]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
