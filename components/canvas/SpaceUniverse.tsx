'use client'
// components/canvas/SpaceUniverse.tsx — v2.1 FIXED
// Fixes: colored asteroids (no black holes), spread nav stars, sound effects

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useScene } from '@/components/providers/SceneProvider'
import { useSpaceSound } from '@/lib/use-sound'
import { makeSprite, makeGlow, makeAtmosphere, makeOrbitRing, makePlanetRing, makeStarLight, addNavStar, buildMeteor } from '@/lib/three-utils'
import { NEBULA_VERT, NEBULA_FRAG, STAR_VERT, STAR_FRAG, DUST_VERT, DUST_FRAG, HOLO_VERT, HOLO_FRAG } from '@/lib/shaders'
import { PROFILE } from '@/data/profile'
import { TECH } from '@/data/tech-stack'
import { PROJECTS } from '@/data/projects'
import { CORE } from '@/data/core-lang'
import { DOMAINS } from '@/data/domains'
import { EXPERIENCE } from '@/data/experience'
import { SCENE_CONFIGS } from '@/data/scene-configs'
import type { Clickable, SceneID } from '@/types'

// ── Nebula background ──────────────────────────
function buildNebula(scene: THREE.Scene) {
  const mat = new THREE.ShaderMaterial({ vertexShader:NEBULA_VERT, fragmentShader:NEBULA_FRAG, uniforms:{uTime:{value:0}}, transparent:true, depthWrite:false, side:THREE.BackSide, blending:THREE.AdditiveBlending })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(800,32,32), mat)
  scene.add(mesh); return mesh
}

// ── Twinkling starfield (3 layers) ────────────
function buildStarfield(scene: THREE.Scene): THREE.Points[] {
  return [[3000,1.4,600],[1500,2.2,400],[500,3.5,300]].map(([count,size,spread]) => {
    const pos=new Float32Array(count*3), sizes=new Float32Array(count), phases=new Float32Array(count)
    for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*spread;pos[i*3+1]=(Math.random()-.5)*spread;pos[i*3+2]=(Math.random()-.5)*spread;sizes[i]=size*(0.5+Math.random());phases[i]=Math.random()*Math.PI*2}
    const geo=new THREE.BufferGeometry()
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3))
    geo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1))
    geo.setAttribute('aPhase',new THREE.BufferAttribute(phases,1))
    const mat=new THREE.ShaderMaterial({vertexShader:STAR_VERT,fragmentShader:STAR_FRAG,uniforms:{uTime:{value:0}},transparent:true,depthWrite:false})
    const pts=new THREE.Points(geo,mat); scene.add(pts); return pts
  })
}

// ── Floating dust ──────────────────────────────
function buildDust(scene: THREE.Scene): THREE.Points {
  const count=800,pos=new Float32Array(count*3),op=new Float32Array(count)
  for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*200;pos[i*3+1]=(Math.random()-.5)*80;pos[i*3+2]=(Math.random()-.5)*200;op[i]=Math.random()}
  const geo=new THREE.BufferGeometry()
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3))
  geo.setAttribute('aOpacity',new THREE.BufferAttribute(op,1))
  const mat=new THREE.ShaderMaterial({vertexShader:DUST_VERT,fragmentShader:DUST_FRAG,uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(0x8B7FFF)}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})
  const pts=new THREE.Points(geo,mat); scene.add(pts); return pts
}

