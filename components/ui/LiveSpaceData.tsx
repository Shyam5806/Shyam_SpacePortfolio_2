'use client'
// components/ui/LiveSpaceData.tsx

import { useEffect, useState } from 'react'

export default function LiveSpaceData() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
      setDate(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const rows = [
    { k: 'TIME',     v: time },
    { k: 'DATE',     v: date },
    { k: 'LOCATION', v: 'Earth 🌍' },
    { k: 'VELOCITY', v: '67,000 km/h' },
    { k: 'DISTANCE', v: '1.47B KM' },
  ]

  return (
    <div
      className="fixed bottom-7 right-6 z-[100] w-[200px] font-mono hidden lg:block"
      style={{
        background: 'rgba(5,5,15,0.88)',
        border:     '1px solid rgba(79,195,247,0.15)',
        padding:    '14px 16px',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[8px] tracking-[3px] text-[#4FC3F7]">LIVE SPACE DATA</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7]" style={{ animation: 'blink 1.2s ease-in-out infinite' }} />
      </div>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.k} className="flex justify-between items-center">
            <span className="text-[8px] tracking-[1px] text-[#333]">{r.k}</span>
            <span className="text-[9px] text-[#4FC3F7] font-bold tabular-nums">{r.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.04)]">
        <p className="text-[7px] tracking-[2px] text-[#1a1a30] text-center">
          TIP: Click any celestial body to explore
        </p>
      </div>
    </div>
  )
}
