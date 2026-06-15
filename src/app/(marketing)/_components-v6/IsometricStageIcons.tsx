"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

// Layered isometric illustrations for the Explore cards (Sourcing /
// Evaluation / Upskilling). A flat cobalt "card" platform (a rounded deck over
// a connected dark base of the same shape) with a faint embossed surface and a
// soft offset shadow, plus one focused hero object above it whose colour is the
// card's audience accent, lit by a soft accent glow. Design-system only: cobalt
// ramp for the platform, the category accents (orange / amber / navy) for the
// hero, neutral-900 overlays for shading — no off-system hues, no raw hex.

type Pt = [number, number]

const sub = (p: Pt, q: Pt): Pt => [p[0] - q[0], p[1] - q[1]]
const add = (p: Pt, q: Pt): Pt => [p[0] + q[0], p[1] + q[1]]
const mul = (v: Pt, s: number): Pt => [v[0] * s, v[1] * s]
const unit = (v: Pt): Pt => {
  const m = Math.hypot(v[0], v[1]) || 1
  return [v[0] / m, v[1] / m]
}
const fmt = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")

// Rounded-corner path through a polygon (trims `cut` from each vertex).
function roundedPath(pts: Pt[], cut: number): string {
  const n = pts.length
  let d = ""
  for (let i = 0; i < n; i++) {
    const cur = pts[i]
    const prev = pts[(i - 1 + n) % n]
    const next = pts[(i + 1) % n]
    const p1 = add(cur, mul(unit(sub(prev, cur)), cut))
    const p2 = add(cur, mul(unit(sub(next, cur)), cut))
    d += i === 0 ? `M ${p1[0].toFixed(2)},${p1[1].toFixed(2)} ` : `L ${p1[0].toFixed(2)},${p1[1].toFixed(2)} `
    d += `Q ${cur[0].toFixed(2)},${cur[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)} `
  }
  return d + "Z"
}

// Top-face surface mapper for a rhombus (u along N→E, v along N→W).
function surface(cx: number, cy: number, hw: number, hh: number) {
  const N: Pt = [cx, cy - hh]
  const E: Pt = [cx + hw, cy]
  const W: Pt = [cx - hw, cy]
  return (u: number, v: number): Pt => [
    N[0] + u * (E[0] - N[0]) + v * (W[0] - N[0]),
    N[1] + u * (E[1] - N[1]) + v * (W[1] - N[1]),
  ]
}

// Per-audience accent for the hero (base + light highlight tone).
const ACCENTS: Record<string, { base: string; light: string }> = {
  sourcing: { base: "var(--color-brand-orange)", light: "var(--color-brand-orange-subtle)" },
  evaluation: { base: "var(--color-brand-navy)", light: "var(--color-brand-navy-subtle)" },
  upskilling: { base: "var(--color-brand-amber)", light: "var(--color-brand-amber-subtle)" },
}

const INK = "var(--color-neutral-900)"

interface SlabProps {
  cx: number
  cy: number
  hw: number
  hh: number
  th: number
  cut: number
  topFill: string
  sideFill: string
  shadeLeft?: number
  shadeRight?: number
}

// An isometric slab: rounded top rhombus + two extruded front faces.
function Slab({ cx, cy, hw, hh, th, cut, topFill, sideFill, shadeLeft = 0.2, shadeRight = 0.08 }: SlabProps) {
  const N: Pt = [cx, cy - hh]
  const E: Pt = [cx + hw, cy]
  const S: Pt = [cx, cy + hh]
  const W: Pt = [cx - hw, cy]
  const d: Pt = [0, th]
  const leftFace: Pt[] = [W, S, add(S, d), add(W, d)]
  const rightFace: Pt[] = [S, E, add(E, d), add(S, d)]
  return (
    <g stroke={INK} strokeOpacity={0.12} strokeLinejoin="round" strokeLinecap="round">
      <polygon points={fmt(leftFace)} fill={sideFill} />
      <polygon points={fmt(rightFace)} fill={sideFill} />
      {shadeLeft > 0 && <polygon points={fmt(leftFace)} fill={INK} opacity={shadeLeft} stroke="none" />}
      {shadeRight > 0 && <polygon points={fmt(rightFace)} fill={INK} opacity={shadeRight} stroke="none" />}
      <path d={roundedPath([N, E, S, W], cut)} fill={topFill} />
    </g>
  )
}

