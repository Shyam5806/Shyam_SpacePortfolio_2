'use client'
// lib/use-sound.ts — Procedural ambient space sound via Web Audio API
// No external audio files needed — generates everything with oscillators

import { useEffect, useRef, useCallback } from 'react'

export function useSpaceSound(enabled: boolean) {
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef     = useRef<AudioContext | null>(null)
  const masterRef  = useRef<GainNode | null>(null)
  const nodesRef   = useRef<AudioNode[]>([])

  // ── Build ambient soundscape ──────────────────
  const startAmbient = useCallback(() => {
    if (ctxRef.current) return
    const ctx    = new (window.AudioContext || (window as any).webkitAudioContext)()
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3)
    master.connect(ctx.destination)
    musicRef.current = new Audio("/sound/interstellar.mp3")

    musicRef.current.loop = true

    musicRef.current.volume = 0.05

    musicRef.current.preload = "auto"

    musicRef.current.play().catch(() => {})
    ctxRef.current  = ctx
    masterRef.current = master

    // Deep sub-bass drone
    const drone1 = ctx.createOscillator()
    const drone1g = ctx.createGain()
    drone1.type = 'sine'
    drone1.frequency.value = 40
    drone1g.gain.value = 0.5
    drone1.connect(drone1g)
    drone1g.connect(master)
    drone1.start()

    // Mid bass pulse
    const drone2 = ctx.createOscillator()
    const drone2g = ctx.createGain()
    drone2.type = 'sine'
    drone2.frequency.value = 60
    drone2g.gain.value = 0.25
    drone2.connect(drone2g)
    drone2g.connect(master)
    drone2.start()

    // High shimmer pad
    const shimmer  = ctx.createOscillator()
    const shimmerG = ctx.createGain()
    const shimmerF = ctx.createBiquadFilter()
    shimmer.type = 'sawtooth'
    shimmer.frequency.value = 220
    shimmerF.type = 'lowpass'
    shimmerF.frequency.value = 300
    shimmerG.gain.value = 0.04
    shimmer.connect(shimmerF)
    shimmerF.connect(shimmerG)
    shimmerG.connect(master)
    shimmer.start()

    // LFO modulation for drone1 (slow pulse)
    const lfo  = ctx.createOscillator()
    const lfoG = ctx.createGain()
    lfo.frequency.value = 0.08
    lfoG.gain.value = 0.12
    lfo.connect(lfoG)
    lfoG.connect(drone1g.gain)
    lfo.start()

    // Space noise layer
    const bufLen = ctx.sampleRate * 2
    const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const data   = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
    const noise  = ctx.createBufferSource()
    const noiseF = ctx.createBiquadFilter()
    const noiseG = ctx.createGain()
    noise.buffer = buf
    noise.loop   = true
    noiseF.type  = 'bandpass'
    noiseF.frequency.value  = 80
    noiseF.Q.value = 0.5
    noiseG.gain.value = 0.06
    noise.connect(noiseF)
    noiseF.connect(noiseG)
    noiseG.connect(master)
    noise.start()

    nodesRef.current = [drone1, drone2, shimmer, lfo, noise]
  }, [])

  const stopAmbient = useCallback(() => {
    nodesRef.current.forEach(n => { try { (n as OscillatorNode).stop() } catch {} })
    nodesRef.current = []
    if (masterRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(0, (ctxRef.current?.currentTime ?? 0) + 1)
    }
    if (musicRef.current) {

      musicRef.current.pause()
      musicRef.current.currentTime = 0
      musicRef.current=null

    }
    setTimeout(() => {
      ctxRef.current?.close()
      ctxRef.current  = null
      masterRef.current = null
    }, 1200)
  }, [])

  useEffect(() => {
    if (enabled) startAmbient()
    else stopAmbient()
    return () => {}
  }, [enabled, startAmbient, stopAmbient])

  // ── One-shot hover sound ──────────────────────
  const playHover = useCallback(() => {
    if (!enabled || !ctxRef.current) return
    const ctx  = ctxRef.current
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  }, [enabled])

  // ── Warp/transition sound ─────────────────────
  const playWarp = useCallback(() => {
    if (!enabled || !ctxRef.current) return
    const ctx  = ctxRef.current
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.8)
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.6)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 1.8)
  }, [enabled])

  // ── Click/select sound ────────────────────────
  const playClick = useCallback(() => {
    if (!enabled || !ctxRef.current) return
    const ctx  = ctxRef.current
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 660
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
  }, [enabled])

  return { playHover, playWarp, playClick }
}
