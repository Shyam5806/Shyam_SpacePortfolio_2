# 🚀 Space Portfolio v2 — Shyam Sunder Pandey

> An Awwwards-level immersive 3D space exploration portfolio built with Three.js, Next.js 14, GSAP, and custom GLSL shaders.

---

## ✦ What's New in v2

| Feature | v1 | v2 |
|---|---|---|
| Background | Flat black + stars | Animated GLSL nebula shader |
| Stars | Static points | 3-layer twinkling ShaderMaterial |
| Asteroids | Simple rocks | Holographic + glowing + per-light |
| Navigation | Minimap only | Top nav + numbered sidebar + minimap |
| Hero | Text sprites | Role pills + location widget + social sidebar |
| HUD Panels | Scene label | Universe Status + Live Data + Music Player |
| Planet material | Flat emissive | Fresnel atmosphere shader |
| New Scenes | 5 | 9 (+ DSA, Experience, Contact) |
| Sound | None | Web Audio API ambient procedural |
| DSA Section | None | Saturn-like planet with stats |
| Experience | None | Space station with timeline |
| Contact | None | Launch pad with rocket animation |
| Project Modal | Basic | Classified mission file style |
| Mobile | Basic fallback | Clean mobile landing page |

---

## 🌌 9 Scenes

| # | Scene | World ID | What's There |
|---|---|---|---|
| 01 | Asteroid Belt | Landing | Hero asteroid, 4 section rocks, info links, meteors |
| 02 | Galaxy Tunnel | Transition | 6000-particle helix wormhole |
| 03 | Solar Hub | SOL-01 | Central star + 12 tech planets + 6 nav stars |
| 04A | Project Stars | SOL-02 | 6 project stars with mission file modals |
| 04B | Core Languages | SOL-03 | Java star + 5 language planets |
| 04C | DSA Galaxy | SOL-04 | Saturn-like planet with ring system + stats |
| 05 | Domain Nebulae | SOL-05 | 6 particle nebulae (AI, Cyber, Web, DevOps…) |
| 06 | Experience Station | SOL-06 | Space station with internship timeline |
| 07 | Contact Station | SOL-07 | Launch pad + rocket resume download |

---

## ⚡ Quick Start

```bash
# 1. Install
npm install

# 2. Dev server
npm run dev

# 3. Open
http://localhost:3000
```

---

## 🚀 Deploy to Vercel

```bash
# Via CLI
npm i -g vercel && vercel

# Or: push to GitHub → import on vercel.com → Deploy
```

---

## 📁 Structure

```
space-portfolio-v2/
├── app/
│   ├── layout.tsx          ← Root layout + Space Mono
│   ├── page.tsx            ← Main page (assembles all)
│   └── globals.css         ← Keyframes, holographic CSS
├── components/
│   ├── canvas/
│   │   └── SpaceUniverse.tsx   ← Complete Three.js engine
│   ├── providers/
│   │   └── SceneProvider.tsx   ← Global state (9 scenes + overlays)
│   └── ui/
│       ├── LoadingScreen.tsx   ← Cinematic loader
│       ├── TopNav.tsx          ← Top navigation bar
│       ├── SidebarNav.tsx      ← Numbered left sidebar
│       ├── HeroOverlay.tsx     ← Role pills, location widget
│       ├── UniverseStatus.tsx  ← HUD stats widget
│       ├── LiveSpaceData.tsx   ← Real-time clock widget
│       ├── MusicPlayer.tsx     ← Now playing + sound toggle
│       ├── HUD.tsx             ← Scene label + back button
│       ├── ProjectModal.tsx    ← Mission file style modal
│       ├── TechPanel.tsx       ← Slide-in skill bars
│       ├── InfoCard.tsx        ← Holographic planet card
│       ├── AboutSection.tsx    ← Full-screen about overlay
│       ├── DSAPanel.tsx        ← Saturn stats panel
│       ├── ExperiencePanel.tsx ← Space station timeline
│       └── ContactPanel.tsx    ← Launch pad + rocket
├── data/
│   ├── profile.ts          ← ✏️ Edit your info here
│   ├── tech-stack.ts       ← ✏️ Planet IDs + skills
│   ├── projects.ts         ← ✏️ Project mission files
│   ├── core-lang.ts        ← ✏️ Language planets
│   ├── domains.ts          ← ✏️ Domain nebulae
│   ├── experience.ts       ← ✏️ Work experience
│   └── scene-configs.ts    ← Camera positions per scene
├── lib/
│   ├── shaders.ts          ← GLSL: nebula, atmosphere, holo, stars
│   ├── three-utils.ts      ← makeSprite, makeGlow, makeAtmosphere…
│   └── use-sound.ts        ← Web Audio API procedural sound
└── types/
    └── index.ts            ← All TypeScript interfaces
```

---

## ✏️ Customisation

Edit only `/data/` files:

| File | What to Update |
|---|---|
| `data/profile.ts` | Name, bio, links, DSA stats, academics |
| `data/projects.ts` | Project IDs, descriptions, GitHub links |
| `data/tech-stack.ts` | Planet IDs, skill levels, colors |
| `data/core-lang.ts` | Programming language planets |
| `data/experience.ts` | Work history + internships |
| `data/domains.ts` | Domain nebula names and colors |

Replace `public/shyam.jpg` with your own photo (keep the filename).

---

## 🎮 Controls

| Action | Result |
|---|---|
| `Click hero asteroid` | Open About section |
| `Click section asteroid (AST-01…04)` | Open respective section |
| `Click EXPLORE THE UNIVERSE` | Fly through galaxy tunnel → Solar Hub |
| `Click central star` | Tech Stack panel slides in |
| `Click any planet` | Holographic info card |
| `Click nav stars in hub` | Fly to that system |
| `Click project star` | Classified mission file modal |
| `Click DSA planet` | DSA stats panel |
| `Top nav links` | Jump to any scene |
| `Numbered sidebar` | Jump to any scene |
| `← BACK button` | Return to previous scene |
| `Escape` | Close any open panel |
| `Sound toggle (top nav)` | Enable/disable ambient audio |

---

Built with ❤️ by **Shyam Sunder Pandey** — Final Year B.Tech CSE, UEM Jaipur