// ── Scene 1: Asteroid Belt ─────────────────────
function buildBelt(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); groups.asteroid_belt=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x1a1a3a,1.0))
  const dl=new THREE.DirectionalLight(0xffeedd,1.2); dl.position.set(20,30,20); g.add(dl)
  // 80 background asteroids
  const aGeo=new THREE.IcosahedronGeometry(1,0),aMat=new THREE.MeshStandardMaterial({color:0x6b5b3e,roughness:1.0,metalness:0.02})
  const bgA: THREE.Mesh[]=[]
  for(let i=0;i<80;i++){
    let x=0,y=0,z=0; do{x=(Math.random()-.5)*80;y=(Math.random()-.5)*28;z=(Math.random()-.5)*60}while(x*x+y*y+z*z<64)
    const m=new THREE.Mesh(aGeo,aMat); m.position.set(x,y,z); m.rotation.set(Math.random()*6.28,Math.random()*6.28,Math.random()*3.14); m.scale.setScalar(0.2+Math.random()*1.2); m.userData.ry=(Math.random()-.5)*0.012; m.userData.rx=(Math.random()-.5)*0.006; g.add(m); bgA.push(m)
  }
  g.userData.bgA=bgA
  // Hero asteroid with holo shader
  const holoMat=new THREE.ShaderMaterial({vertexShader:HOLO_VERT,fragmentShader:HOLO_FRAG,uniforms:{uTime:{value:0},uColor:{value:new THREE.Color('#8B7FFF')}},transparent:true,depthWrite:false})
  const heroBase=new THREE.Mesh(new THREE.IcosahedronGeometry(3.2,2),new THREE.MeshStandardMaterial({color:0x3a2b1e,roughness:0.95,metalness:0.05}))
  heroBase.userData.ry=0.003; g.add(heroBase); g.userData.hero=heroBase
  const heroHolo=new THREE.Mesh(new THREE.IcosahedronGeometry(3.25,2),holoMat); g.add(heroHolo); g.userData.heroHolo=heroHolo
  g.add(makeStarLight(0x8B7FFF,2,30))
  const nameS=makeSprite(PROFILE.name,{sz:50,col:'#ffffff',bold:true}); nameS.position.set(0,5.5,0); g.add(nameS)
  const tagS=makeSprite(PROFILE.tagline,{sz:15,col:'#8888cc'}); tagS.position.set(0,3.9,0); g.add(tagS)
  const hintS=makeSprite('👆 CLICK — ABOUT ME',{sz:13,col:'#8B7FFF88'}); hintS.position.set(0,-4.2,0); g.add(hintS)
  PROFILE.achievements.slice(0,3).forEach((a,i)=>{const s=makeSprite(a,{sz:12,col:'#3a3a5a'});s.position.set(0,-5.6-i*1.3,0);g.add(s)})
  clickables.push({mesh:heroBase,type:'about',data:{}})

  // ── SECTION ASTEROIDS: COLORED ROCKY (not black holes) ──
  // KEY FIX: removed RingGeometry entirely + use visible emissive color
  const sectionAsts=[
    {pos:[-16, 6,-12] as [number,number,number],id:'AST-01',label:'ABOUT ME',    sublabel:'My Story',        col:'#8B7FFF',r:2.2,action:'about'},
    {pos:[-14,-6, -8] as [number,number,number],id:'AST-02',label:'EDUCATION',   sublabel:'Academic Journey', col:'#4FC3F7',r:1.9,action:'education'},
    {pos:[ 16, 6,-10] as [number,number,number],id:'AST-03',label:'EXPERIENCE',  sublabel:'Professional',     col:'#1D9E75',r:2.0,action:'experience'},
    {pos:[ 14,-6,-12] as [number,number,number],id:'AST-04',label:'ACHIEVEMENTS',sublabel:'My Victories',     col:'#E8A838',r:2.1,action:'achievements'},
  ]
  sectionAsts.forEach(ast=>{
    const c=new THREE.Color(ast.col)
    const base=new THREE.Mesh(
      new THREE.IcosahedronGeometry(ast.r,2),
      new THREE.MeshStandardMaterial({
        color:c.clone().multiplyScalar(0.38),   // visible tinted color — NOT pure black
        roughness:0.85, metalness:0.12,
        emissive:c, emissiveIntensity:0.22,     // inner glow
      })
    )
    base.position.set(...ast.pos); base.rotation.set(Math.random()*6.28,Math.random()*6.28,0)
    base.userData.ry=0.004+Math.random()*0.003; g.add(base)
    base.add(makeGlow(c.getHex(),ast.r,0.20))          // soft halo glow
    base.add(makeAtmosphere(ast.r,ast.col,0.85))        // Fresnel rim light
    base.add(makeStarLight(c.getHex(),2.0,22))          // colored point light
    // Labels above & below
    const idS=makeSprite(ast.id,{sz:11,col:ast.col}); idS.position.set(ast.pos[0],ast.pos[1]+ast.r+1.7,ast.pos[2]); g.add(idS)
    const lbl=makeSprite(ast.label,{sz:16,col:ast.col,bold:true}); lbl.position.set(ast.pos[0],ast.pos[1]+ast.r+0.8,ast.pos[2]); g.add(lbl)
    const sub=makeSprite(ast.sublabel,{sz:10,col:'#555'}); sub.position.set(ast.pos[0],ast.pos[1]-ast.r-0.6,ast.pos[2]); g.add(sub)
    clickables.push({mesh:base,type:ast.action as Clickable['type'],data:{label:ast.label}})
  })

  // Small info asteroids (links)
  const infos=[
    {pos:[-13,3,-15] as [number,number,number],label:'⬡ GitHub',  col:'#88ff88',r:0.9,link:PROFILE.github},
    {pos:[12,6,4]   as [number,number,number],label:'in LinkedIn',col:'#88ccff',r:0.9,link:PROFILE.linkedin},
    {pos:[-11,-5,6] as [number,number,number],label:'✉ Email',   col:'#ffaa88',r:0.8,link:`mailto:${PROFILE.email}`},
    {pos:[0,8,-12]  as [number,number,number],label:'LeetCode ↗',col:'#FFA116',r:0.8,link:PROFILE.leetcode},
    {pos:[-6,-8,-8] as [number,number,number],label:'📄 Resume', col:'#aaffaa',r:0.9,link:'#'},
  ]
  const infoMeshes: THREE.Mesh[]=[]
  infos.forEach(info=>{
    const c=new THREE.Color(info.col)
    const m=new THREE.Mesh(new THREE.IcosahedronGeometry(info.r,1),new THREE.MeshStandardMaterial({color:c.clone().multiplyScalar(0.25),emissive:c,emissiveIntensity:0.4,roughness:0.8}))
    m.position.set(...info.pos); m.userData.ry=(Math.random()-.5)*0.01; m.userData.link=info.link; g.add(m)
    const ls=makeSprite(info.label,{sz:14,col:info.col}); ls.position.set(info.pos[0],info.pos[1]+info.r+1,info.pos[2]); g.add(ls)
    infoMeshes.push(m); if(info.link)clickables.push({mesh:m,type:'link',data:{link:info.link}})
  })
  g.userData.infoMeshes=infoMeshes
  // Meteors
  const meteors: Array<{g:THREE.Group;sx:number;sy:number;sz:number;spd:number;off:number;per:number}>=[]
  for(let i=0;i<10;i++){
    const mg=buildMeteor(); mg.rotation.x=0.18+Math.random()*0.12; g.add(mg)
    meteors.push({g:mg,sx:-65+(Math.random()-.5)*8,sy:8+Math.random()*18,sz:-25+Math.random()*14,spd:18+Math.random()*14,off:i*1.1,per:4.5+Math.random()*2.5})
  }
  g.userData.meteors=meteors; g.visible=true
}