// Faint embossed surface on the platform deck (kept quiet so the hero leads).
function DeckSurface({ N, E, W }: { N: Pt; E: Pt; W: Pt }) {
  const P = (u: number, v: number): Pt => [
    N[0] + u * (E[0] - N[0]) + v * (W[0] - N[0]),
    N[1] + u * (E[1] - N[1]) + v * (W[1] - N[1]),
  ]
  const rows = [0.42, 0.6]
  return (
    <g>
      {rows.map((v, i) => {
        const a = P(0.24, v)
        const b = P(0.78, v)
        return (
          <line
            key={i}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke="var(--color-primary-300)"
            strokeOpacity={0.5}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

// ─── Hero objects ─────────────────────────────────────────────────────

// Sourcing — a ranked candidate-card stack, top card lifted and detailed.
function RankedStack({ ids, accent }: { ids: string; accent: string }) {
  const top = `url(#${ids}-popTop)`
  const slab = (cy: number) => (
    <Slab cx={90} cy={cy} hw={26} hh={14} th={5} cut={5} topFill={top} sideFill={accent} />
  )
  const P = surface(90, 38, 26, 14) // top (lifted) card face
  const avatar = P(0.3, 0.42)
  const l1 = [P(0.45, 0.36), P(0.78, 0.32)]
  const l2 = [P(0.45, 0.58), P(0.7, 0.54)]
  return (
    <>
      {slab(58)}
      {slab(50)}
      {slab(38)}
      <circle cx={avatar[0]} cy={avatar[1]} r={3.4} fill={INK} opacity={0.55} />
      <line x1={l1[0][0]} y1={l1[0][1]} x2={l1[1][0]} y2={l1[1][1]} stroke={INK} strokeOpacity={0.5} strokeWidth={2.2} strokeLinecap="round" />
      <line x1={l2[0][0]} y1={l2[0][1]} x2={l2[1][0]} y2={l2[1][1]} stroke={INK} strokeOpacity={0.32} strokeWidth={2.2} strokeLinecap="round" />
    </>
  )
}

// Upskilling — a growth chart: ascending bars with a trending arrow rising
// up-right over them.
function GrowthChart({ ids, accent }: { ids: string; accent: string }) {
  const top = `url(#${ids}-popTop)`
  const bar = (cx: number, cy: number, th: number) => (
    <Slab cx={cx} cy={cy} hw={8} hh={5} th={th} cut={2} topFill={top} sideFill={accent} shadeLeft={0.22} shadeRight={0.1} />
  )
  const trend: Pt[] = [
    [70, 55],
    [88, 47],
    [106, 38],
    [120, 29],
  ]
  const tip = trend[trend.length - 1]
  const dir = unit(sub(tip, trend[trend.length - 2]))
  const back = add(tip, mul(dir, -9))
  const wing = mul([-dir[1], dir[0]] as Pt, 5)
  const b1 = add(back, wing)
  const b2 = sub(back, wing)
  return (
    <>
      {bar(74, 58, 10)}
      {bar(90, 50, 18)}
      {bar(106, 42, 26)}
      <g fill="none" stroke={accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <polyline points={fmt(trend)} />
        <line x1={tip[0]} y1={tip[1]} x2={b1[0]} y2={b1[1]} />
        <line x1={tip[0]} y1={tip[1]} x2={b2[0]} y2={b2[1]} />
      </g>
    </>
  )
}

// Evaluation — a front-facing skill radar (spider chart) floating over the
// deck, matching the upskilling chart's upright view: a point-up five-axis
// web, a filled skill polygon for the applicant's profile, and a glowing node
// at each axis tip. Reads as "the candidate, measured across skills."
function SkillRadar({ ids, accent }: { ids: string; accent: string }) {
  const cx = 90
  const cy = 54
  const R = 30
  // Front view — straight screen-space projection (no iso skew), point up.
  const proj = (theta: number, r: number): Pt => [
    cx + r * R * Math.cos(theta),
    cy + r * R * Math.sin(theta),
  ]
  // Five axes, base angle -90° so one vertex points straight up.
  const base = -Math.PI / 2
  const step = (72 * Math.PI) / 180
  const angles = [0, 1, 2, 3, 4].map((k) => base + k * step)
  // An uneven, believable applicant profile (0..1 per skill).
  const skills = [0.92, 0.64, 0.85, 0.68, 0.8]
  const outer = angles.map((a) => proj(a, 1))
  const grid = angles.map((a) => proj(a, 0.62))
  const skillPts = angles.map((a, i) => proj(a, skills[i]))
  return (
    <>
      {/* web — faint full pentagon, an inner ring, and spokes from centre */}
      <g fill="none" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
        <polygon points={fmt(outer)} strokeOpacity={0.26} strokeWidth={1.3} />
        <polygon points={fmt(grid)} strokeOpacity={0.14} strokeWidth={1.2} />
        {outer.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} strokeOpacity={0.16} strokeWidth={1.2} />
        ))}
      </g>
      {/* filled applicant skill polygon */}
      <polygon
        points={fmt(skillPts)}
        fill={accent}
        fillOpacity={0.3}
        stroke={accent}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      {skillPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2} fill={accent} />
      ))}
      {/* glowing nodes at each axis tip */}
      {outer.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={5.5} fill={accent} opacity={0.18} />
          <circle cx={p[0]} cy={p[1]} r={3.2} fill={`url(#${ids}-popTop)`} stroke={accent} strokeWidth={1.4} />
        </g>
      ))}
      {/* centre hub */}
      <circle cx={cx} cy={cy} r={2.4} fill={accent} />
    </>
  )
}

