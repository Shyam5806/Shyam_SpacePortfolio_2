'use client'
// components/ui/InfoCard.tsx — v2 holographic card

import { useEffect } from 'react'
import { useScene } from '@/components/providers/SceneProvider'

export default function InfoCard() {
  const { activeTech, activeDomain, cardPos, setActiveTech, setActiveDomain } = useScene()
  const isVisible = !!activeTech || !!activeDomain

  useEffect(() => {
    if (!activeDomain) return
    const t = setTimeout(() => setActiveDomain(null), 4000)
    return () => clearTimeout(t)
  }, [activeDomain, setActiveDomain])

  if (!isVisible) return null

  const id    = activeTech ? (activeTech as any).id   : '// DOMAIN'
  const name  = activeTech ? (activeTech as any).name : (activeDomain as any).name
  const desc  = activeTech ? (activeTech as any).desc : (activeDomain as any).desc
  const color = activeTech ? (activeTech as any).col  : (activeDomain as any).col
  const lvl   = activeTech ? (activeTech as any).lvl  : null

  const x = Math.min(cardPos.x + 18, window.innerWidth  - 290)
  const y = Math.min(cardPos.y - 14,  window.innerHeight - 160)

  return (
    <div
      className="fixed z-[300] min-w-[210px] max-w-[270px] font-mono pointer-events-none"
      style={{
        left:       x,
        top:        y,
        background: 'rgba(5,5,15,0.96)',
        border:     `1px solid ${color}35`,
        boxShadow:  `0 0 20px ${color}12`,
        padding:    '16px 20px',
        opacity:    isVisible ? 1 : 0,
        transform:  isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.2s, transform 0.2s',
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: color }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r" style={{ borderColor: color }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l" style={{ borderColor: color }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r" style={{ borderColor: color }} />

      {/* ID */}
      <p className="text-[8px] tracking-[4px] mb-2" style={{ color }}>{id}</p>
      {/* Name */}
      <p className="text-[14px] font-bold text-white mb-2 leading-tight">{name}</p>
      {/* Desc */}
      <p className="text-[10px] text-[#444] leading-[1.8]">{desc}</p>

      {/* Skill bar */}
      {lvl != null && (
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-[7px] tracking-[2px] text-[#2a2a3a]">PROFICIENCY</span>
            <span className="text-[7px]" style={{ color }}>{lvl}%</span>
          </div>
          <div className="h-[1px] bg-[#0a0a18] overflow-hidden">
            <div className="h-full" style={{ width: `${lvl}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }} />
          </div>
        </div>
      )}

      {/* Domain accent */}
      {activeDomain && (
        <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.04)]">
          <p className="text-[8px] tracking-[2px]" style={{ color }}>{(activeDomain as any).id}</p>
        </div>
      )}
    </div>
  )
}
