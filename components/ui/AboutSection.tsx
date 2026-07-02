'use client'
// components/ui/AboutSection.tsx — v2

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useScene } from '@/components/providers/SceneProvider'
import { PROFILE } from '@/data/profile'

function SectionHead({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="font-mono text-[10px] tracking-[5px] text-[#8B7FFF]">// {label}</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(139,127,255,0.4), transparent)' }} />
    </div>
  )
}

export default function AboutSection() {
  const { showAbout, setShowAbout } = useScene()
  const [active, setActive] = useState(false)
  const [tab, setTab]       = useState<'about'|'education'|'achievements'>('about')

  useEffect(() => {
    if (!showAbout) { setActive(false); return }
    const t = setTimeout(() => setActive(true), 40)
    return () => clearTimeout(t)
  }, [showAbout])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    if (showAbout) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showAbout]) // eslint-disable-line

  const handleClose = () => {
    setActive(false)
    setTimeout(() => setShowAbout(false), 580)
  }

  if (!showAbout) return null

  return (
    <div
      className="fixed inset-0 z-[600] overflow-y-auto font-mono"
      style={{
        background:      'radial-gradient(ellipse at 50% -10%, #0f0f2e 0%, #080810 50%, #05050f 100%)',
        opacity:         active ? 1 : 0,
        transform:       active ? 'scale(1)' : 'scale(0.05)',
        transformOrigin: '50% 45%',
        transition:      active
          ? 'opacity 0.55s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)'
          : 'opacity 0.4s ease,  transform 0.5s  cubic-bezier(0.4,0,1,1)',
        scrollbarWidth: 'thin', scrollbarColor: '#1a1a30 transparent',
      }}
    >
      {/* Nebula decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(139,127,255,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px]"
          style={{ background: 'radial-gradient(ellipse at right bottom, rgba(79,195,247,0.05) 0%, transparent 70%)' }} />
      </div>

      {/* Close */}
      <button onClick={handleClose}
        className="fixed top-5 left-5 z-10 flex items-center gap-3 text-[10px] tracking-[3px] text-[#8B7FFF] px-5 py-2.5 transition-all duration-300"
        style={{ background: 'rgba(5,5,15,0.85)', border: '1px solid rgba(139,127,255,0.3)' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(139,127,255,0.12)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(5,5,15,0.85)'}
      >
        ← BACK TO UNIVERSE
      </button>

      <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-24">

        {/* Hero — Photo + Name */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative mb-7" style={{ width: 164, height: 164 }}>
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0f]"
              style={{ padding: 3, background: 'linear-gradient(135deg,#8B7FFF,#4FC3F7,#8B7FFF)', boxShadow: '0 0 40px rgba(139,127,255,0.35)' }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0f]">
                <Image src="/shyam.jpg" alt={PROFILE.name} width={158} height={158} className="object-cover object-top w-full h-full" priority />
              </div>
            </div>
            <div className="absolute inset-[-12px] rounded-full border border-[rgba(139,127,255,0.2)]" style={{ animation: 'spin 12s linear infinite' }} />
            <div className="absolute inset-[-24px] rounded-full border border-[rgba(79,195,247,0.1)]"  style={{ animation: 'spin 20s linear infinite reverse' }} />
          </div>

          <h1 className="text-[clamp(20px,4vw,34px)] font-bold text-white tracking-[4px] mb-2">{PROFILE.name}</h1>
          <p className="text-[11px] tracking-[3px] text-[#8B7FFF] mb-1">{PROFILE.degree}</p>
          <p className="text-[10px] tracking-[2px] text-[#333] mb-4">{PROFILE.university}</p>

          {/* Role pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {PROFILE.roles.map(r => (
              <span key={r} className="text-[9px] tracking-[2px] px-3 py-1.5"
                style={{ border: '1px solid rgba(139,127,255,0.3)', color: '#8B7FFF', background: 'rgba(139,127,255,0.08)' }}>
                {r}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full max-w-[240px]">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(139,127,255,0.4))' }} />
            <span className="text-[#8B7FFF]">✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(139,127,255,0.4))' }} />
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-10 border-b border-[rgba(255,255,255,0.05)] pb-0">
          {(['about','education','achievements'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2.5 text-[9px] tracking-[3px] transition-all duration-300 border-b-[2px] -mb-[1px]"
              style={{
                color:       tab === t ? '#8B7FFF' : '#333',
                borderColor: tab === t ? '#8B7FFF' : 'transparent',
                background:  tab === t ? 'rgba(139,127,255,0.06)' : 'transparent',
              }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab: About */}
        {tab === 'about' && (
          <>
            <section className="mb-12">
              <SectionHead label="ABOUT ME" />
              <div className="text-[13px] text-[#555] leading-[2.2] p-6 whitespace-pre-line"
                style={{ border: '1px solid rgba(139,127,255,0.1)', background: 'rgba(139,127,255,0.02)' }}>
                {PROFILE.bio}
              </div>
            </section>

            <section className="mb-12">
              <SectionHead label="CONNECT" />
              <div className="flex flex-wrap gap-3">
                {[
                  { href: PROFILE.github,   icon: '⬡',  label: 'GitHub',   col: '#88ff88' },
                  { href: PROFILE.linkedin, icon: 'in', label: 'LinkedIn', col: '#88ccff' },
                  { href: PROFILE.leetcode, icon: '⚡', label: 'LeetCode', col: '#FFA116' },
                  { href: `mailto:${PROFILE.email}`, icon: '✉', label: 'Email', col: '#ffaa88' },
                  { href: PROFILE.resume !== '#' ? PROFILE.resume : undefined, icon: '📄', label: 'Resume', col: '#aaffaa' },
                ].filter(l => l.href).map(l => (
                  <a key={l.label} href={l.href} target={l.href?.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[2px] no-underline transition-opacity hover:opacity-70"
                    style={{ border: `1px solid ${l.col}55`, color: l.col, background: `${l.col}0e` }}>
                    <span>{l.icon}</span><span>{l.label}</span>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Tab: Education */}
        {tab === 'education' && (
          <section className="mb-12">
            <SectionHead label="ACADEMICS" />
            <div className="flex flex-col gap-3">
              {PROFILE.academics.map((ac, i) => (
                <div key={i} className="flex gap-5 p-5 transition-all duration-300 hover:border-[rgba(139,127,255,0.25)]"
                  style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                  <span className="text-2xl mt-0.5 flex-shrink-0">{ac.icon}</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-white mb-1">{ac.institution}</p>
                    <p className="text-[11px] text-[#444] mb-3">{ac.degree}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] tracking-[2px] px-3 py-1"
                        style={{ background: 'rgba(139,127,255,0.1)', color: '#8B7FFF', border: '1px solid rgba(139,127,255,0.25)' }}>
                        {ac.year}
                      </span>
                      {ac.grade && ac.grade !== '—' && (
                        <span className="text-[9px] tracking-[2px] px-3 py-1"
                          style={{ background: 'rgba(79,195,247,0.08)', color: '#4FC3F7', border: '1px solid rgba(79,195,247,0.2)' }}>
                          {ac.grade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab: Achievements */}
        {tab === 'achievements' && (
          <section className="mb-12">
            <SectionHead label="HACKATHON ACHIEVEMENTS" />
            <div className="flex flex-col gap-4">
              {PROFILE.hackathons.map((h, i) => {
                const cols = ['#8B7FFF', '#4FC3F7', '#1D9E75']
                const col  = cols[i % cols.length]
                return (
                  <div key={i} className="p-6 transition-all duration-300 hover:translate-x-1"
                    style={{ borderLeft: `3px solid ${col}`, background: `${col}06`, border: `1px solid ${col}22`, borderLeftWidth: 3, borderLeftColor: col }}>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-[15px] font-bold text-white">{h.name}</h3>
                      <span className="text-[10px] tracking-[2px] px-3 py-1"
                        style={{ background: `${col}18`, color: col, border: `1px solid ${col}44` }}>
                        {h.result}
                      </span>
                    </div>
                    <div className="flex gap-4 mb-3">
                      <span className="text-[10px] text-[#444]">{h.org}</span>
                      <span className="text-[10px] text-[#333]">·</span>
                      <span className="text-[10px] text-[#444]">{h.year}</span>
                    </div>
                    <p className="text-[12px] text-[#555] leading-[1.9]">{h.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-[rgba(255,255,255,0.04)]">
          <p className="text-[8px] tracking-[5px] text-[#1a1a28]">THE UNIVERSE IS MADE OF STORIES, SO IS MY CODE.</p>
          <button onClick={handleClose}
            className="text-[10px] tracking-[4px] text-[#8B7FFF] px-8 py-3 transition-all duration-300"
            style={{ border: '1px solid rgba(139,127,255,0.3)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(139,127,255,0.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
            ← BACK TO UNIVERSE
          </button>
        </div>

      </div>
    </div>
  )
}
