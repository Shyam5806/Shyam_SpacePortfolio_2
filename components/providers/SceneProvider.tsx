'use client'
// components/providers/SceneProvider.tsx — v2

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { SceneContextType, SceneID, Project, Tech, CorePlanet, Domain, CardPos } from '@/types'

const SceneContext = createContext<SceneContextType | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [currentScene,    setCurrentScene]    = useState<SceneID>('asteroid_belt')
  const [prevScene,       setPrevScene]       = useState<SceneID | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Overlays
  const [showAbout,      setShowAbout]      = useState(false)
  const [showDSA,        setShowDSA]        = useState(false)
  const [showExperience, setShowExperience] = useState(false)
  const [showContact,    setShowContact]    = useState(false)

  // Modals / panels
  const [activeProject,  setActiveProject]  = useState<Project | null>(null)
  const [activeTech,     setActiveTech]     = useState<Tech | CorePlanet | null>(null)
  const [activeDomain,   setActiveDomain]   = useState<Domain | null>(null)
  const [showTechPanel,  setShowTechPanel]  = useState(false)
  const [cardPos,        setCardPos]        = useState<CardPos>({ x: 0, y: 0 })

  // Sound
  const [soundEnabled, setSoundEnabled] = useState(false)

  const navigateTo = useCallback((scene: SceneID) => {
    if (scene === currentScene || isTransitioning) return
    setPrevScene(currentScene)
    setCurrentScene(scene)
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 2900)
    setActiveTech(null); setActiveDomain(null); setShowTechPanel(false)
  }, [currentScene, isTransitioning])

  const goBack = useCallback(() => {
    const target = prevScene && prevScene !== currentScene ? prevScene : 'solar_hub'
    navigateTo(target)
  }, [prevScene, currentScene, navigateTo])

  return (
    <SceneContext.Provider value={{
      currentScene, prevScene, isTransitioning, navigateTo, goBack, setIsTransitioning,
      showAbout, setShowAbout,
      showDSA, setShowDSA,
      showExperience, setShowExperience,
      showContact, setShowContact,
      activeProject, setActiveProject,
      activeTech, setActiveTech,
      activeDomain, setActiveDomain,
      showTechPanel, setShowTechPanel,
      cardPos, setCardPos,
      soundEnabled, setSoundEnabled,
    }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene(): SceneContextType {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used inside <SceneProvider>')
  return ctx
}
