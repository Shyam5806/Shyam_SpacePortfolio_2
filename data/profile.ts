// data/profile.ts
import type { Profile } from '@/types'

export const PROFILE: Profile = {
  name:       'SHYAM SUNDER PANDEY',
  tagline:    'Building at the intersection of AI, Security & Code',
  subtitle:   'Crafting Solutions Across the Universe',
  degree:     'B.Tech CSE — Final Year',
  university: 'University of Engineering & Management, Jaipur',
  location:   'Jaipur, Rajasthan, India',
  email:      'shyamsunderpandey0508@gmail.com',
  github:     'https://github.com/shyam0508060409087',
  linkedin:   'https://linkedin.com/in/shyam-sunder-pandey-605542321',
  leetcode:   'https://leetcode.com/shyamsunderpandey',
  resume:     '#',
  roles:      ['Full Stack Developer', 'Backend Engineer', 'Java Developer', 'AI Enthusiast'],
  bio: `Final-year B.Tech CSE student at UEM Jaipur with a deep passion for
building technology that matters. I work at the intersection of AI/ML,
Cybersecurity, Full Stack Web Development, and Blockchain — crafting
solutions that solve real problems at scale.

Hackathon enthusiast, open-source contributor, and firm believer that
great software starts with understanding the human behind the screen.`,
  achievements: [
    '🏆 HackUEM 3.0 — 1st Place',
    '🥈 AceHack 5.0 — 11th Place (vs IIT / IIIT teams)',
    '🌍 Laserhacks — International Finalist',
    '⚡ 15+ Tech Events Won',
    '🚀 5+ National Hackathons',
  ],
  hackathons: [
    { name:'HackUEM 3.0', result:'1st Place 🏆', org:'UEM Jaipur', year:'2024', desc:'Won university flagship hackathon competing against 100+ teams across all departments.' },
    { name:'AceHack 5.0', result:'11th Place 🥈', org:'National Level', year:'2024', desc:'Ranked 11th nationally competing against elite IIT and IIIT teams — top 5% out of 200+.' },
    { name:'Laserhacks', result:'International Finalist 🌍', org:'International', year:'2024', desc:'Selected as international finalist competing with teams from across the globe.' },
  ],
  academics: [
    { institution:'University of Engineering & Management, Jaipur', degree:'B.Tech — Computer Science & Engineering', year:'2021 – 2025', grade:'Final Year', icon:'🎓' },
    { institution:'Class XII — PCM with Computer Science', degree:'Higher Secondary Education', year:'2021', grade:'—', icon:'🏫' },
    { institution:'Class X — Secondary Education', degree:'Board Examination', year:'2019', grade:'—', icon:'📚' },
  ],
  dsa: {
    problems: 450,
    streak:   150,
    rating:   '5⭐',
    contests: 12,
    badge:    'Knight',
    link:     'https://leetcode.com/shyamsunderpandey',
  },
}
