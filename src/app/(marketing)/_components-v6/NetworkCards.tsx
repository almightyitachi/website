"use client"

import { useEffect, useRef, useState } from "react"
import { Building2, GraduationCap, HeartHandshake } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion"

import { PluginLiveMark } from "./PluginLiveMark"

// The Network layer graphic: the PluginLive chip at the centre with the
// placement network arranged as three concentric orbits around it — NGOs on
// the innermost ring, Institutes on the middle ring, Corporates on the outer
// ring. Each ring sits one fixed icon node; the descriptions reveal one at a
// time on a loop (icon → expands to icon + label + count → collapses → next).
// Around them a sweeping highlight arc and drifting member dots keep the
// orbits alive. Loops forever (like the Intelligence and Data graphics);
// reduced motion shows every label and pins the motion.

const EASE = [0.16, 1, 0.3, 1] as const

// Shared coordinate space with the other Section 4 graphics.
const VB_W = 587
const VB_H = 477

const CENTER = { x: 293, y: 238 }

interface Ring {
  key: string
  label: string
  count: string
  icon: typeof Building2
  r: number
  /** Fixed angle (deg) where this ring's icon node sits on its orbit. The
   *  three are spread top / lower-left / lower-right so an expanded label
   *  never reaches the centre tile or another node. */
  angle: number
  /** Member-dot positions, as angles (deg) around the ring. */
  dots: number[]
  /** Member-dot drift duration (s) — outer rings drift slower. */
  drift: number
  /** Dot-drift direction alternates per ring for depth. */
  dir: 1 | -1
  /** Sweep arc rotation duration (s). */
  sweep: number
}

const RINGS: Ring[] = [
  {
    key: "ngos",
    label: "NGOs",
    count: "80+",
    icon: HeartHandshake,
    r: 112,
    angle: 35,
    dots: [150, 250, 320],
    drift: 38,
    dir: 1,
    sweep: 9,
  },
  {
    key: "institutes",
    label: "Institutes",
    count: "540+",
    icon: GraduationCap,
    r: 156,
    angle: 145,
    dots: [-40, 65, 250],
    drift: 52,
    dir: -1,
    sweep: 12,
  },
  {
    key: "corporates",
    label: "Corporates",
    count: "500+",
    icon: Building2,
    r: 200,
    angle: -90,
    dots: [40, 130, 210, 290],
    drift: 68,
    dir: 1,
    sweep: 15,
  },
]

// Each label is revealed for this long before the next one takes over.
const REVEAL_MS = 2400

const rad = (deg: number) => (deg * Math.PI) / 180
const onRing = (r: number, angleDeg: number) => ({
  x: CENTER.x + r * Math.cos(rad(angleDeg)),
  y: CENTER.y + r * Math.sin(rad(angleDeg)),
})
const pct = (v: number, total: number) => `${(v / total) * 100}%`

