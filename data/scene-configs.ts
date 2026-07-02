// data/scene-configs.ts
import type { SceneID, SceneConfig } from '@/types'

export const SCENE_CONFIGS: Record<SceneID, SceneConfig> = {
  asteroid_belt:       { label:'SCENE_01 :: ASTEROID_BELT',       subtitle:'Welcome to my universe', cam:[0,5,26],       look:[0,0,0] },
  galaxy_tunnel:       { label:'SCENE_02 :: GALAXY_TUNNEL',       subtitle:'Entering the solar hub', cam:[0,5,-40],      look:[0,0,-100] },
  solar_hub:           { label:'SCENE_03 :: SOLAR_HUB',           subtitle:'Choose a system to explore', cam:[0,22,-68],  look:[0,0,-100] },
  project_stars:       { label:'SCENE_04A :: PROJECT_STARS',      subtitle:'My creations', cam:[-70,22,-68],             look:[-70,0,-100] },
  core_lang:           { label:'SCENE_04B :: CORE_LANGUAGES',     subtitle:'My programming foundations', cam:[70,22,-68], look:[70,0,-100] },
  dsa_galaxy:          { label:'SCENE_04C :: DSA_GALAXY',         subtitle:'Data structures & algorithms', cam:[0,-28,-68], look:[0,-45,-100] },
  domains:             { label:'SCENE_05 :: DOMAIN_NEBULAE',      subtitle:'Areas of expertise', cam:[0,60,-68],         look:[0,44,-100] },
  experience_station:  { label:'SCENE_06 :: EXPERIENCE_STATION',  subtitle:'My professional journey', cam:[-120,20,-68], look:[-120,0,-100] },
  contact_station:     { label:'SCENE_07 :: CONTACT_STATION',     subtitle:"Let's connect", cam:[120,20,-68],           look:[120,0,-100] },
}

export const NAV_SCENES: SceneID[] = [
  'asteroid_belt','solar_hub','project_stars','core_lang',
  'dsa_galaxy','domains','experience_station','contact_station',
]

export const SCENE_SHORT: Record<string, string> = {
  asteroid_belt:      'ASTEROID BELT',
  solar_hub:          'SOLAR HUB',
  project_stars:      'PROJECTS',
  core_lang:          'CORE LANG',
  dsa_galaxy:         'DSA GALAXY',
  domains:            'DOMAINS',
  experience_station: 'EXPERIENCE',
  contact_station:    'CONTACT',
}
