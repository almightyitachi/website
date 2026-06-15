"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import {
  Building2,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { ScaledGraphic } from "./ScaledGraphic"

// The Intelligence layer graphic — a hub-and-spoke "AI core" composition
// modelled on the reference: a glowing orb at the centre with long circuit
// traces running out to six satellites (three per side, staggered heights),
// lens-flare streaks where the traces meet the orb, and a dotted field
// behind. Energy pulses travel core → node on a phase-locked loop, so the
// read is "one intelligence empowering every surface of the network" —
// Campus, Assessment, Upskilling, Proctoring, Interview, Corporates.
// Tokens only, lucide icons, framer-motion, reduced-motion gated.
//
// Exposed two ways:
//   • <IntelligenceBeam tone="light|dark" /> — graphic only, fills its box
//     (designed at 587×477, scaled to fit via <ScaledGraphic>).
//   • <IntelligenceBeamCard /> — the graphic wrapped in a titled card.

type Tone = "light" | "dark"

const EASE = [0.16, 1, 0.3, 1] as const

// Shared design space with the other Section 4 graphics.
const VB_W = 587
const VB_H = 477

// Core orb centre + radius.
const CORE = { x: 293, y: 238, r: 58 }

// Loop choreography: every node shares one period so the pulses, node
// flashes and ping rings stay phase-locked forever. The period is short and
// the travel long, so with six staggered nodes a pulse departs roughly every
// 0.6s — the line/circle motion reads as continuous, not an occasional blip.
const PERIOD = 3.6 // s
const TRAVEL = 1.2 // s — pulse flight time, core → node

interface HubNode {
  key: string
  Icon: LucideIcon
  label: string
  /** Node centre in the shared viewBox space. */
  x: number
  y: number
  /** Circuit trace, orb edge → node edge (drawn core-out so pulses flow out). */
  trace: string
  /** Pulse departure order — staggers the loop around the hub. */
  order: number
}

const HUB_NODES: HubNode[] = [
  {
    key: "campus",
    Icon: GraduationCap,
    label: "Campus",
    x: 84,
    y: 96,
    trace: "M 241,212 H 214 Q 192,212 192,190 V 118 Q 192,96 170,96 H 116",
    order: 0,
  },
  {
    key: "assessment",
    Icon: ClipboardCheck,
    label: "Assessment",
    x: 84,
    y: 238,
    trace: "M 235,238 H 116",
    order: 2,
  },
  {
    key: "upskilling",
    Icon: BookOpen,
    label: "Upskilling",
    x: 84,
    y: 380,
    trace: "M 241,264 H 214 Q 192,264 192,286 V 358 Q 192,380 170,380 H 116",
    order: 4,
  },
  {
    key: "proctoring",
    Icon: ShieldCheck,
    label: "Proctoring",
    x: 502,
    y: 96,
    trace: "M 345,212 H 372 Q 394,212 394,190 V 118 Q 394,96 416,96 H 470",
    order: 1,
  },
  {
    key: "interview",
    Icon: MessagesSquare,
    label: "Interview",
    x: 502,
    y: 238,
    trace: "M 351,238 H 470",
    order: 3,
  },
  {
    key: "corporates",
    Icon: Building2,
    label: "Corporates",
    x: 502,
    y: 380,
    trace: "M 345,264 H 372 Q 394,264 394,286 V 358 Q 394,380 416,380 H 470",
    order: 5,
  },
]

const pct = (v: number, total: number) => `${(v / total) * 100}%`

// Corner pins for the satellite tiles, inset to clear the rounded corner.
const SAT_DOTS = [
  "left-2 top-2",
  "right-2 top-2",
  "left-2 bottom-2",
  "right-2 bottom-2",
]

