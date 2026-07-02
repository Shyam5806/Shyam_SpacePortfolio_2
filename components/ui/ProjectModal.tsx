'use client'
// components/ui/ProjectModal.tsx — v2 classified mission file

import { useScene } from '@/components/providers/SceneProvider'

export default function ProjectModal() {
  const { activeProject: p, setActiveProject } = useScene()
  if (!p) return null

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease' }}
      onClick={e => e.target === e.currentTarget && setActiveProject(null)}
    >
      <div
        className="relative max-w-[620px] w-[93%] max-h-[90vh] overflow-y-auto font-mono"
        style={{
          background:  '#060610',
          border:      `1px solid ${p.col}44`,
          boxShadow:   `0 0 60px ${p.col}12, 0 0 120px rgba(0,0,0,0.8)`,
          animation:   'popIn 0.3s ease',
        }}
      >
        {/* Classified header bar */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ background: `${p.col}12`, borderBottom: `1px solid ${p.col}25` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ background: p.col, boxShadow: `0 0 8px ${p.col}` }} />
            <span className="text-[8px] tracking-[5px]" style={{ color: p.col }}>MISSION FILE — {p.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[7px] tracking-[3px] text-[#2a2a3a]">CLASSIFIED</span>
            <button onClick={() => setActiveProject(null)} className="text-[#333] hover:text-white transition-colors text-lg font-sans leading-none">✕</button>
          </div>
        </div>

        <div className="p-7">
          {/* Project name */}
          <h2 className="text-[22px] font-bold text-white mb-1 leading-tight">{p.name}</h2>
          <p className="text-[9px] tracking-[3px] mb-6" style={{ color: p.col }}>{p.id} · ACTIVE MISSION</p>

          {/* Summary */}
          <p className="text-[12px] text-[#555] leading-[2.1] mb-6">{p.sum}</p>

          {/* Tech pills */}
          <div className="mb-5">
            <p className="text-[8px] tracking-[4px] text-[#333] mb-3">// TECH ARSENAL</p>
            <div className="flex flex-wrap gap-2">
              {p.tech.map(t => (
                <span key={t} className="text-[10px] tracking-[1px] px-3 py-1.5"
                  style={{ background: `${p.col}10`, color: p.col, border: `1px solid ${p.col}35` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          {p.features && (
            <div className="mb-5">
              <p className="text-[8px] tracking-[4px] text-[#333] mb-3">// MISSION FEATURES</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ color: p.col }} className="text-[10px] mt-0.5">▸</span>
                    <span className="text-[11px] text-[#555]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact */}
          <div className="mb-6 pl-4 py-3" style={{ borderLeft: `2px solid ${p.col}` }}>
            <p className="text-[8px] tracking-[4px] text-[#333] mb-2">// MISSION IMPACT</p>
            <p className="text-[12px] text-[#777] italic leading-[1.9]">⟡ {p.imp}</p>
          </div>

          {/* Challenge */}
          {p.challenge && (
            <div className="mb-6">
              <p className="text-[8px] tracking-[4px] text-[#333] mb-2">// KEY CHALLENGE</p>
              <p className="text-[11px] text-[#555] leading-[1.9]">{p.challenge}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a href={p.gh || '#'} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center py-3 text-[10px] tracking-[3px] no-underline transition-opacity hover:opacity-70"
              style={{ border: `1px solid ${p.col}50`, color: p.col }}>
              ⌥ GITHUB REPO
            </a>
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-3 text-[10px] tracking-[3px] no-underline transition-opacity hover:opacity-70"
                style={{ border: `1px solid ${p.col}50`, color: p.col }}>
                ↗ LIVE DEMO
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