// ── Galaxy Tunnel ──────────────────────────────
function buildTunnel(scene: THREE.Scene, groups: Record<string,THREE.Group>) {
  const g=new THREE.Group(); groups.galaxy_tunnel=g; scene.add(g)
  const CNT=6000,p1=new Float32Array(CNT*3)
  for(let i=0;i<CNT;i++){const t=(i/CNT)*Math.PI*28,r=4.5+Math.random()*3,n=(Math.random()-.5)*1.5;p1[i*3]=Math.cos(t)*r+n;p1[i*3+1]=Math.sin(t)*r+n;p1[i*3+2]=-(i/CNT)*140+10}
  const bg1=new THREE.BufferGeometry(); bg1.setAttribute('position',new THREE.BufferAttribute(p1,3))
  const pts1=new THREE.Points(bg1,new THREE.PointsMaterial({color:0x8b7fff,size:.07,sizeAttenuation:true,transparent:true,opacity:.9}))
  const p2=new Float32Array(CNT*3)
  for(let i=0;i<CNT;i++){p2[i*3]=p1[i*3]*.5+(Math.random()-.5)*.7;p2[i*3+1]=p1[i*3+1]*.5+(Math.random()-.5)*.7;p2[i*3+2]=p1[i*3+2]}
  const bg2=new THREE.BufferGeometry(); bg2.setAttribute('position',new THREE.BufferAttribute(p2,3))
  const pts2=new THREE.Points(bg2,new THREE.PointsMaterial({color:0x4fc3f7,size:.05,sizeAttenuation:true,transparent:true,opacity:.5}))
  g.add(pts1); g.add(pts2); g.userData.pts=[pts1,pts2]; g.visible=false
}

// ── Solar Hub — FIXED nav star positions ───────
function buildHub(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); g.position.set(0,0,-100); groups.solar_hub=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x0a1a3a,0.8))
  const star=new THREE.Mesh(new THREE.SphereGeometry(2.5,32,32),new THREE.MeshBasicMaterial({color:0xffd54f}))
  star.add(makeGlow(0xffd54f,2.5,0.25)); const outerG=makeGlow(0xff9800,2.5,0.08); outerG.scale.setScalar(1.5); star.add(outerG)
  g.add(makeStarLight(0xFFD54F,6,200)); g.add(star); g.userData.star=star
  const sl1=makeSprite('TECH STACK',{sz:15,col:'#FFD54F',bold:true}); sl1.position.set(0,4.0,0); g.add(sl1)
  const sl2=makeSprite('SOL-01 · Click to explore',{sz:10,col:'#555'}); sl2.position.set(0,3.0,0); g.add(sl2)
  clickables.push({mesh:star,type:'tech_star',data:{}})
  const planets: THREE.Mesh[]=[]
  TECH.forEach((tech,i)=>{
    const orb=7+i*3.0,c=new THREE.Color(tech.col); g.add(makeOrbitRing(orb,0.06))
    const planet=new THREE.Mesh(new THREE.SphereGeometry(0.58,24,24),new THREE.MeshStandardMaterial({color:c.clone().multiplyScalar(0.6),emissive:c,emissiveIntensity:0.5,roughness:0.3,metalness:0.1}))
    planet.userData={tech,orb,spd:0.28-i*0.018,ang:Math.random()*Math.PI*2}
    planet.add(makeAtmosphere(0.58,tech.col,0.9))
    const idS=makeSprite(tech.id,{sz:12,col:tech.col,bold:true}); idS.position.set(0,1.05,0); planet.add(idS)
    g.add(planet); planets.push(planet); clickables.push({mesh:planet,type:'planet',data:tech})
  })
  g.userData.planets=planets

  // ── NAV STARS — HEXAGONAL LAYOUT (no overlap, all visible) ──
  //
  //        DOMAINS [0,20]
  //       /               \
  // PROJ[-22,12]      CORE[22,12]
  //  |                         |
  // EXP[-30,0]          CONTACT[30,0]
  //       \               /
  //      DSA_L[-14,-14]  DSA_R[14,-14]
  //
  const navItems=[
    {label:'DOMAINS',       sub:'SOL-05 ↑', pos:[  0, 18, 14] as [number,number,number], sc:'domains',           hex:0x9c27b0,col:'#9C27B0'},
    {label:'PROJECT STARS', sub:'SOL-02',   pos:[-22, 14, 14] as [number,number,number], sc:'project_stars',     hex:0xe8a838,col:'#E8A838'},
    {label:'EXPERIENCE',    sub:'SOL-06 ←', pos:[-32,  3, 14] as [number,number,number], sc:'experience_station',hex:0x4FC3F7,col:'#4FC3F7'},
    {label:'DSA GALAXY',    sub:'SOL-04 ↓', pos:[-14,-15, 14] as [number,number,number], sc:'dsa_galaxy',        hex:0xF44336,col:'#F44336'},
    {label:'CONTACT',       sub:'SOL-07 →', pos:[ 14,-15, 14] as [number,number,number], sc:'contact_station',   hex:0x1D9E75,col:'#1D9E75'},
    {label:'CORE LANG',     sub:'SOL-03 →', pos:[ 26,  8, 14] as [number,number,number], sc:'core_lang',         hex:0xed8b00,col:'#ED8B00'},
  ]
  navItems.forEach(nav=>{
    const m=new THREE.Mesh(new THREE.SphereGeometry(1.15,20,20),new THREE.MeshBasicMaterial({color:nav.hex}))
    m.position.set(...nav.pos); m.add(makeGlow(nav.hex,1.15,0.22)); m.add(makeAtmosphere(1.15,nav.col,0.7)); g.add(m)
    const nl=makeSprite(nav.label,{sz:14,col:nav.col,bold:true}); nl.position.set(nav.pos[0],nav.pos[1]+2.3,nav.pos[2]); g.add(nl)
    const sl=makeSprite(nav.sub,{sz:10,col:'#444'}); sl.position.set(nav.pos[0],nav.pos[1]+1.1,nav.pos[2]); g.add(sl)
    // Connector line to center
    const pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(...nav.pos)]
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:nav.hex,transparent:true,opacity:0.08})))
    clickables.push({mesh:m,type:'nav',data:{ts:nav.sc}})
  })
  g.visible=false
}

