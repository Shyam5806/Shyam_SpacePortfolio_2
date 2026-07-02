'use client'
// components/ui/MusicPlayer.tsx — repositioned to bottom-right

import { useScene } from '@/components/providers/SceneProvider'
import { useSpaceSound } from '@/lib/use-sound'

export default function MusicPlayer() {
  const { soundEnabled, setSoundEnabled } = useScene()
  useSpaceSound(soundEnabled)

  return (
    <div
      className="fixed z-[100] font-mono hidden md:flex items-center gap-4"
      style={{
        bottom: '24px',
        right:  '24px',
        background: 'rgba(5,5,15,.9)',
        border:     '1px solid rgba(139,127,255,.18)',
        padding:    '10px 16px',
        minWidth:   210,
      }}
    >
      <div
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm rounded-sm"
        style={{
          background: soundEnabled ? 'linear-gradient(135deg,#8B7FFF,#4FC3F7)' : 'rgba(139,127,255,.12)',
          animation:  soundEnabled ? 'spin 4s linear infinite' : 'none',
        }}
      >
        {soundEnabled ? '🎵' : '🔇'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] tracking-[2px] text-white truncate">
          {soundEnabled ? 'Cosmic Journey' : 'Space Silence'}
        </p>
        <p className="text-[8px] tracking-[1px] text-[#444] truncate">
          {soundEnabled ? 'Interstellar Beats' : 'Click ▶ to play'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-[#333] hover:text-[#8B7FFF] transition-colors text-xs">⏮</button>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white transition-all duration-300"
          style={{ background: soundEnabled ? '#8B7FFF' : 'rgba(139,127,255,.18)', border: '1px solid rgba(139,127,255,.4)' }}
        >
          {soundEnabled ? '⏸' : '▶'}
        </button>
        <button className="text-[#333] hover:text-[#8B7FFF] transition-colors text-xs">⏭</button>
      </div>
    </div>
  )
}
