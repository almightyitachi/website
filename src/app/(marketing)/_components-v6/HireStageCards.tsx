"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { GraduationCap, Plus, Radar, ScanSearch, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { CountUpStat } from "./CountUpStat"
import { IsoStageIcon } from "./IsometricStageIcons"
import { SectionHeading } from "./SectionHeading"

// Strong custom curves (the built-in CSS easings are too weak to feel
// intentional). EASE drives entrances (ease-out — instant, responsive);
// EASE_IN_OUT drives the on-screen flip morph (natural accel + decel).
const EASE = [0.16, 1, 0.3, 1] as const
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

// Front-icon style. Set to false to revert the Explore cards to the lucide
// icons (kept on each card's `Icon`) — the isometric set is an experiment.
const USE_ISOMETRIC_ICONS = true

// ─── Data ─────────────────────────────────────────────────────────────
// One card per stage of the network. Each owns a category accent (cobalt /
// navy / amber) used on its large line icon, plus a back-face explanation
// the + button flips to. `backAccent` is the accent's legible tone on the
// dark back surface.

interface StageCard {
  id: string
  Icon: LucideIcon
  subtitle: string
  title: string
  description: string
  /** Brief plain-language meaning, revealed on the flipped back face. */
  meaning: string
  /** Category accent token for the front icon. */
  accent: string
}

const STAGE_CARDS: StageCard[] = [
  {
    id: "sourcing",
    Icon: ScanSearch,
    subtitle: "Scored on merit",
    title: "Sourcing",
    description: "A pre-vetted pool drawn across 540+ campuses, every name traceable to source.",
    meaning:
      "Source across 540+ campuses as one pre-vetted pool on our platform. Every candidate stays traceable to the source institution, ready to be measured against one common standard.",
    accent: "var(--color-brand-orange)",
  },
  {
    id: "evaluation",
    Icon: Radar,
    subtitle: "Standardised competency benchmarks",
    title: "Evaluation",
    description: "AI-proctored assessments that score and rank every candidate on the same standard.",
    meaning:
      "Drawing on real hiring requirements from industry partners, our AI-proctored assessments and interviews evaluate every candidate against the same market-aligned skill framework, enabling fair comparisons, transparent rankings, identification of top performers, and evidence-based hiring decisions.",
    accent: "var(--color-brand-navy)",
  },
  {
    id: "upskilling",
    Icon: GraduationCap,
    subtitle: "Ready for interviews",
    title: "Upskilling",
    description: "Role-benchmarked learning that closes skill gaps before the interview.",
    meaning:
      "Our AI maps each candidate's skill gaps against what the role demands, then delivers personalised upskilling pathways that close those gaps, so learners become genuinely role-ready before they reach the interview.",
    accent: "var(--color-brand-amber)",
  },
]

// Shared with the "Stages" list variant so both Section 3 layouts read alike.
const STATS = [
  { value: "2.4M+", label: "Candidates onboarded" },
  { value: "800+", label: "Corporate partners hiring with us" },
  { value: "1,200+", label: "Institutes & NGOs connected" },
  { value: "62%", label: "Faster time to offer (avg.)" },
]