// ── Project Stars ──────────────────────────────
function buildProjects(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); g.position.set(-70,0,-100); groups.project_stars=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x111133,.6))
  const cs=new THREE.Mesh(new THREE.SphereGeometry(1.8,24,24),new THREE.MeshBasicMaterial({color:0xffffff}))
  cs.add(makeGlow(0xffffff,1.8,.18)); g.add(cs); g.userData.cs=cs
  const tl=makeSprite('// PROJECT STARS',{sz:18,col:'#ffffff',bold:true}); tl.position.set(0,3.5,0); g.add(tl)
  const pMs: THREE.Mesh[]=[]
  PROJECTS.forEach((p,i)=>{
    const orb=5.5+i*3.8; g.add(makeOrbitRing(orb))
    const pm=new THREE.Mesh(new THREE.SphereGeometry(.9,22,22),new THREE.MeshBasicMaterial({color:p.hex}))
    pm.userData={proj:p,orb,spd:.18-i*.02,ang:Math.random()*Math.PI*2}
    pm.add(makeGlow(p.hex,.9,.22)); pm.add(makeAtmosphere(.9,p.col,.7))
    const ids=makeSprite(p.id,{sz:12,col:p.col,bold:true}); ids.position.set(0,1.4,0); pm.add(ids)
    const ns=makeSprite(p.name.split(' ').slice(0,2).join(' '),{sz:10,col:'#555'}); ns.position.set(0,-1.5,0); pm.add(ns)
    g.add(pm); pMs.push(pm); clickables.push({mesh:pm,type:'project',data:p})
  })
  g.userData.pMs=pMs; addNavStar(g,clickables,'solar_hub',[0,-10,0],'← SOLAR HUB','SOL-01'); g.visible=false
}

// ── Core Lang ──────────────────────────────────
function buildCoreLang(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); g.position.set(70,0,-100); groups.core_lang=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x221100,.7)); g.add(makeStarLight(0xED8B00,4,120))
  const js=new THREE.Mesh(new THREE.SphereGeometry(2.2,32,32),new THREE.MeshBasicMaterial({color:0xed8b00}))
  js.add(makeGlow(0xed8b00,2.2,.25)); js.add(makeAtmosphere(2.2,'#ED8B00',.7)); g.add(js); g.userData.jStar=js
  const jl1=makeSprite('JAVA',{sz:28,col:'#ED8B00',bold:true}); jl1.position.set(0,3.6,0); g.add(jl1)
  const cMs: THREE.Mesh[]=[]
  CORE.forEach((p,i)=>{
    const orb=5.5+i*3.2,c=new THREE.Color(p.col); g.add(makeOrbitRing(orb))
    const pm=new THREE.Mesh(new THREE.SphereGeometry(.6,20,20),new THREE.MeshStandardMaterial({color:c.clone().multiplyScalar(.4),emissive:c,emissiveIntensity:.55,roughness:.35}))
    pm.userData={cp:p,orb,spd:.22-i*.03,ang:Math.random()*Math.PI*2}
    pm.add(makeGlow(p.hex,.6,.2)); pm.add(makeAtmosphere(.6,p.col,.8))
    const ids=makeSprite(p.id,{sz:11,col:p.col,bold:true}); ids.position.set(0,1.0,0); pm.add(ids)
    g.add(pm); cMs.push(pm); clickables.push({mesh:pm,type:'core_p',data:p})
  })
  g.userData.cMs=cMs; addNavStar(g,clickables,'solar_hub',[0,-10,0],'← SOLAR HUB','SOL-01'); g.visible=false
}

