// types/index.ts — v2 expanded types

import * as THREE from 'three'

export type SceneID =
  | 'asteroid_belt'
  | 'galaxy_tunnel'
  | 'solar_hub'
  | 'project_stars'
  | 'core_lang'
  | 'dsa_galaxy'
  | 'domains'
  | 'experience_station'
  | 'contact_station'

export interface SceneConfig {
  label: string
  cam: [number, number, number]
  look: [number, number, number]
  subtitle?: string
}

export interface Hackathon {
  name: string; result: string; org: string; year: string; desc: string
}

export interface Academic {
  institution: string; degree: string; year: string; grade: string; icon: string
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location: string
  type: string
  color: string
  responsibilities: string[]
}

export interface DSAStats {
  problems: number
  streak: number
  rating: string
  contests: number
  badge: string
  link: string
}

export interface Profile {
  name: string; tagline: string; subtitle: string; degree: string
  university: string; email: string; github: string; linkedin: string
  leetcode: string; resume: string; bio: string; location: string
  roles: string[]
  achievements: string[]
  hackathons: Hackathon[]
  academics: Academic[]
  dsa: DSAStats
}

export interface Tech {
  id: string; name: string; cat: string; lvl: number; col: string; desc: string
}

export interface Project {
  id: string; name: string; col: string; hex: number
  sum: string; tech: string[]; imp: string; gh: string; demo: string
  features?: string[]; challenge?: string
}

export interface CorePlanet {
  id: string; name: string; col: string; hex: number; desc: string; link: string | null
}

export interface Domain {
  name: string; col: string; hex: number
  p: [number, number, number]; desc: string; id: string
}

export type ClickableType =
  | 'link' | 'tech_star' | 'planet' | 'project'
  | 'core_p' | 'domain' | 'nav' | 'about'
  | 'dsa' | 'experience' | 'contact' | 'asteroid_section'

export interface Clickable {
  mesh: THREE.Mesh | THREE.Object3D
  type: ClickableType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export interface CardPos { x: number; y: number }

export interface AsteroidLabel {
  id: string; label: string; sublabel: string; color: string
  mesh: THREE.Mesh; screenPos: { x: number; y: number; visible: boolean }
}

export interface SceneContextType {
  currentScene: SceneID
  prevScene: SceneID | null
  isTransitioning: boolean
  navigateTo: (scene: SceneID) => void
  goBack: () => void
  setIsTransitioning: (v: boolean) => void
  // Overlays
  showAbout: boolean; setShowAbout: (v: boolean) => void
  showDSA: boolean; setShowDSA: (v: boolean) => void
  showExperience: boolean; setShowExperience: (v: boolean) => void
  showContact: boolean; setShowContact: (v: boolean) => void
  // Modal / panel
  activeProject: Project | null; setActiveProject: (p: Project | null) => void
  activeTech: Tech | CorePlanet | null; setActiveTech: (t: Tech | CorePlanet | null) => void
  activeDomain: Domain | null; setActiveDomain: (d: Domain | null) => void
  showTechPanel: boolean; setShowTechPanel: (v: boolean) => void
  cardPos: CardPos; setCardPos: (pos: CardPos) => void
  // Sound
  soundEnabled: boolean; setSoundEnabled: (v: boolean) => void
}