// Lens-flare streak — a bright horizontal light line with a soft halo, sitting
// where the traces meet the orb (one per side, like the reference render).
function FlareStreak({
  side,
  reduce,
}: {
  side: "left" | "right"
  reduce: boolean
}) {
  return (
    <motion.div
      className="pointer-events-none absolute top-1/2 h-px w-[120px] -translate-y-1/2"
      style={{
        [side]: "50%",
        background: `linear-gradient(to ${side}, rgba(255,255,255,0.95), color-mix(in srgb, var(--color-primary-300) 80%, transparent) 35%, transparent)`,
      }}
      initial={false}
      animate={reduce ? undefined : { opacity: [0.35, 0.9, 0.35], scaleX: [0.82, 1.1, 0.82] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Halo around the bright end */}
      <div
        className={cn(
          "absolute top-1/2 h-10 w-16 -translate-y-1/2 rounded-full blur-xl opacity-70",
          side === "left" ? "left-0" : "right-0",
        )}
        style={{ background: "var(--color-primary-400)" }}
      />
    </motion.div>
  )
}

function IntelligenceHub({ tone }: { tone: Tone }) {
  const reduce = useReducedMotion() ?? false
  const isDark = tone === "dark"
  const rootRef = useRef<HTMLDivElement>(null)
  // Pause every loop while the graphic is off-screen — the pulses, pings and
  // breathing aura otherwise repaint forever after the section scrolls past,
  // which stacks with the other always-on graphics and stutters scrolling.
  const inView = useInView(rootRef, { margin: "0px" })
  const active = !reduce && inView

  return (
    <div ref={rootRef} aria-hidden className="relative h-full w-full">
      {/* Dotted field behind the hub, fading out at the edges */}
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(58%_58%_at_50%_50%,black_0%,transparent_100%)]"
        style={{
          backgroundImage: `radial-gradient(${
            isDark ? "rgba(255,255,255,0.13)" : "var(--color-neutral-300)"
          } 1.1px, transparent 1.1px)`,
          backgroundSize: "22px 22px",
        }}
      />

      {/* Trace + pulse layer */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="intel-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={isDark ? 0.32 : 0.16} />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="intel-pulse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary-400)" stopOpacity={0} />
            <stop offset="55%" stopColor="var(--color-primary-300)" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Breathing aura behind the core */}
        <motion.circle
          cx={CORE.x}
          cy={CORE.y}
          r={155}
          fill="url(#intel-aura)"
          initial={false}
          animate={active ? { opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] } : undefined}
          transition={{ duration: PERIOD, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }}
        />

        {HUB_NODES.map((node) => {
          const depart = node.order * (PERIOD / HUB_NODES.length)
          return (
            <g key={node.key}>
              {/* Static trace */}
              <path
                d={node.trace}
                fill="none"
                stroke={isDark ? "white" : "var(--color-neutral-400)"}
                strokeOpacity={isDark ? 0.3 : 0.45}
                strokeWidth={1.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Energy pulse — a single SOLID beam fired from the core to the
                  node, then a pause, then fired again (time-based, staggered
                  per node). One solid dash + a huge gap means only one beam is
                  ever on the trace; animating strokeDashoffset slides it from
                  the core (start of the path) out to the node, and repeatDelay
                  is the interval between emissions. strokeDashoffset is solid
                  across browsers (no pathLength/pathOffset/gradient quirks). */}
              {active && (
                <motion.path
                  d={node.trace}
                  fill="none"
                  stroke="var(--color-primary-300)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="28 1200"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    filter:
                      "drop-shadow(0 0 5px color-mix(in srgb, var(--color-primary-300) 90%, transparent))",
                  }}
                  initial={{ strokeDashoffset: 28 }}
                  animate={{ strokeDashoffset: [28, -240] }}
                  transition={{
                    duration: TRAVEL,
                    ease: "easeInOut",
                    delay: depart,
                    repeat: Infinity,
                    repeatDelay: PERIOD - TRAVEL,
                  }}
                />
              )}
              {/* Arrival is signalled by the node tile glowing (see the HTML
                  node layer below), not an expanding ring. */}
            </g>
          )
        })}
      </svg>

      {/* Node layer — crisp HTML over the trace endpoints */}
      <div className="absolute inset-0">
        {/* Core orb — the AI intelligence, with lens-flare streaks where the
            traces meet it */}
        <div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: pct(CORE.x, VB_W), top: pct(CORE.y, VB_H) }}
        >
          <div className="relative">
            {/* Outer glow */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 62%, transparent) 0%, transparent 70%)",
              }}
            />
            <FlareStreak side="left" reduce={!active} />
            <FlareStreak side="right" reduce={!active} />
            {/* Orb body */}
            <div
              className="relative flex size-[116px] items-center justify-center rounded-full ring-1 ring-white/30"
              style={{
                background:
                  "radial-gradient(120% 120% at 32% 24%, var(--color-primary-400) 0%, var(--color-primary-600) 52%, var(--color-primary-900) 100%)",
                boxShadow:
                  "0 0 0 1px color-mix(in srgb, var(--color-primary-300) 40%, transparent), inset 0 2px 8px rgba(255,255,255,0.35), inset 0 -14px 28px color-mix(in srgb, var(--color-primary-900) 75%, transparent), 0 18px 56px -10px color-mix(in srgb, var(--color-primary-600) 85%, transparent)",
              }}
            >
              {/* Top highlight */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(90% 60% at 50% 10%, rgba(255,255,255,0.45) 0%, transparent 55%)",
                }}
              />
              <motion.span
                className="relative flex"
                initial={false}
                animate={active ? { scale: [1, 1.08, 1] } : undefined}
                transition={{ duration: PERIOD / 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={46} strokeWidth={1.6} className="text-white" />
              </motion.span>
            </div>
          </div>
          <span
            className={cn(
              "mt-3 text-[15px] font-semibold tracking-[-0.01em]",
              isDark ? "text-white" : "text-[var(--text-primary)]",
            )}
          >
            PluginLive AI
          </span>
        </div>

        {/* Empowered surfaces — circular satellites, labels beneath */}
        {HUB_NODES.map((node) => {
          const depart = node.order * (PERIOD / HUB_NODES.length)
          return (
            <div
              key={node.key}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: pct(node.x, VB_W), top: pct(node.y, VB_H) }}
            >
              {/* Satellite flashes as the pulse arrives — same period as the
                  pulse loop (duration + repeatDelay = PERIOD) so they stay
                  locked. Circular per the reference; decorative, not a control. */}
              <span
                className={cn(
                  "relative flex size-14 items-center justify-center rounded-lg border",
                  isDark
                    ? "border-white/[0.14] bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
                    : "border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm",
                )}
              >
                {/* Powering glow — the tile blooms cobalt as the pulse lands,
                    reading as "energised by the core" rather than popping out. */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    boxShadow:
                      "0 0 18px 2px color-mix(in srgb, var(--color-primary-400) 70%, transparent), 0 0 5px 0 color-mix(in srgb, var(--color-primary-300) 85%, transparent)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: [0, 1, 0] } : undefined}
                  transition={{
                    duration: 1,
                    delay: depart + TRAVEL - 0.2,
                    repeat: Infinity,
                    repeatDelay: PERIOD - 1,
                    ease: "easeOut",
                  }}
                />
                <node.Icon
                  size={26}
                  strokeWidth={1.8}
                  className={isDark ? "text-white/90" : "text-[var(--text-primary)]"}
                />
                {/* Corner pins, coloured on the basis of the box bg. */}
                {SAT_DOTS.map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={cn(
                      "absolute size-1 rounded-full",
                      pos,
                      isDark ? "bg-white/25" : "bg-[var(--border-strong)]",
                    )}
                  />
                ))}
              </span>
              <span
                className={cn(
                  "mt-2.5 whitespace-nowrap font-mono text-[12px] tracking-wide",
                  isDark ? "text-white/65" : "text-[var(--text-muted)]",
                )}
              >
                {node.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Graphic-only hub — designed at 587×477, scaled to fit its container. */
export function IntelligenceBeam({
  tone = "light",
  className,
}: {
  tone?: Tone
  className?: string
}) {
  return (
    <ScaledGraphic designWidth={VB_W} designHeight={VB_H} className={className}>
      <IntelligenceHub tone={tone} />
    </ScaledGraphic>
  )
}

/** Titled card wrapper — used on the /v6-preview review route. */
export function IntelligenceBeamCard({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "mx-auto w-full max-w-sm rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 shadow-sm",
        className,
      )}
    >
      <div className="h-60 md:h-72">
        <IntelligenceBeam tone="light" />
      </div>
      <h3 className="pt-2 text-[var(--text-md)] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--text-primary)]">
        One vetted pool
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-[1.55] text-[var(--text-muted)]">
        Every candidate is scored on a single standard before you see them.
        Sources in, ranked shortlist out.
      </p>
    </motion.div>
  )
}