// ── DSA Galaxy (Saturn) ────────────────────────
function buildDSA(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); g.position.set(0,-45,-100); groups.dsa_galaxy=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x0a1a0a,.7)); g.add(makeStarLight(0xF44336,3,120))
  const planet=new THREE.Mesh(new THREE.SphereGeometry(4.5,36,36),new THREE.MeshStandardMaterial({color:0x8B4513,roughness:.6,metalness:.2,emissive:new THREE.Color(0x3a1a08),emissiveIntensity:.3}))
  planet.add(makeAtmosphere(4.5,'#FF6B35',.8)); g.add(planet); g.userData.dsaPlanet=planet
  const r1=makePlanetRing(5.5,8.5,0xF44336,.45),r2=makePlanetRing(9,11,0xE8A838,.45),r3=makePlanetRing(11.5,13,0xFF6B35,.45)
  g.add(r1);g.add(r2);g.add(r3);g.userData.rings=[r1,r2,r3]
  const stats=[{text:`${PROFILE.dsa.problems}+ Problems`,col:'#F44336',pos:[11,4,0]as[number,number,number]},{text:`${PROFILE.dsa.streak}+ Day Streak`,col:'#FF9800',pos:[-11,2,0]as[number,number,number]},{text:PROFILE.dsa.rating+' LeetCode',col:'#E8A838',pos:[0,8,0]as[number,number,number]},{text:`${PROFILE.dsa.contests} Contests`,col:'#4FC3F7',pos:[9,-4,0]as[number,number,number]},{text:PROFILE.dsa.badge,col:'#9C27B0',pos:[-9,-3,0]as[number,number,number]}]
  stats.forEach(s=>{const sp=makeSprite(s.text,{sz:17,col:s.col,bold:true});sp.position.set(...s.pos);g.add(sp)})
  const title=makeSprite('DSA GALAXY',{sz:22,col:'#F44336',bold:true}); title.position.set(0,13,0); g.add(title)
  clickables.push({mesh:planet,type:'dsa',data:{}})
  addNavStar(g,clickables,'solar_hub',[0,18,0],'← SOLAR HUB','SOL-01'); g.visible=false
}

// ── Domain Nebulae ─────────────────────────────
function buildDomains(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); groups.domains=g; scene.add(g); g.add(new THREE.AmbientLight(0x110011,.5))
  DOMAINS.forEach(d=>{
    const dg=new THREE.Group(); dg.position.set(...d.p)
    const CNT=500,pos=new Float32Array(CNT*3)
    for(let i=0;i<CNT;i++){const r=Math.random()*6,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(ph)*Math.cos(th);pos[i*3+1]=r*Math.sin(ph)*Math.sin(th)*.5;pos[i*3+2]=r*Math.cos(ph)}
    const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3))
    dg.add(new THREE.Points(pg,new THREE.PointsMaterial({color:d.hex,size:.2,transparent:true,opacity:.7,sizeAttenuation:true})))
    const core=new THREE.Mesh(new THREE.SphereGeometry(2.5,14,14),new THREE.MeshBasicMaterial({color:d.hex,transparent:true,opacity:.08,depthWrite:false}))
    dg.add(core); clickables.push({mesh:core,type:'domain',data:d})
    const nl=makeSprite(d.name,{sz:20,col:d.col,bold:true}); nl.position.set(0,3.8,0); dg.add(nl)
    const dl=makeSprite(d.desc,{sz:10,col:'#444'}); dl.position.set(0,-3.5,0); dg.add(dl)
    g.add(dg)
  })
  const bm=new THREE.Mesh(new THREE.SphereGeometry(1,14,14),new THREE.MeshBasicMaterial({color:0x8b7fff}))
  bm.position.set(0,34,-108); bm.add(makeGlow(0x8b7fff,1.0)); g.add(bm)
  const bl=makeSprite('← SOLAR HUB',{sz:14,col:'#8B7FFF'}); bl.position.set(0,36.2,-108); g.add(bl)
  clickables.push({mesh:bm,type:'nav',data:{ts:'solar_hub'}}); g.visible=false
}

// ── Experience Station ─────────────────────────
function buildExperience(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); g.position.set(-120,0,-100); groups.experience_station=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x112244,.7)); g.add(makeStarLight(0x4FC3F7,3,100))
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(2,2,4,16),new THREE.MeshStandardMaterial({color:0x1a2a4a,roughness:.4,metalness:.8})); g.add(hub); g.userData.hub=hub
  const ring=new THREE.Mesh(new THREE.TorusGeometry(5,.6,12,48),new THREE.MeshStandardMaterial({color:0x2a3a6a,roughness:.5,metalness:.7})); g.add(ring); g.userData.stationRing=ring
  const pm=new THREE.MeshStandardMaterial({color:0x001a3a,roughness:.3,metalness:.9,emissive:new THREE.Color(0x4FC3F7),emissiveIntensity:.15})
  ;[[8,0,0],[-8,0,0],[0,0,8],[0,0,-8]].forEach(([x,y,z])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(6,.1,2),pm);p.position.set(x,y,z);g.add(p)})
  hub.add(makeAtmosphere(2.5,'#4FC3F7',.6)); ring.add(makeGlow(0x4FC3F7,5.5,.1))
  const tl=makeSprite('EXPERIENCE STATION',{sz:18,col:'#4FC3F7',bold:true}); tl.position.set(0,8,0); g.add(tl)
  EXPERIENCE.forEach((exp,i)=>{
    const angle=(i/EXPERIENCE.length)*Math.PI*2
    const pod=new THREE.Mesh(new THREE.SphereGeometry(.8,12,12),new THREE.MeshStandardMaterial({color:new THREE.Color(exp.color),emissive:new THREE.Color(exp.color),emissiveIntensity:.4}))
    pod.position.set(Math.cos(angle)*9,0,Math.sin(angle)*9)
    const rl=makeSprite(exp.role,{sz:11,col:exp.color}); rl.position.set(0,1.2,0); pod.add(rl)
    g.add(pod); clickables.push({mesh:pod,type:'experience',data:exp})
  })
  clickables.push({mesh:hub,type:'experience',data:{}})
  addNavStar(g,clickables,'solar_hub',[0,-12,0],'← SOLAR HUB','SOL-01'); g.visible=false
}

