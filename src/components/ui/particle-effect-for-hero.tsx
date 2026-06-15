"use client"

import React, { useCallback, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// --- Types ---

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  accent: boolean // accent particles carry the brand voltage, the rest are inverse
  angle: number
}

interface BackgroundParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  phase: number
}

interface MouseState {
  x: number
  y: number
  isActive: boolean
}

interface BrandRGB {
  glow: string // primary-600 channels, e.g. "73, 79, 223"
  accent: string // primary-300 channels for the accent particle dots
}

// --- Configuration Constants ---

// Tuned down from the source demo: this runs as a full-screen decorative
// background, so we trade raw particle count for a calmer field and headroom
// on the O(n^2) collision pass.
const PARTICLE_DENSITY = 0.00009 // interactive particles per px^2
const BG_PARTICLE_DENSITY = 0.00004 // ambient drift particles per px^2
const MOUSE_RADIUS = 180 // radius of pointer influence
const RETURN_SPEED = 0.08 // spring constant pulling particles home
const DAMPING = 0.9 // velocity decay (friction)
const REPULSION_STRENGTH = 1.2 // pointer push multiplier

// --- Pure helpers ---

const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min

// Pull the brand voltage straight off the design-system tokens so the canvas
// never hardcodes a hex. `#494FDF` -> "73, 79, 223" channels for rgba() use.
const hexToRgbChannels = (hex: string, fallback: string): string => {
  const clean = hex.trim().replace("#", "")
  if (clean.length !== 6) return fallback
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return fallback
  return `${r}, ${g}, ${b}`
}

const readBrandRGB = (el: HTMLElement): BrandRGB => {
  const styles = getComputedStyle(el)
  return {
    glow: hexToRgbChannels(
      styles.getPropertyValue("--color-primary-600"),
      "73, 79, 223",
    ),
    accent: hexToRgbChannels(
      styles.getPropertyValue("--color-primary-300"),
      "132, 135, 228",
    ),
  }
}

const createParticles = (width: number, height: number): Particle[] => {
  const count = Math.floor(width * height * PARTICLE_DENSITY)
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    particles.push({
      x,
      y,
      originX: x,
      originY: y,
      vx: 0,
      vy: 0,
      size: randomRange(1, 2.5),
      accent: Math.random() > 0.9, // ~10% carry the brand accent
      angle: Math.random() * Math.PI * 2,
    })
  }
  return particles
}

const createBackgroundParticles = (
  width: number,
  height: number,
): BackgroundParticle[] => {
  const count = Math.floor(width * height * BG_PARTICLE_DENSITY)
  const particles: BackgroundParticle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: randomRange(0.5, 1.5),
      alpha: randomRange(0.1, 0.4),
      phase: Math.random() * Math.PI * 2,
    })
  }
  return particles
}

// --- Render passes (module-level: they mutate the arrays handed to them,
// kept out of the hook scope so the simulation stays mutable) ---

const drawGlow = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  glow: string,
  time: number,
  animated: boolean,
) => {
  const cx = w / 2
  const cy = h / 2
  const pulse = animated ? Math.sin(time * 0.0008) * 0.035 + 0.085 : 0.085
  const gradient = ctx.createRadialGradient(
    cx,
    cy,
    0,
    cx,
    cy,
    Math.max(w, h) * 0.7,
  )
  gradient.addColorStop(0, `rgba(${glow}, ${pulse})`)
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}

