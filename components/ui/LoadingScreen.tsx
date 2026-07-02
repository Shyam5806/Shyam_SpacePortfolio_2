'use client'
// components/ui/LoadingScreen.tsx — v2 cinematic loader

import { useEffect, useRef, useState } from 'react'

export default function LoadingScreen() {
  const [pct,     setPct]     = useState(0)
  const [visible, setVisible] = useState(true)
  const [fading,  setFading]  = useState(false)
  const [phase,   setPhase]   = useState(0)
  const intRef = useRef<ReturnType<typeof setInterval>>()

  const phases = [
    'CALIBRATING STAR CHARTS...',
    'PLOTTING ORBITAL PATHS...',
    'INITIALIZING WARP DRIVE...',
    'MAPPING THE UNIVERSE...',
    'SYSTEMS ONLINE',
  ]

  useEffect(() => {
    intRef.current = setInterval(() => {
      setPct(p => {
        const next = p + 2
        if (next >= 100) {
          clearInterval(intRef.current)
          setTimeout(() => setFading(true), 400)
          setTimeout(() => setVisible(false), 1400)
          return 100
        }
        if (next % 20 === 0) setPhase(ph => Math.min(ph + 1, phases.length - 1))
        return next
      })
    }, 36)
    return () => clearInterval(intRef.current)
  }, []) // eslint-disable-line

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0a0a2e 0%, #05050f 70%)',
        opacity:    fading ? 0 : 1,
        transition: 'opacity 1s ease',
      }}
    >
      {/* Starfield decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width:  Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top:    `${Math.random() * 100}%`,
              left:   `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              animation: `blink ${1.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* SP Logo */}
      <div className="mb-10 relative">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-xl text-white border-2 border-[rgba(139,127,255,0.6)]"
          style={{ background: 'rgba(139,127,255,0.12)', boxShadow: '0 0 30px rgba(139,127,255,0.3)' }}
        >
          SP
        </div>
        <div
          className="absolute inset-[-8px] rounded-full border border-[rgba(139,127,255,0.2)]"
          style={{ animation: 'spin 8s linear infinite' }}
        />
      </div>

      <p className="font-mono text-[10px] tracking-[10px] text-[#8B7FFF] mb-3" style={{ animation: 'blink 1.5s ease-in-out infinite' }}>
        ✦ SPACE PORTFOLIO ✦
      </p>
      <h1 className="font-mono font-bold text-[clamp(18px,3vw,28px)] tracking-[5px] text-white mb-2">
        SHYAM SUNDER PANDEY
      </h1>
      <p className="font-mono text-[10px] tracking-[4px] text-[#444] mb-12">
        CRAFTING SOLUTIONS ACROSS THE UNIVERSE
      </p>

      {/* Phase text */}
      <p className="font-mono text-[9px] tracking-[4px] text-[#8B7FFF] mb-5 h-4">
        {phases[phase]}
      </p>

      {/* Progress bar */}
      <div className="w-[260px] h-[1px] bg-[#111] mb-3 overflow-hidden">
        <div
          className="h-full transition-[width] duration-[60ms] linear"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #8B7FFF, #4FC3F7, #1D9E75)' }}
        />
      </div>

      <p className="font-mono text-[10px] tracking-[4px] text-[#1e1e30]">{pct}%</p>

      {/* Bottom grid decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[1px] h-6 bg-gradient-to-t from-[rgba(139,127,255,0.4)] to-transparent"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}
