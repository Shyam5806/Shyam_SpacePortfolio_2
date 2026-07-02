'use client'
// components/ui/HUD.tsx — v2 scene indicator only

import { useScene } from '@/components/providers/SceneProvider'
import { SCENE_CONFIGS } from '@/data/scene-configs'

export default function HUD() {
  const { currentScene, goBack } = useScene()
  const cfg = SCENE_CONFIGS[currentScene]

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Scene ID — top left below nav */}
      <div className="absolute top-[64px] left-6 flex items-center gap-3">
        <div className="w-[6px] h-[6px] rounded-full bg-[#8B7FFF]" style={{ animation: 'blink 1.3s ease-in-out infinite' }} />
        <div>
          <p className="font-mono text-[9px] tracking-[3px] text-[#8B7FFF]">{cfg?.label}</p>
          {cfg?.subtitle && (
            <p className="font-mono text-[8px] tracking-[2px] text-[#2a2a40] mt-0.5">{cfg.subtitle}</p>
          )}
        </div>
      </div>

      {/* Back button */}
      {currentScene !== 'asteroid_belt' && (
        <button
          onClick={goBack}
          className="absolute top-[64px] right-6 pointer-events-auto font-mono text-[9px] tracking-[3px] text-[#8B7FFF] px-5 py-2.5 transition-all duration-300"
          style={{
            border:     '1px solid rgba(139,127,255,0.28)',
            background: 'rgba(5,5,15,0.75)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,127,255,0.14)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(5,5,15,0.75)' }}
        >
          ← BACK
        </button>
      )}

      {/* Holographic asteroid label overlays are rendered via CSS in globals.css */}
    </div>
  )
}
