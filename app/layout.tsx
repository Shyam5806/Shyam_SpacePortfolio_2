// app/layout.tsx — v2

import type { Metadata, Viewport } from 'next'
import { Space_Mono } from 'next/font/google'
import { SceneProvider } from '@/components/providers/SceneProvider'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shyam Sunder Pandey — Space Portfolio',
  description:
    'Awwwards-level 3D interactive space portfolio. Full Stack Developer · AI/ML · Cybersecurity · B.Tech CSE Final Year, UEM Jaipur.',
  keywords: [
    'Shyam Sunder Pandey', 'Portfolio', 'Full Stack Developer',
    'AI ML', 'Cybersecurity', 'Three.js', 'Next.js', 'React',
    'Space Portfolio', '3D Portfolio', 'WebGL', 'UEM Jaipur',
  ],
  authors: [{ name: 'Shyam Sunder Pandey' }],
  openGraph: {
    title: 'Shyam Sunder Pandey — Space Portfolio',
    description: 'Immersive 3D space-themed portfolio built with Three.js + Next.js 14',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05050f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="bg-[#05050f] overflow-hidden">
        <SceneProvider>
          {children}
        </SceneProvider>
      </body>
    </html>
  )
}