const drawAmbient = (
  ctx: CanvasRenderingContext2D,
  particles: BackgroundParticle[],
  w: number,
  h: number,
  time: number,
  animated: boolean,
) => {
  ctx.fillStyle = "#ffffff"
  for (const p of particles) {
    if (animated) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h
      if (p.y > h) p.y = 0
    }
    const twinkle = animated ? Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5 : 0.5
    ctx.globalAlpha = p.alpha * (0.3 + 0.7 * twinkle)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

const stepPhysics = (particles: Particle[], mouse: MouseState) => {
  // Phase 1: pointer repulsion + spring-home forces.
  for (const p of particles) {
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (mouse.isActive && distance < MOUSE_RADIUS && distance > 0) {
      const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS
      const repulsion = force * REPULSION_STRENGTH
      p.vx -= (dx / distance) * repulsion * 5
      p.vy -= (dy / distance) * repulsion * 5
    }

    p.vx += (p.originX - p.x) * RETURN_SPEED
    p.vy += (p.originY - p.y) * RETURN_SPEED
  }

  // Phase 2: elastic collision resolution between particles.
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i]
      const p2 = particles[j]
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const distSq = dx * dx + dy * dy
      const minDist = p1.size + p2.size

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq)
        if (dist > 0.01) {
          const nx = dx / dist
          const ny = dy / dist
          const overlap = minDist - dist
          const pushX = nx * overlap * 0.5
          const pushY = ny * overlap * 0.5
          p1.x -= pushX
          p1.y -= pushY
          p2.x += pushX
          p2.y += pushY

          const dvx = p1.vx - p2.vx
          const dvy = p1.vy - p2.vy
          const velocityAlongNormal = dvx * nx + dvy * ny
          if (velocityAlongNormal > 0) {
            const m1 = p1.size
            const m2 = p2.size
            const restitution = 0.85
            const impulse =
              (-(1 + restitution) * velocityAlongNormal) / (1 / m1 + 1 / m2)
            p1.vx += (impulse * nx) / m1
            p1.vy += (impulse * ny) / m1
            p2.vx -= (impulse * nx) / m2
            p2.vy -= (impulse * ny) / m2
          }
        }
      }
    }
  }
}

const drawForeground = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  accent: string,
  animated: boolean,
) => {
  for (const p of particles) {
    if (animated) {
      p.vx *= DAMPING
      p.vy *= DAMPING
      p.x += p.vx
      p.y += p.vy
    }
    const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    const opacity = Math.min(0.3 + velocity * 0.1, 1)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = p.accent
      ? `rgba(${accent}, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`
    ctx.fill()
  }
}

/**
 * ParticleField — the anti-gravity canvas background.
 *
 * A 2D-canvas particle simulation: interactive dots spring back to their
 * origin after the pointer scatters them, drifting ambient "dust" twinkles
 * behind, and a slow brand-tinted radial glow pulses at centre. Brand colour
 * is read from the live `--color-primary-*` tokens (never hardcoded), so it
 * inherits any theme repaint. Decorative and `aria-hidden`; the pointer
 * interaction is purely visual. Collapses to a single static frame under
 * `prefers-reduced-motion`.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mutable refs keep the animation loop off the React render path.
  const particlesRef = useRef<Particle[]>([])
  const backgroundParticlesRef = useRef<BackgroundParticle[]>([])
  const mouseRef = useRef<MouseState>({ x: -1000, y: -1000, isActive: false })
  const frameIdRef = useRef<number>(0)
  const brandRef = useRef<BrandRGB>({
    glow: "73, 79, 223",
    accent: "132, 135, 228",
  })

  // One full draw pass. Pulled out so reduced-motion can render exactly one
  // static frame without entering the rAF loop.
  const draw = useCallback((time: number, animated: boolean) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    const brand = brandRef.current

    ctx.clearRect(0, 0, w, h)
    drawGlow(ctx, w, h, brand.glow, time, animated)
    drawAmbient(ctx, backgroundParticlesRef.current, w, h, time, animated)
    if (animated) stepPhysics(particlesRef.current, mouseRef.current)
    drawForeground(ctx, particlesRef.current, brand.accent, animated)
  }, [])

  // Resize: size the canvas to the container at device pixel ratio, refresh
  // the brand tokens, and reseed particles for the new dimensions.
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current
      const canvas = canvasRef.current
      if (!container || !canvas) return

      const { width, height } = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const ctx = canvas.getContext("2d")
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      brandRef.current = readBrandRGB(container)
      particlesRef.current = createParticles(width, height)
      backgroundParticlesRef.current = createBackgroundParticles(width, height)

      // Repaint a static frame immediately so reduced-motion users (who never
      // enter the rAF loop) still see a fully-rendered field after a resize.
      draw(0, false)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [draw])

  // Animation loop, gated on prefers-reduced-motion.
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReduced) {
      draw(0, false)
      return
    }

    const loop = (time: number) => {
      draw(time, true)
      frameIdRef.current = requestAnimationFrame(loop)
    }
    frameIdRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameIdRef.current)
  }, [draw])

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isActive: true,
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current = { ...mouseRef.current, isActive: false }
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden bg-[var(--bg-brand)]",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  )
}

export default ParticleField
