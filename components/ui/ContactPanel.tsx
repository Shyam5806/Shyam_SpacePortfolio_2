'use client'
// components/ui/ContactPanel.tsx

import { useEffect, useState } from 'react'
import { useScene } from '@/components/providers/SceneProvider'
import { PROFILE } from '@/data/profile'

export default function ContactPanel() {
  const { showContact, setShowContact } = useScene()
  const [active,    setActive]    = useState(false)
  const [launched,  setLaunched]  = useState(false)

  useEffect(() => {
    if (!showContact) { setActive(false); setLaunched(false); return }
    const t = setTimeout(() => setActive(true), 40)
    return () => clearTimeout(t)
  }, [showContact])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    if (showContact) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showContact]) // eslint-disable-line

  const handleClose   = () => { setActive(false); setTimeout(() => setShowContact(false), 500) }
  const handleLaunch  = () => {
    setLaunched(true)
    setTimeout(() => { window.open(PROFILE.resume, '_blank'); setLaunched(false) }, 1800)
  }

  if (!showContact) return null

  const links = [
    { href: PROFILE.github,   icon: '⬡',  label: 'GitHub',   sub: 'Check out my code',     col: '#88ff88' },
    { href: PROFILE.linkedin, icon: 'in', label: 'LinkedIn', sub: 'Connect professionally', col: '#88ccff' },
    { href: `mailto:${PROFILE.email}`, icon: '✉', label: 'Email', sub: 'Send me a message', col: '#ffaa88' },
  ]

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center font-mono"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', opacity: active ? 1 : 0, transition: 'opacity 0.4s ease' }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative max-w-[560px] w-[92%]"
        style={{ background: '#060610', border: '1px solid rgba(29,158,117,0.28)', boxShadow: '0 0 60px rgba(29,158,117,0.1)', animation: active ? 'popIn 0.3s ease' : 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4" style={{ background: 'rgba(29,158,117,0.06)', borderBottom: '1px solid rgba(29,158,117,0.15)' }}>
          <div>
            <p className="text-[9px] tracking-[5px] text-[#1D9E75]">SOL-07 · CONTACT STATION</p>
            <p className="text-[11px] text-[#777] mt-0.5">Let's Connect</p>
          </div>
          <button onClick={handleClose} className="text-[#333] hover:text-white text-xl font-sans transition-colors">✕</button>
        </div>

        <div className="p-7">
          <h2 className="text-[22px] font-bold text-white mb-1">LET'S CONNECT</h2>
          <p className="text-[10px] tracking-[3px] text-[#1D9E75] mb-2">Start a Conversation</p>
          <p className="text-[12px] text-[#444] mb-8 leading-[1.9]">
            I'm always open to exciting opportunities, collaborations, and conversations about technology.
            Reach out — let's build something extraordinary together.
          </p>

          {/* Contact links */}
          <div className="flex flex-col gap-3 mb-8">
            {links.map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 no-underline transition-all duration-300 group"
                style={{ border: `1px solid ${l.col}22`, background: `${l.col}05` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${l.col}55`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = `${l.col}22`}
              >
                <div className="w-9 h-9 flex items-center justify-center text-sm flex-shrink-0"
                  style={{ border: `1px solid ${l.col}44`, color: l.col, background: `${l.col}10` }}>
                  {l.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white">{l.label}</p>
                  <p className="text-[10px] text-[#444]">{l.sub}</p>
                </div>
                <span className="text-[#333] group-hover:text-white transition-colors text-sm">→</span>
              </a>
            ))}
          </div>

          {/* Resume launch */}
          <div className="text-center p-6" style={{ border: '1px solid rgba(29,158,117,0.2)', background: 'rgba(29,158,117,0.04)' }}>
            <p className="text-[8px] tracking-[4px] text-[#333] mb-4">// LAUNCH RESUME</p>

            {/* Rocket animation */}
            <div className="flex justify-center mb-5" style={{ height: 60 }}>
              <div className="text-4xl transition-all duration-[1800ms]"
                style={{
                  transform:  launched ? 'translateY(-120px) scale(0.3)' : 'translateY(0) scale(1)',
                  opacity:    launched ? 0 : 1,
                  filter:     launched ? 'blur(4px)' : 'none',
                }}>
                🚀
              </div>
            </div>

            <button onClick={handleLaunch} disabled={launched}
              className="w-full py-3.5 text-[10px] tracking-[4px] text-white transition-all duration-300 disabled:opacity-50"
              style={{ background: launched ? 'rgba(29,158,117,0.3)' : 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.45)' }}
              onMouseEnter={e => !launched && ((e.currentTarget as HTMLElement).style.background = 'rgba(29,158,117,0.25)')}
              onMouseLeave={e => !launched && ((e.currentTarget as HTMLElement).style.background = 'rgba(29,158,117,0.12)')}
            >
              {launched ? 'LAUNCHING...' : '🚀 DOWNLOAD RESUME'}
            </button>
          </div>

          {/* Closing quote */}
          <p className="text-center text-[10px] tracking-[3px] text-[#1a1a28] mt-8">
            "THE UNIVERSE IS MADE OF STORIES, SO IS MY CODE."
          </p>
        </div>
      </div>
    </div>
  )
}
