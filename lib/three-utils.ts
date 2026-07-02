// lib/three-utils.ts — v2 upgraded helpers

import * as THREE from 'three'
import { ATMO_VERT, ATMO_FRAG } from './shaders'
import type { Clickable } from '@/types'

// ── Text Sprite ────────────────────────────────
export function makeSprite(
  text: string,
  opts: { sz?: number; col?: string; bold?: boolean } = {}
): THREE.Sprite {
  const { sz = 22, col = '#fff', bold = false } = opts
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')!
  const font   = `${bold ? 'bold ' : ''}${sz}px 'Space Mono',monospace`
  ctx.font = font
  const tw   = ctx.measureText(text).width
  const pad  = sz * 0.55
  canvas.width  = Math.ceil(tw) + pad * 2
  canvas.height = Math.ceil(sz * 1.65)
  ctx.font = font
  ctx.fillStyle = col
  ctx.fillText(text, pad, sz * 1.2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  )
  const ar = canvas.width / canvas.height
  sp.scale.set(ar * (sz / 9), sz / 9, 1)
  return sp
}

// ── Glow Shell ─────────────────────────────────
export function makeGlow(hexColor: number, r: number, opacity = 0.12): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(r * 1.85, 16, 16),
    new THREE.MeshBasicMaterial({
      color: hexColor, transparent: true,
      opacity, depthWrite: false, side: THREE.BackSide,
    })
  )
}

// ── Atmosphere Fresnel Shell ───────────────────
export function makeAtmosphere(
  r: number,
  color: string,
  intensity = 0.8
): THREE.Mesh {
  const col = new THREE.Color(color)
  return new THREE.Mesh(
    new THREE.SphereGeometry(r * 1.15, 32, 32),
    new THREE.ShaderMaterial({
      vertexShader:   ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      uniforms: {
        uColor:     { value: col },
        uIntensity: { value: intensity },
      },
      transparent: true,
      depthWrite:  false,
      side:        THREE.FrontSide,
      blending:    THREE.AdditiveBlending,
    })
  )
}

// ── Orbit Ring ─────────────────────────────────
export function makeOrbitRing(r: number, opacity = 0.08): THREE.LineLoop {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 80; i++) {
    const a = (i / 80) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
  }
  return new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity })
  )
}

// ── Planet Ring (Saturn-style) ─────────────────
export function makePlanetRing(
  innerR: number,
  outerR: number,
  color: number,
  tiltX = 0.4
): THREE.Mesh {
  const geo = new THREE.RingGeometry(innerR, outerR, 64)
  const mat = new THREE.MeshBasicMaterial({
    color, side: THREE.DoubleSide,
    transparent: true, opacity: 0.5,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = tiltX
  return mesh
}

// ── Point Light Helper ─────────────────────────
export function makeStarLight(
  color: number,
  intensity: number,
  distance: number
): THREE.PointLight {
  return new THREE.PointLight(color, intensity, distance)
}

// ── Nav Star ───────────────────────────────────
export function addNavStar(
  group: THREE.Group,
  clickables: Clickable[],
  targetScene: string,
  position: [number, number, number],
  label: string,
  sublabel = ''
): void {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x8b7fff })
  )
  mesh.position.set(...position)
  mesh.add(makeGlow(0x8b7fff, 0.9, 0.15))
  group.add(mesh)

  const ls = makeSprite(label, { sz: 14, col: '#8B7FFF', bold: true })
  ls.position.set(position[0], position[1] + 1.8, position[2])
  group.add(ls)

  if (sublabel) {
    const sl = makeSprite(sublabel, { sz: 10, col: '#444' })
    sl.position.set(position[0], position[1] + 0.9, position[2])
    group.add(sl)
  }

  clickables.push({ mesh, type: 'nav', data: { ts: targetScene } })
}

// ── Screen position of a 3D object ────────────
export function toScreen(
  obj: THREE.Object3D,
  camera: THREE.Camera,
  w: number,
  h: number
): { x: number; y: number; visible: boolean } {
  const vec = new THREE.Vector3()
  obj.getWorldPosition(vec)
  vec.project(camera)
  const visible = vec.z < 1
  return {
    x: (vec.x  *  0.5 + 0.5) * w,
    y: (-vec.y *  0.5 + 0.5) * h,
    visible,
  }
}

// ── Meteor builder ─────────────────────────────
export function buildMeteor(): THREE.Group {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.008, 3.5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff6b00 })
  ))
  const trail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.005, 6.5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.28 })
  )
  trail.position.y = -2
  g.add(trail)
  g.rotation.z = Math.PI / 2
  return g
}