// ── Contact Station ────────────────────────────
function buildContact(scene: THREE.Scene, groups: Record<string,THREE.Group>, clickables: Clickable[]) {
  const g=new THREE.Group(); g.position.set(120,0,-100); groups.contact_station=g; scene.add(g)
  g.add(new THREE.AmbientLight(0x0a1a0a,.7)); g.add(makeStarLight(0x1D9E75,4,120))
  const padBase=new THREE.Mesh(new THREE.CylinderGeometry(5,6,1,32),new THREE.MeshStandardMaterial({color:0x1a2a1a,roughness:.6,metalness:.5})); padBase.position.y=-4; g.add(padBase)
  const body=new THREE.Mesh(new THREE.ConeGeometry(1.2,5,8),new THREE.MeshStandardMaterial({color:0xc0c0c0,roughness:.3,metalness:.9,emissive:new THREE.Color(0x1D9E75),emissiveIntensity:.15})); body.position.y=2; g.add(body); g.userData.rocket=body
  const bm=new THREE.MeshStandardMaterial({color:0x888888,roughness:.5,metalness:.8})
  ;[[1.5,-1,0],[-1.5,-1,0],[0,-1,1.5],[0,-1,-1.5]].forEach(([x,y,z])=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.5,2.5,8),bm);b.position.set(x,y,z);g.add(b)})
  const thruster=makeGlow(0x1D9E75,1.5,.3); thruster.position.y=-2.5; body.add(thruster)
  const tl=makeSprite('CONTACT STATION',{sz:18,col:'#1D9E75',bold:true}); tl.position.set(0,9,0); g.add(tl)
  const links=[{label:'⬡ GitHub',col:'#88ff88',pos:[-8,2,0]as[number,number,number],link:PROFILE.github},{label:'in LinkedIn',col:'#88ccff',pos:[8,2,0]as[number,number,number],link:PROFILE.linkedin},{label:'✉ Email',col:'#ffaa88',pos:[-8,-2,0]as[number,number,number],link:`mailto:${PROFILE.email}`},{label:'📄 Resume',col:'#aaffaa',pos:[8,-2,0]as[number,number,number],link:PROFILE.resume}]
  links.forEach(lnk=>{const c=new THREE.Color(lnk.col);const m=new THREE.Mesh(new THREE.SphereGeometry(.8,14,14),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.5}));m.position.set(...lnk.pos);m.add(makeGlow(c.getHex(),.8));g.add(m);const ls=makeSprite(lnk.label,{sz:13,col:lnk.col});ls.position.set(0,1.3,0);m.add(ls);clickables.push({mesh:m,type:'link',data:{link:lnk.link}})})
  clickables.push({mesh:body,type:'contact',data:{}})
  addNavStar(g,clickables,'solar_hub',[0,-12,0],'← SOLAR HUB','SOL-01'); g.visible=false
}

