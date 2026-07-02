'use client'
// components/ui/TechPanel.tsx
import { useEffect } from 'react'
import { useScene } from '@/components/providers/SceneProvider'
import { TECH } from '@/data/tech-stack'

const CATS = Array.from(new Set(TECH.map(t => t.cat)))

export default function TechPanel() {
  const { showTechPanel, setShowTechPanel } = useScene()

  useEffect(() => {
    if (!showTechPanel) return
    const bars = document.querySelectorAll<HTMLElement>('[data-skill-lvl]')
    const timer = setTimeout(() => bars.forEach(el => { el.style.width = el.dataset.skillLvl + '%' }), 100)
    return () => clearTimeout(timer)
  }, [showTechPanel])

  return (
    <aside
      className="fixed top-0 right-0 h-full w-[340px] z-[400] overflow-y-auto font-mono px-6 pt-8 pb-20"
      style={{
        background:  'rgba(5,5,15,0.97)',
        borderLeft:  '1px solid rgba(79,195,247,0.18)',
        right:       showTechPanel ? 0 : -365,
        transition:  'right 0.4s cubic-bezier(0.4,0,0.2,1)',
        scrollbarWidth: 'thin', scrollbarColor: '#1a1a30 transparent',
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[11px] tracking-[5px] text-[#4FC3F7]">// TECH STACK</span>
          <p className="text-[8px] tracking-[3px] text-[#333] mt-1">SOL-01 · My Technologies</p>
        </div>
        <button onClick={() => setShowTechPanel(false)} className="text-[#333] hover:text-white text-lg transition-colors font-sans">✕</button>
      </div>
      {CATS.map(cat => (
        <div key={cat}>
          <p className="text-[7px] tracking-[4px] text-[#1e1e30] mt-6 mb-4 pb-2 border-b border-[#080820]">{cat.toUpperCase()}</p>
          {TECH.filter(t => t.cat === cat).map(t => (
            <div key={t.id} className="mb-5">
              <div className="flex justify-between mb-1.5">
                <span className="text-[9px] tracking-[2px]" style={{ color: t.col }}>{t.id}</span>
                <span className="text-[11px] text-[#bbb]">{t.name}</span>
              </div>
              <div className="h-[2px] bg-[#0a0a18] rounded-sm overflow-hidden">
                <div className="h-full rounded-sm transition-[width] duration-[1200ms] ease-out" data-skill-lvl={t.lvl}
                  style={{ width: 0, background: `linear-gradient(90deg,${t.col}88,${t.col})` }} />
              </div>
              <p className="text-[9px] text-[#333] mt-1.5 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}