const POPS: Record<string, (p: { ids: string; accent: string }) => React.JSX.Element> = {
  sourcing: RankedStack,
  evaluation: SkillRadar,
  upskilling: GrowthChart,
}

interface IsoStageIconProps extends React.SVGProps<SVGSVGElement> {
  variant: string
  animate?: boolean
  delay?: number
}

export function IsoStageIcon({ variant, animate = true, delay = 0, ...props }: IsoStageIconProps) {
  const reduce = useReducedMotion()
  const ids = React.useId().replace(/[:]/g, "")
  const Pop = POPS[variant] ?? RankedStack
  const acc = ACCENTS[variant] ?? ACCENTS.sourcing

  // Platform geometry (shared with the deck surface + connected base).
  const C: Pt = [90, 114]
  const hw = 60
  const hh = 33
  const th = 13
  const N: Pt = [C[0], C[1] - hh]
  const E: Pt = [C[0] + hw, C[1]]
  const S: Pt = [C[0], C[1] + hh]
  const W: Pt = [C[0] - hw, C[1]]
  const down: Pt = [0, th]
  const cut = 18

  const bob = !reduce && animate
  const floatTransition = {
    duration: 3.8,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
    delay,
  }

  return (
    <svg viewBox="0 0 180 180" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={`${ids}-platTop`} x1="0" y1="0" x2="0.45" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-50)" />
          <stop offset="100%" stopColor="var(--color-primary-200)" />
        </linearGradient>
        <linearGradient id={`${ids}-platBase`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-500)" />
          <stop offset="100%" stopColor="var(--color-primary-700)" />
        </linearGradient>
        <linearGradient id={`${ids}-popTop`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={acc.light} />
          <stop offset="100%" stopColor={acc.base} />
        </linearGradient>
        <radialGradient id={`${ids}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={acc.base} stopOpacity={0.3} />
          <stop offset="100%" stopColor={acc.base} stopOpacity={0} />
        </radialGradient>
        <filter id={`${ids}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>

      {/* Ground shadow — soft, offset toward the viewer */}
      <ellipse cx={92} cy={150} rx={56} ry={12} fill="var(--color-primary-700)" opacity={0.16} filter={`url(#${ids}-soft)`} />

      {/* Platform — connected base (same rounded shape shifted down) + deck */}
      <path
        d={roundedPath([add(N, down), add(E, down), add(S, down), add(W, down)], cut)}
        fill={`url(#${ids}-platBase)`}
        stroke="var(--color-primary-800)"
        strokeOpacity={0.3}
        strokeLinejoin="round"
      />
      <path
        d={roundedPath([N, E, S, W], cut)}
        fill={`url(#${ids}-platTop)`}
        stroke="var(--color-primary-500)"
        strokeOpacity={0.28}
        strokeLinejoin="round"
      />

      {/* Quiet embossed deck UI */}
      <DeckSurface N={N} E={E} W={W} />

      {/* Accent glow behind the hero */}
      <ellipse cx={90} cy={54} rx={46} ry={40} fill={`url(#${ids}-glow)`} />

      {/* Contact shadow under the hero — pulses with the bob */}
      <motion.ellipse
        cx={90}
        cy={96}
        rx={26}
        ry={7}
        fill="var(--color-primary-900)"
        filter={`url(#${ids}-soft)`}
        initial={false}
        animate={bob ? { opacity: [0.14, 0.09, 0.14], scale: [1, 0.94, 1] } : { opacity: 0.13 }}
        transition={bob ? floatTransition : undefined}
        style={{ transformOrigin: "90px 96px" }}
      />

      {/* Hero — idle bob */}
      <motion.g initial={false} animate={bob ? { y: [0, -4, 0] } : { y: 0 }} transition={bob ? floatTransition : undefined}>
        <Pop ids={ids} accent={acc.base} />
      </motion.g>
    </svg>
  )
}