// ── Animation loop ─────────────────────────────
function animateAll(t: number,dt: number,groups: Record<string,THREE.Group>,nebMesh: THREE.Mesh|null,starMeshes: THREE.Points[],dustMesh: THREE.Points|null) {
  if(nebMesh)(nebMesh.material as THREE.ShaderMaterial).uniforms.uTime.value=t
  starMeshes.forEach(p=>{(p.material as THREE.ShaderMaterial).uniforms.uTime.value=t})
  if(dustMesh){(dustMesh.material as THREE.ShaderMaterial).uniforms.uTime.value=t;dustMesh.rotation.y=t*.008}
  const tn=groups.galaxy_tunnel;if(tn?.visible){const pts=tn.userData.pts as THREE.Points[];if(pts){pts[0].rotation.z=t*.28;pts[1].rotation.z=-t*.18}}
  const ab=groups.asteroid_belt
  if(ab?.visible){
    ;(ab.userData.bgA as THREE.Mesh[])?.forEach(m=>{m.rotation.y+=(m.userData as Record<string,number>).ry;m.rotation.x+=(m.userData as Record<string,number>).rx})
    const hero=ab.userData.hero as THREE.Mesh;if(hero)hero.rotation.y+=.003
    const hh=ab.userData.heroHolo as THREE.Mesh;if(hh){hh.rotation.y+=.003;(hh.material as THREE.ShaderMaterial).uniforms.uTime.value=t}
    ;(ab.userData.infoMeshes as THREE.Mesh[])?.forEach(m=>{m.rotation.y+=(m.userData as Record<string,number>).ry||.005})
    ;(ab.userData.meteors as Array<{g:THREE.Group;sx:number;sy:number;sz:number;spd:number;off:number;per:number}>)?.forEach(m=>{const p=((t+m.off)%m.per)/m.per;m.g.position.x=m.sx+p*m.spd*m.per;m.g.position.y=m.sy-p*m.spd*m.per*.28;m.g.position.z=m.sz})
  }
  const sh=groups.solar_hub;if(sh?.visible){const star=sh.userData.star as THREE.Mesh;if(star){const sc=1+Math.sin(t*1.8)*.04;star.scale.setScalar(sc);star.rotation.y+=.008};(sh.userData.planets as THREE.Mesh[])?.forEach(p=>{const d=p.userData as {ang:number;spd:number;orb:number};d.ang+=d.spd*dt;p.position.x=Math.cos(d.ang)*d.orb;p.position.z=Math.sin(d.ang)*d.orb;p.rotation.y+=.012})}
  const ps=groups.project_stars;if(ps?.visible){const cs=ps.userData.cs as THREE.Mesh;if(cs){cs.rotation.y+=.006;cs.scale.setScalar(1+Math.sin(t*2)*.04)};(ps.userData.pMs as THREE.Mesh[])?.forEach(p=>{const d=p.userData as {ang:number;spd:number;orb:number};d.ang+=d.spd*dt;p.position.x=Math.cos(d.ang)*d.orb;p.position.z=Math.sin(d.ang)*d.orb})}
  const cl=groups.core_lang;if(cl?.visible){const js=cl.userData.jStar as THREE.Mesh;if(js){js.scale.setScalar(1+Math.sin(t*2)*.04);js.rotation.y+=.005};(cl.userData.cMs as THREE.Mesh[])?.forEach(p=>{const d=p.userData as {ang:number;spd:number;orb:number};d.ang+=d.spd*dt;p.position.x=Math.cos(d.ang)*d.orb;p.position.z=Math.sin(d.ang)*d.orb;p.rotation.y+=.01})}
  const dsa=groups.dsa_galaxy;if(dsa?.visible){const dp=dsa.userData.dsaPlanet as THREE.Mesh;if(dp){dp.rotation.y+=.006;dp.rotation.x=Math.sin(t*.3)*.05};(dsa.userData.rings as THREE.Mesh[])?.forEach((r,i)=>{r.rotation.z=t*.02*(i%2===0?1:-1)})}
  const es=groups.experience_station;if(es?.visible){const hub=es.userData.hub as THREE.Mesh;const ring=es.userData.stationRing as THREE.Mesh;if(hub)hub.rotation.y+=.01;if(ring)ring.rotation.y+=.005}
  const cs2=groups.contact_station;if(cs2?.visible){const rocket=cs2.userData.rocket as THREE.Mesh;if(rocket){rocket.position.y=2+Math.sin(t*1.2)*.3;rocket.rotation.y+=.01}}
  const dm=groups.domains;if(dm?.visible){dm.children.forEach((c,i)=>{if(c instanceof THREE.Group)c.rotation.y=t*.04*(i%2===0?1:-1)})}
}

