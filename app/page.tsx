'use client'
// app/page.tsx — v2 main page

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import LoadingScreen    from '@/components/ui/LoadingScreen'
import TopNav           from '@/components/ui/TopNav'
import SidebarNav       from '@/components/ui/SidebarNav'
import HeroOverlay      from '@/components/ui/HeroOverlay'
import HUD              from '@/components/ui/HUD'
import UniverseStatus   from '@/components/ui/UniverseStatus'
import LiveSpaceData    from '@/components/ui/LiveSpaceData'
import MusicPlayer      from '@/components/ui/MusicPlayer'
import ProjectModal     from '@/components/ui/ProjectModal'
import TechPanel        from '@/components/ui/TechPanel'
import InfoCard         from '@/components/ui/InfoCard'
import AboutSection     from '@/components/ui/AboutSection'
import DSAPanel         from '@/components/ui/DSAPanel'
import ExperiencePanel  from '@/components/ui/ExperiencePanel'
import ContactPanel     from '@/components/ui/ContactPanel'

// Three.js must be client-side only
const SpaceUniverse = dynamic(
  () => import('@/components/canvas/SpaceUniverse'),
  { ssr: false },
)

// Mobile fallback for small phones
function MobileFallback() {
  return (
    <div className="mobile-fallback">
      <div className="text-4xl mb-6">🚀</div>
      <h1 className="text-lg font-bold text-white tracking-[3px] mb-3">
        SHYAM SUNDER PANDEY
      </h1>
      <p className="text-[10px] tracking-[3px] text-[#8B7FFF] mb-8">
        SPACE PORTFOLIO 
      </p>
      <p className="text-[11px] text-[#444] leading-[1.9] mb-8 max-w-[280px]">
        This portfolio is an immersive 3D space experience. Please open it on a
        desktop or laptop for the full universe.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-[260px]">
        {[
          { label: '⬡ GitHub',    href: 'https://github.com/Shyam5806', col: '#88ff88' },
          { label: 'in LinkedIn', href: 'https://linkedin.com/in/shyam-sunder-pandey-605542321', col: '#88ccff' },
          { label: '✉ Email',    href: 'mailto:shyamsunderpandey0508@gmail.com', col: '#ffaa88' },
        ].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 no-underline text-[10px] tracking-[3px]"
            style={{ border: `1px solid ${l.col}44`, color: l.col, background: `${l.col}0e` }}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isMobile) return <MobileFallback />

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05050f]">

      {/* ── Three.js Canvas ──────────────────── */}
      <SpaceUniverse />

      {/* ── Always-on overlays ───────────────── */}
      <LoadingScreen />      {/* z-[9999] */}
      <TopNav />             {/* z-[100]  */}
      <SidebarNav />         {/* z-[100]  */}
      <HUD />                {/* z-[100]  */}
      <HeroOverlay />        {/* z-[90]   */}
      <UniverseStatus />     {/* z-[100]  */}
      <LiveSpaceData />      {/* z-[100]  */}
      <MusicPlayer />        {/* z-[100]  */}

      {/* ── Modals / panels ─────────────────── */}
      <AboutSection />       {/* z-[600]  */}
      <DSAPanel />           {/* z-[500]  */}
      <ExperiencePanel />    {/* z-[500]  */}
      <ContactPanel />       {/* z-[500]  */}
      <ProjectModal />       {/* z-[500]  */}
      <TechPanel />          {/* z-[400]  */}
      <InfoCard />           {/* z-[300]  */}

    </main>
  )
}