export function NetworkCards() {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  // Pause every loop while the graphic is off-screen. The orbits and dots run
  // forever; left ungated they keep repainting after the section scrolls away,
  // which (stacked with the other always-on graphics) is what makes scrolling
  // stutter. `active` freezes them when not in view.
  const inView = useInView(rootRef, { margin: "0px" })
  const active = !reduce && inView

  // Sequential label reveal — one node's description is shown at a time,
  // advancing on a loop while in view. Reduced motion shows them all.
  const [revealIdx, setRevealIdx] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(
      () => setRevealIdx((i) => (i + 1) % RINGS.length),
      REVEAL_MS,
    )
    return () => clearInterval(id)
  }, [active])
  const isRevealed = (i: number) => reduce || revealIdx === i

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative h-full w-full duration-700 animate-in fade-in-0 motion-reduce:animate-none"
    >
      {/* Ring + orbit layer */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="net-chip-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={0.26} />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="net-sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="var(--color-primary-300)" />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0.2} />
          </linearGradient>
        </defs>

        {/* Aura behind the chip */}
        <circle cx={CENTER.x} cy={CENTER.y} r={150} fill="url(#net-chip-aura)" />

        {RINGS.map((ring) => {
          const circ = 2 * Math.PI * ring.r
          return (
          <g key={ring.key}>
            {/* Orbit base */}
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={ring.r}
              fill="none"
              stroke="white"
              strokeOpacity={0.28}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
            />

            {/* Orbiting arc — a single SOLID arc (~30% of the circumference)
                that revolves continuously and slowly around the ring. One solid
                arc + a gap filling the rest means exactly one arc is visible;
                animating strokeDashoffset by one full circumference at a linear
                rate slides it around forever with no pause (seamless loop, since
                the offset delta equals one whole dash cycle). */}
            {active && (
              <motion.circle
                cx={CENTER.x}
                cy={CENTER.y}
                r={ring.r}
                fill="none"
                stroke="var(--color-primary-300)"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeDasharray={`${(circ * 0.3).toFixed(1)} ${(circ * 0.7).toFixed(1)}`}
                vectorEffect="non-scaling-stroke"
                style={{
                  filter:
                    "drop-shadow(0 0 4px color-mix(in srgb, var(--color-primary-300) 75%, transparent))",
                }}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: ring.dir * -circ }}
                transition={{
                  duration: ring.sweep * 1.6,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            )}

            {/* Member dots drifting along the orbit */}
            <motion.g
              initial={false}
              animate={active ? { rotate: 360 * ring.dir } : undefined}
              transition={{ duration: ring.drift, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
            >
              {ring.dots.map((angle, i) => {
                const p = onRing(ring.r, angle)
                return (
                  <motion.circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={5.5}
                    fill="var(--color-primary-400)"
                    fillOpacity={0.85}
                    stroke="white"
                    strokeOpacity={0.2}
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={active ? { opacity: [0.55, 1, 0.55] } : undefined}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  />
                )
              })}
            </motion.g>
          </g>
          )
        })}
      </svg>

      {/* Node layer — crisp HTML over the orbits */}
      <div className="absolute inset-0">
        {/* Central PluginLive chip — mark + wordmark in one container; sits
            above the revolving chips so nothing ever reads as crossing it */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(CENTER.x, VB_W), top: pct(CENTER.y, VB_H) }}
        >
          <div className="relative">
            {/* Outer glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 55%, transparent) 0%, transparent 70%)",
              }}
            />
            {/* Chip body */}
            <div
              className="relative flex items-center gap-2.5 rounded-md px-4 py-3 ring-1 ring-white/25"
              style={{
                background:
                  "linear-gradient(150deg, var(--color-primary-400) 0%, var(--color-primary-600) 55%, var(--color-primary-700) 100%)",
                boxShadow:
                  "0 0 0 1px color-mix(in srgb, var(--color-primary-300) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.35), 0 16px 40px -8px color-mix(in srgb, var(--color-primary-600) 70%, transparent)",
              }}
            >
              {/* Inner highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-md"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 18%, rgba(255,255,255,0.4) 0%, transparent 55%)",
                }}
              />
              <PluginLiveMark className="relative h-[30px] w-[27px] text-white" />
              <span className="relative text-[17px] font-semibold tracking-[-0.01em] text-white">
                PluginLive
              </span>
            </div>
          </div>
        </div>

        {/* Ring nodes — one fixed icon per orbit, the icon centred on its ring
            point. Each is just an icon until its turn comes round, when the
            pill grows (layout) to reveal the label and count beside it, then
            collapses as the next node takes over. The outer wrapper carries the
            static centring offset so it never fights the layout animation. */}
        {RINGS.map((ring, i) => {
          const Icon = ring.icon
          const p = onRing(ring.r, ring.angle)
          const revealed = isRevealed(i)
          return (
            <div
              key={ring.key}
              className="absolute z-[5]"
              style={{ left: pct(p.x, VB_W), top: pct(p.y, VB_H) }}
            >
              {/* Offset so the 36px icon's centre lands on the ring point;
                  the pill then grows rightward from the icon. */}
              <div className="-translate-x-[20px] -translate-y-1/2">
                <motion.div
                  layout
                  transition={{ type: "spring", duration: 0.5, bounce: 0.16 }}
                  className="flex w-fit items-center gap-2 whitespace-nowrap rounded-full border p-1 shadow-md backdrop-blur-sm"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, white 8%, var(--bg-brand))",
                    borderColor: revealed
                      ? "color-mix(in srgb, var(--color-primary-300) 55%, transparent)"
                      : "rgba(255,255,255,0.12)",
                  }}
                >
                  <motion.span
                    layout
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-white"
                    animate={reduce ? undefined : { scale: revealed ? 1.05 : 1 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={
                      revealed
                        ? {
                            boxShadow:
                              "0 0 0 4px color-mix(in srgb, var(--color-primary-500) 26%, transparent)",
                          }
                        : undefined
                    }
                  >
                    <Icon className="size-[18px]" />
                  </motion.span>
                  <AnimatePresence initial={false}>
                    {revealed && (
                      <motion.span
                        key="desc"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="flex items-center gap-2 pr-1.5"
                      >
                        <span className="text-[13px] font-semibold leading-none text-white">
                          {ring.label}
                        </span>
                        <span className="font-mono text-[11px] leading-none text-white/55">
                          {ring.count}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