// ═══════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════
export default function SpaceUniverse() {
  const {currentScene,navigateTo,setIsTransitioning,setActiveProject,setActiveTech,setActiveDomain,setShowTechPanel,setShowAbout,setShowDSA,setShowExperience,setShowContact,setCardPos,soundEnabled}=useScene()
  const {playHover,playClick,playWarp}=useSpaceSound(soundEnabled)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const groupsRef=useRef<Record<string,THREE.Group>>({})
  const clickablesRef=useRef<Clickable[]>([])
  const rafRef=useRef<number>(0)
  const rcRef=useRef(new THREE.Raycaster())
  const mvRef=useRef(new THREE.Vector2())
  const isReadyRef=useRef(false)
  const prevSceneRef=useRef<SceneID|null>(null)
  const nebMeshRef=useRef<THREE.Mesh|null>(null)
  const starMeshesRef=useRef<THREE.Points[]>([])
  const dustMeshRef=useRef<THREE.Points|null>(null)
  const lookAtRef=useRef({x:0,y:0,z:0})
  const cameraRef=useRef<THREE.PerspectiveCamera|null>(null)
  const sceneObjRef=useRef<THREE.Scene|null>(null)
  const clockRef=useRef<THREE.Clock|null>(null)
  const prevHoverRef=useRef(false)
  // Stable callback refs
  const navRef=useRef(navigateTo);navRef.current=navigateTo
  const setProjRef=useRef(setActiveProject);setProjRef.current=setActiveProject
  const setTechRef=useRef(setActiveTech);setTechRef.current=setActiveTech
  const setDomRef=useRef(setActiveDomain);setDomRef.current=setActiveDomain
  const setTPRef=useRef(setShowTechPanel);setTPRef.current=setShowTechPanel
  const setAboutRef=useRef(setShowAbout);setAboutRef.current=setShowAbout
  const setDSARef=useRef(setShowDSA);setDSARef.current=setShowDSA
  const setExpRef=useRef(setShowExperience);setExpRef.current=setShowExperience
  const setContactRef=useRef(setShowContact);setContactRef.current=setShowContact
  const setCardRef=useRef(setCardPos);setCardRef.current=setCardPos
  const setTransRef=useRef(setIsTransitioning);setTransRef.current=setIsTransitioning
  const playClickRef=useRef(playClick);playClickRef.current=playClick
  const playHoverRef=useRef(playHover);playHoverRef.current=playHover
  const playWarpRef=useRef(playWarp);playWarpRef.current=playWarp

  useEffect(()=>{
    if(!canvasRef.current)return
    const renderer=new THREE.WebGLRenderer({canvas:canvasRef.current,antialias:true})
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setClearColor(0x05050f,1)
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.2
    const S=new THREE.Scene(); sceneObjRef.current=S
    const cam=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,2000)
    cam.position.set(0,5,26); cameraRef.current=cam
    clockRef.current=new THREE.Clock()
    const groups=groupsRef.current,clickables=clickablesRef.current
    nebMeshRef.current=buildNebula(S); starMeshesRef.current=buildStarfield(S); dustMeshRef.current=buildDust(S)
    buildBelt(S,groups,clickables); buildTunnel(S,groups); buildHub(S,groups,clickables)
    buildProjects(S,groups,clickables); buildCoreLang(S,groups,clickables); buildDSA(S,groups,clickables)
    buildDomains(S,groups,clickables); buildExperience(S,groups,clickables); buildContact(S,groups,clickables)
    isReadyRef.current=true
    let lastT=0
    const animate=()=>{rafRef.current=requestAnimationFrame(animate);const t=clockRef.current!.getElapsedTime(),dt=t-lastT;lastT=t;animateAll(t,dt,groups,nebMeshRef.current,starMeshesRef.current,dustMeshRef.current);cam.lookAt(lookAtRef.current.x,lookAtRef.current.y,lookAtRef.current.z);renderer.render(S,cam)}
    animate()
    const onClick=(e:MouseEvent)=>{
      const rect=canvasRef.current!.getBoundingClientRect()
      mvRef.current.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1)
      rcRef.current.setFromCamera(mvRef.current,cam)
      const hits=rcRef.current.intersectObjects(S.children,true)
      const hit=hits.find(h=>h.object as THREE.Mesh&&clickables.some(c=>c.mesh===h.object))
      if(!hit){setTechRef.current(null);setDomRef.current(null);return}
      const cl=clickables.find(c=>c.mesh===hit.object)!
      playClickRef.current()
      switch(cl.type){
        case 'link':if(cl.data.link&&cl.data.link!=='#')window.open(cl.data.link as string,'_blank');break
        case 'tech_star':setTPRef.current(true);break
        case 'planet':setTechRef.current(cl.data);setCardRef.current({x:e.clientX,y:e.clientY});break
        case 'project':setProjRef.current(cl.data);break
        case 'core_p':if(cl.data.link)window.open(cl.data.link as string,'_blank');else{setTechRef.current(cl.data);setCardRef.current({x:e.clientX,y:e.clientY})};break
        case 'domain':setDomRef.current(cl.data);setCardRef.current({x:e.clientX,y:e.clientY});break
        case 'nav':navRef.current(cl.data.ts as SceneID);break
        case 'about':case 'education':case 'achievements':setAboutRef.current(true);break
        case 'dsa':setDSARef.current(true);break
        case 'experience':setExpRef.current(true);break
        case 'contact':setContactRef.current(true);break
      }
    }
    const onMove=(e:MouseEvent)=>{
      const rect=canvasRef.current!.getBoundingClientRect()
      mvRef.current.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1)
      rcRef.current.setFromCamera(mvRef.current,cam)
      const hits=rcRef.current.intersectObjects(S.children,true)
      const isHit=hits.some(h=>h.object instanceof THREE.Mesh&&clickables.some(c=>c.mesh===h.object))
      document.body.style.cursor=isHit?'pointer':'default'
      if(isHit&&!prevHoverRef.current)playHoverRef.current()
      prevHoverRef.current=isHit
    }
    const onResize=()=>{cam.aspect=window.innerWidth/window.innerHeight;cam.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)}
    const cv=canvasRef.current
    cv.addEventListener('click',onClick); cv.addEventListener('mousemove',onMove); window.addEventListener('resize',onResize)
    return()=>{cancelAnimationFrame(rafRef.current);cv.removeEventListener('click',onClick);cv.removeEventListener('mousemove',onMove);window.removeEventListener('resize',onResize);renderer.dispose()}
  },[]) // eslint-disable-line

  useEffect(()=>{
    if(!isReadyRef.current){prevSceneRef.current=currentScene;return}
    if(prevSceneRef.current===currentScene)return
    const from=prevSceneRef.current; prevSceneRef.current=currentScene
    const cam=cameraRef.current!,lookAt=lookAtRef.current,groups=groupsRef.current
    const cfg=SCENE_CONFIGS[currentScene],[cx,cy,cz]=cfg.cam,[lx,ly,lz]=cfg.look
    const useTunnel=from==='asteroid_belt'||currentScene==='asteroid_belt'
    playWarpRef.current()
    if(useTunnel&&groups.galaxy_tunnel)groups.galaxy_tunnel.visible=true
    if(groups[currentScene])groups[currentScene].visible=true
    gsap.to(cam.position,{x:cx,y:cy,z:cz,duration:2.8,ease:'power2.inOut',onComplete:()=>{
      Object.keys(groups).forEach(k=>{if(k!==currentScene&&k!=='galaxy_tunnel'&&groups[k])groups[k].visible=false})
      if(useTunnel&&groups.galaxy_tunnel)groups.galaxy_tunnel.visible=false
      setTransRef.current(false)
    }})
    gsap.to(lookAt,{x:lx,y:ly,z:lz,duration:2.8,ease:'power2.inOut'})
  },[currentScene]) // eslint-disable-line

  return <canvas ref={canvasRef} className="fixed inset-0 block w-full h-full" />
}
