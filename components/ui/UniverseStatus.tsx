'use client'
// components/ui/UniverseStatus.tsx

import { TECH } from '@/data/tech-stack'
import { PROJECTS } from '@/data/projects'

const STATS = [
  { label: 'PLANETS',   value: TECH.length,     col: '#8B7FFF' },
  { label: 'STARS',     value: PROJECTS.length,  col: '#FFD54F' },
  { label: 'ASTEROIDS', value: 5421,             col: '#F44336' },
  { label: 'METEORS',   value: 10,               col: '#FF9800' },
]

export default function UniverseStatus() {
  return (
    <div
      className="fixed bottom-7 left-6 z-[100] w-[170px] font-mono"
      style={{
        background: 'rgba(5,5,15,0.88)',
        border:     '1px solid rgba(139,127,255,0.15)',
        padding:    '14px 16px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[8px] tracking-[3px] text-[#8B7FFF]">UNIVERSE STATUS</span>
        <div
          className="w-2 h-2 rounded-sm"
          style={{ background: 'rgba(139,127,255,0.3)', border: '1px solid rgba(139,127,255,0.5)' }}
        />
      </div>

      {/* Stats */}
      <div className="space-y-2">
        {STATS.map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.col }} />
              <span className="text-[9px] tracking-[1px] text-[#333]">{s.label}</span>
            </div>
            <span className="text-[9px] font-bold" style={{ color: s.col }}>
              {s.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.04)] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" style={{ animation: 'blink 1.5s ease-in-out infinite' }} />
        <span className="text-[8px] tracking-[2px] text-[#1D9E75]">SYSTEM ONLINE</span>
      </div>
    </div>
  )
}
