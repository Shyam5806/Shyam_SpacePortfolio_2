'use client'
// components/ui/DSAPanel.tsx

import { useEffect, useState } from 'react'
import { useScene } from '@/components/providers/SceneProvider'
import { PROFILE } from '@/data/profile'

export default function DSAPanel() {
  const { showDSA, setShowDSA } = useScene()
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!showDSA) { setActive(false); return }
    const t = setTimeout(() => setActive(true), 40)
    return () => clearTimeout(t)
  }, [showDSA])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    if (showDSA) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showDSA]) // eslint-disable-line

  const handleClose = () => { setActive(false); setTimeout(() => setShowDSA(false), 500) }
  if (!showDSA) return null

  const stats = [
    { label: 'PROBLEMS SOLVED', value: `${PROFILE.dsa.problems}+`, col: '#F44336', icon: '⚡' },
    { label: 'DAY STREAK',      value: `${PROFILE.dsa.streak}+`,   col: '#FF9800', icon: '🔥' },
    { label: 'LEETCODE RATING', value: PROFILE.dsa.rating,          col: '#E8A838', icon: '⭐' },
    { label: 'CONTESTS',        value: `${PROFILE.dsa.contests}`,   col: '#4FC3F7', icon: '🏆' },
    { label: 'BADGE',           value: PROFILE.dsa.badge,           col: '#9C27B0', icon: '🏅' },
  ]

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center font-mono"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', opacity: active ? 1 : 0, transition: 'opacity 0.4s ease' }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative max-w-[560px] w-[92%]"
        style={{ background: '#060610', border: '1px solid rgba(244,67,54,0.3)', boxShadow: '0 0 60px rgba(244,67,54,0.12)', animation: active ? 'popIn 0.3s ease' : 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4" style={{ background: 'rgba(244,67,54,0.08)', borderBottom: '1px solid rgba(244,67,54,0.2)' }}>
          <div>
            <p className="text-[9px] tracking-[5px] text-[#F44336]">SOL-04 · DSA GALAXY</p>
            <p className="text-[11px] text-[#777] mt-0.5">Data Structures & Algorithms</p>
          </div>
          <button onClick={handleClose} className="text-[#333] hover:text-white text-xl font-sans transition-colors">✕</button>
        </div>

        <div className="p-7">
          <h2 className="text-[22px] font-bold text-white mb-1">DSA JOURNEY</h2>
          <p className="text-[10px] tracking-[3px] text-[#F44336] mb-8">Problem Solving · Competitive Programming</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="p-4 text-center" style={{ border: `1px solid ${s.col}25`, background: `${s.col}06` }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-[22px] font-bold mb-1" style={{ color: s.col }}>{s.value}</div>
                <div className="text-[8px] tracking-[2px] text-[#333]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Planet rings visual */}
          <div className="mb-8 p-5" style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-[8px] tracking-[4px] text-[#333] mb-4">// RING SYSTEM</p>
            {[
              { label: 'Algorithms & DS',  pct: 85, col: '#F44336' },
              { label: 'Dynamic Programming', pct: 72, col: '#E8A838' },
              { label: 'Graph Theory',     pct: 68, col: '#FF9800' },
              { label: 'Segment Trees',    pct: 55, col: '#4FC3F7' },
            ].map(r => (
              <div key={r.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#555]">{r.label}</span>
                  <span className="text-[10px]" style={{ color: r.col }}>{r.pct}%</span>
                </div>
                <div className="h-[2px] bg-[#0a0a18] overflow-hidden">
                  <div className="h-full" style={{ width: `${r.pct}%`, background: `linear-gradient(90deg, ${r.col}66, ${r.col})` }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href={PROFILE.dsa.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-3.5 text-[10px] tracking-[4px] no-underline transition-opacity hover:opacity-75"
            style={{ border: '1px solid rgba(244,67,54,0.45)', color: '#F44336' }}>
            ⚡ VIEW LEETCODE PROFILE
          </a>
        </div>
      </div>
    </div>
  )
}
