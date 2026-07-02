'use client'
// components/ui/ExperiencePanel.tsx

import { useEffect, useState } from 'react'
import { useScene } from '@/components/providers/SceneProvider'
import { EXPERIENCE } from '@/data/experience'

export default function ExperiencePanel() {
  const { showExperience, setShowExperience } = useScene()
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!showExperience) { setActive(false); return }
    const t = setTimeout(() => setActive(true), 40)
    return () => clearTimeout(t)
  }, [showExperience])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    if (showExperience) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showExperience]) // eslint-disable-line

  const handleClose = () => { setActive(false); setTimeout(() => setShowExperience(false), 500) }
  if (!showExperience) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center font-mono"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', opacity: active ? 1 : 0, transition: 'opacity 0.4s ease' }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative max-w-[620px] w-[93%] max-h-[88vh] overflow-y-auto"
        style={{ background: '#060610', border: '1px solid rgba(79,195,247,0.25)', boxShadow: '0 0 60px rgba(79,195,247,0.1)', animation: active ? 'popIn 0.3s ease' : 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4" style={{ background: 'rgba(79,195,247,0.06)', borderBottom: '1px solid rgba(79,195,247,0.15)' }}>
          <div>
            <p className="text-[9px] tracking-[5px] text-[#4FC3F7]">SOL-06 · EXPERIENCE STATION</p>
            <p className="text-[11px] text-[#777] mt-0.5">My Professional Journey</p>
          </div>
          <button onClick={handleClose} className="text-[#333] hover:text-white text-xl font-sans transition-colors">✕</button>
        </div>

        <div className="p-7">
          <h2 className="text-[22px] font-bold text-white mb-1">WORK EXPERIENCE</h2>
          <p className="text-[10px] tracking-[3px] text-[#4FC3F7] mb-8">Professional Missions</p>

          {/* Space station illustration */}
          <div className="flex items-center gap-4 mb-8 p-5" style={{ border: '1px solid rgba(79,195,247,0.15)', background: 'rgba(79,195,247,0.03)' }}>
            <div className="text-4xl">🛸</div>
            <div>
              <p className="text-[12px] text-white mb-1">STATION STATUS: DOCKED</p>
              <p className="text-[10px] text-[#444]">{EXPERIENCE.length} mission{EXPERIENCE.length !== 1 ? 's' : ''} logged · Internship sector active</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75]" style={{ animation: 'blink 1.5s ease-in-out infinite' }} />
            </div>
          </div>

          {/* Experience timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-4 bottom-4 w-[1px]" style={{ background: 'linear-gradient(to bottom, rgba(79,195,247,0.4), transparent)' }} />

            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative flex gap-6 mb-8 last:mb-0">
                {/* Timeline dot */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm z-10 relative"
                    style={{ background: `${exp.color}18`, border: `1px solid ${exp.color}44`, color: exp.color }}>
                    ◎
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-6 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-[15px] font-bold text-white">{exp.role}</h3>
                      <p className="text-[12px] mt-0.5" style={{ color: exp.color }}>{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] tracking-[2px] px-3 py-1"
                        style={{ background: `${exp.color}12`, color: exp.color, border: `1px solid ${exp.color}35` }}>
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="text-[9px] text-[#444]">📅 {exp.period}</span>
                    <span className="text-[9px] text-[#444]">📍 {exp.location}</span>
                  </div>

                  <div className="space-y-2">
                    {exp.responsibilities.map((r, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <span className="text-[10px] mt-0.5 flex-shrink-0" style={{ color: exp.color }}>▸</span>
                        <p className="text-[12px] text-[#555] leading-[1.8]">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Future missions placeholder */}
            <div className="flex gap-6 opacity-30">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm border border-dashed border-[rgba(79,195,247,0.3)] text-[#4FC3F7]">?</div>
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-[#333]">Future Mission</p>
                <p className="text-[10px] text-[#222] mt-1">Accepting new opportunities · 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