// Hover-capable pointer (desktop). Touch devices report `hover: none`, so
// they keep the tap-to-flip interaction with the plus affordance; desktops
// flip on hover and drop the plus.
function useCanHover() {
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setCanHover(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return canHover
}

// ─── Card ─────────────────────────────────────────────────────────────

function StageRevealCard({
  card,
  index,
  flipped,
  hoverMode,
  onFlip,
  onClose,
}: {
  card: StageCard
  index: number
  flipped: boolean
  /** Flip on hover (desktop pointers); false keeps tap-to-flip (touch). */
  hoverMode: boolean
  onFlip: () => void
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const { Icon } = card

  // 3D tilt — track the cursor over the card and lean it toward the pointer.
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 18, stiffness: 160 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)
  const rotateX = useTransform(springY, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || flipped) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    if (hoverMode) onClose()
  }

  const depth = (z: number) =>
    reduce ? undefined : { transform: `translateZ(${z}px)` }

  // Whole-card flip: the face itself is the button. Enter/Space activate it
  // (matching native button behaviour) so keyboard users get the same gesture.
  const onKey = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      action()
    }
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay: 0.08 * index, ease: EASE }}
      style={{ perspective: 1200 }}
      className="h-[380px] lg:h-[410px]"
    >
      {/* Tilt layer — leans toward the cursor. In hover mode entering the
          card flips it and leaving flips it back. */}
      <motion.div
        onMouseEnter={hoverMode ? onFlip : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className="group/card relative h-full w-full"
      >
        {/* Flip layer — rotates in place to reveal the back face */}
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_IN_OUT }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-full w-full"
        >
          {/* ── FRONT ─────────────────────────────────────────── */}
          <div
            aria-hidden={flipped}
            role="button"
            tabIndex={flipped ? -1 : 0}
            aria-pressed={flipped}
            aria-label={`Read what ${card.title} means`}
            onClick={hoverMode || flipped ? undefined : onFlip}
            onKeyDown={(e) => !flipped && onKey(e, onFlip)}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
            className={cn(
              "absolute inset-0 cursor-pointer overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm outline-none transition-shadow duration-300 group-hover/card:shadow-md focus-visible:ring-2 focus-visible:ring-[var(--color-primary-600)] focus-visible:ring-offset-2",
              flipped && "pointer-events-none",
            )}
          >
            {/* Dotted grid + large icon, bleeding off the base */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(var(--border-strong) 1.1px, transparent 1.1px)",
                  backgroundSize: "20px 20px",
                  WebkitMaskImage:
                    "linear-gradient(to top, black 0%, black 38%, transparent 78%)",
                  maskImage:
                    "linear-gradient(to top, black 0%, black 38%, transparent 78%)",
                }}
              />
              {USE_ISOMETRIC_ICONS ? (
                <IsoStageIcon
                  variant={card.id}
                  delay={index * 0.6}
                  className="absolute bottom-6 left-1/2 h-[200px] w-[200px] -translate-x-1/2"
                  style={depth(28)}
                />
              ) : (
                <Icon
                  size={200}
                  strokeWidth={1.1}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2"
                  style={{ color: card.accent, ...depth(28) }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Subtitle + title + description */}
            <div className="relative z-10 flex flex-col p-7" style={depth(45)}>
              <p className="text-base text-[var(--text-primary)]">
                {card.subtitle}
              </p>
              <h3 className="mt-3 text-[clamp(26px,2.8vw,30px)] font-semibold leading-none tracking-[-0.02em] text-[var(--text-primary)]">
                {card.title}
              </h3>
              <p className="mt-3 line-clamp-2 max-w-[26ch] text-[14px] leading-[1.55] text-[var(--text-muted)]">
                {card.description}
              </p>
            </div>

            {/* Plus affordance — glass, bottom-right. Touch-only: it signals
                the tap-to-flip gesture. Hidden in hover mode, where hovering
                the card flips it without a click. */}
            {!hoverMode && (
              <span
                aria-hidden="true"
                style={depth(60)}
                className="pointer-events-none absolute bottom-5 right-5 z-20 inline-flex size-11 items-center justify-center rounded-full bg-white/60 text-[var(--text-primary)] ring-1 ring-inset ring-black/10 backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.75),0_2px_6px_-1px_rgba(26,25,23,0.12)] group-hover/card:bg-white/80"
              >
                <Plus
                  size={18}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:rotate-90"
                />
              </span>
            )}
          </div>

          {/* ── BACK ──────────────────────────────────────────── */}
          <div
            aria-hidden={!flipped}
            role="button"
            tabIndex={flipped ? 0 : -1}
            aria-label={`Hide what ${card.title} means`}
            onClick={!hoverMode && flipped ? onClose : undefined}
            onKeyDown={(e) => flipped && onKey(e, onClose)}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className={cn(
              "absolute inset-0 cursor-pointer overflow-hidden rounded-xl bg-[var(--bg-brand)] text-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-brand)]",
              !flipped && "pointer-events-none",
            )}
          >
            {/* Faint dotted grid on the dark face */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.06) 1.1px, transparent 1.1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Enlarged grey icon — bottom-right watermark */}
            {USE_ISOMETRIC_ICONS ? (
              <IsoStageIcon
                variant={card.id}
                animate={false}
                className="pointer-events-none absolute bottom-4 right-0 z-0 h-[240px] w-[240px] opacity-25 grayscale"
              />
            ) : (
              <Icon
                aria-hidden="true"
                size={182}
                strokeWidth={1.1}
                className="pointer-events-none absolute bottom-5 right-5 z-0 text-white/[0.09]"
              />
            )}

            <div className="relative z-10 flex h-full flex-col p-7">
              <h3 className="text-[24px] font-semibold leading-none tracking-[-0.02em] text-white">
                {card.title}
              </h3>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.6] text-white/75">
                {card.meaning}
              </p>
            </div>

            {/* Glass close affordance — touch-only signifier that tapping the
                back face closes the flip. Hidden in hover mode, where leaving
                the card flips it back. */}
            {!hoverMode && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-5 right-5 z-20 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:bg-white/20"
              >
                <Plus
                  size={18}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="rotate-45 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:rotate-[135deg]"
                />
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Public export ─────────────────────────────────────────────────────

export function HireStageCards({ id = "v3-altitudes" }: { id?: string } = {}) {
  const reduce = useReducedMotion()
  // Only one card flips open at a time — tapping another closes the current.
  const [activeId, setActiveId] = useState<string | null>(null)
  // Desktop pointers flip on hover (no plus affordance); touch keeps the
  // tap-to-flip interaction with the plus.
  const canHover = useCanHover()

  // One-time flip demo: shortly after the cards enter view, the first card
  // flips to its back, holds long enough to read, and flips home — teaching
  // the gesture without taking control. Any real interaction cancels it.
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { once: true, margin: "-25% 0px" })
  const userTouched = useRef(false)
  useEffect(() => {
    if (!gridInView || reduce) return
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(
      setTimeout(() => {
        if (userTouched.current) return
        setActiveId(STAGE_CARDS[0].id)
        timers.push(
          setTimeout(() => {
            if (userTouched.current) return
            setActiveId((cur) => (cur === STAGE_CARDS[0].id ? null : cur))
          }, 2200),
        )
      }, 700),
    )
    return () => timers.forEach(clearTimeout)
  }, [gridInView, reduce])

  return (
    <section
      id={id}
      data-section-bg="light"
      // z-10 so the section covers the sticky V4 hero on scroll.
      className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <SectionHeading
          pre="The hiring stack,"
          hook="assembled"
          className="mb-16 lg:mb-20"
        />

        {/* Separated cards — each its own 3D tilt + flip tile */}
        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-6">
          {STAGE_CARDS.map((card, i) => (
            <StageRevealCard
              key={card.id}
              card={card}
              index={i}
              flipped={activeId === card.id}
              hoverMode={canHover}
              onFlip={() => {
                userTouched.current = true
                setActiveId(card.id)
              }}
              onClose={() => {
                userTouched.current = true
                setActiveId(null)
              }}
            />
          ))}
        </div>

        {/* Stats row — shared with the Stages variant */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-[var(--border-default)] pt-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: 0.06 * i, ease: EASE }}
              className="text-center"
            >
              <CountUpStat
                value={stat.value}
                delay={0.06 * i}
                className="block text-[clamp(40px,5vw,64px)] font-bold leading-[1] tracking-[-0.03em] tabular-nums text-[var(--text-primary)]"
              />
              <p className="mt-2 text-sm text-[var(--text-muted)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
