"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"

import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/ui/3d-card-effect"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

// Section 6 — Audience capability cards. Four cards, one per audience
// segment. Card anatomy (matches CorporatesFeatureCards exactly):
//   1. Eyebrow         — audience label
//   2. Heading         — outcome promise
//   3. Description     — 1-2 line hint
//   4. Animated mockup — bottom-anchored, ambient activity inside
//
// On hover the whole card tilts via `CardContainer`'s rotateX/Y and each
// layer translates forward on Z. The Link is an absolute overlay so it
// doesn't break the tilt anchor.

const EASE = [0.16, 1, 0.3, 1] as const

interface CapabilityCard {
  id: string
  audience: string
  title: string
  hint: string
  href: string
  Visual: React.ComponentType
}

const CARDS: CapabilityCard[] = [
  {
    id: "corporates",
    audience: "For Corporates",
    title: "Ranked shortlist in 48 hours",
    hint: "Filter the network; receive a pre-vetted pool, ranked by proctored score.",
    href: "/corporates",
    Visual: CorporatesVisual,
  },
  {
    id: "tpos",
    audience: "For Institutes & NGOs",
    title: "Placement-rate lift, every cohort",
    hint: "Onboard the batch once. Accept drives. Track the climb live.",
    href: "/institutes",
    Visual: InstitutesVisual,
  },
  {
    id: "executive-search",
    audience: "For Executive Search",
    title: "Founder-led search, four practice areas",
    hint: "IB, PE/VC, Wealth, AMC. Every mandate runs through a principal.",
    href: "/executive-search",
    Visual: ExecutivesVisual,
  },
  {
    id: "career-centre",
    audience: "For Students",
    title: "Career Centre · courses to offers",
    hint: "Build the skill. Earn the certificate. Surface to recruiters.",
    href: "/career-centre",
    Visual: StudentsVisual,
  },
]

interface CapabilityCardsProps {
  /** Optional override per-card hints. The defaults preserve the
   *  current marketing copy; the AI-narrative variant passes alternate
   *  hints keyed by card id. */
  hints?: Partial<Record<string, string>>
  /** Optional eyebrow / heading / subhead overrides. */
  eyebrow?: React.ReactNode
  heading?: React.ReactNode
  subhead?: React.ReactNode
}

export function CapabilityCards({
  hints,
  eyebrow,
  heading,
  subhead,
}: CapabilityCardsProps = {}) {
  return (
    <section
      id="capabilities"
      data-section-bg="light"
      className="border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          {eyebrow ?? <Eyebrow>Built for every audience</Eyebrow>}
          <h2 className="mt-2 text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]">
            {heading ?? (
              <>
                One network.{" "}
                <span className="text-[var(--color-primary-600)]">
                  Every audience.
                </span>
              </>
            )}
          </h2>
          <p className="mt-5 text-base leading-[1.55] text-[var(--text-body)] lg:text-[17px]">
            {subhead ??
              "Corporates, institutes, executives, students. Each gets a surface that closes their next move."}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:auto-rows-fr lg:mt-20 lg:gap-8">
          {CARDS.map((card) => (
            <CardContainer
              key={card.id}
              containerClassName="py-0 h-full w-full"
              className="h-full w-full"
            >
              <CardBody className="group/card relative flex h-full w-full flex-col rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
                <CardItem translateZ={10}>
                  <Eyebrow>{card.audience}</Eyebrow>
                </CardItem>

                <CardItem
                  translateZ={20}
                  className="mt-2 min-h-[48px] text-[18px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--text-primary)]"
                >
                  {card.title}
                </CardItem>

                <CardItem
                  as="p"
                  translateZ={12}
                  className="mt-1 text-[13px] leading-[1.5] text-[var(--text-muted)]"
                >
                  {hints?.[card.id] ?? card.hint}
                </CardItem>

                <CardItem translateZ={30} className="mt-auto w-full pt-5">
                  <card.Visual />
                </CardItem>

                <Link
                  href={card.href}
                  aria-label={`${card.audience} — ${card.title}`}
                  className="absolute inset-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2"
                />
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Visual hook ──────────────────────────────────────────────────────

function useRotatingIndex(length: number, period: number) {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setIdx((i) => (i + 1) % length), period)
    return () => clearInterval(id)
  }, [length, period, reduce])
  return idx
}

// ─── Mini visuals — each carries ambient activity ─────────────────────

// Mini ranked-shortlist console. Row highlight cycles every 2.2s; the
// "48 hr" pill has a live ping.
function CorporatesVisual() {
  const ROWS = [
    { name: "Aarav Rao",    college: "IIT Bombay",  score: 94 },
    { name: "Priya Sharma", college: "BITS Pilani", score: 91 },
    { name: "Vivek Mehta",  college: "NIT Trichy",  score: 88 },
  ]
  const activeIdx = useRotatingIndex(ROWS.length, 2200)
  return (
    <div className="relative h-[192px] w-full overflow-hidden rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-default)] pb-2">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Drive · Analyst 2026
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-primary)]">
            187 applied · ranked
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-primary-600)] px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.04em] text-white">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          48 hr
        </span>
      </div>

      <ul className="mt-2 space-y-1.5">
        {ROWS.map((r, i) => {
          const isLit = i === activeIdx
          return (
            <li
              key={r.name}
              className={cn(
                "grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-sm border px-2 py-1.5 transition-colors duration-300",
                isLit
                  ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)]"
                  : "border-[var(--border-default)] bg-[var(--bg-elevated)]",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold leading-tight text-[var(--text-primary)]">
                  {r.name}
                </p>
                <p className="truncate text-[9px] leading-tight text-[var(--text-muted)]">
                  {r.college}
                </p>
              </div>
              <div className="h-1 w-12 overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
                <div
                  className="h-full rounded-full transition-[background] duration-300"
                  style={{
                    width: `${r.score}%`,
                    background: isLit
                      ? "var(--color-primary-600)"
                      : i === 0
                        ? "var(--color-primary-600)"
                        : "var(--color-primary-300)",
                  }}
                />
              </div>
              <p
                className={cn(
                  "font-mono text-[10px] font-semibold tabular-nums transition-colors",
                  isLit
                    ? "text-[var(--color-primary-700)]"
                    : "text-[var(--text-primary)]",
                )}
              >
                {r.score}
              </p>
            </li>
          )
        })}
      </ul>

      <p className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
        + 184 more in the pool
      </p>
    </div>
  )
}

// Climbing line + endpoint pulse — the placement-rate trend grows in
// from the left when the card enters view.
function InstitutesVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  return (
    <div
      ref={ref}
      className="relative h-[172px] w-full overflow-hidden rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] p-3"
    >
      <div className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-sm bg-[var(--color-brand-orange)] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.04em] text-white">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        78% placed
      </div>
      <svg
        viewBox="0 0 200 100"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0" y1="75" x2="200" y2="75" stroke="var(--border-default)" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="200" y2="50" stroke="var(--border-default)" strokeWidth="0.5" />
        <line x1="0" y1="25" x2="200" y2="25" stroke="var(--border-default)" strokeWidth="0.5" />
        <motion.path
          d="M0,80 C30,72 50,68 80,56 C110,42 140,32 200,20 L200,100 L0,100 Z"
          fill="var(--color-primary-600)"
          fillOpacity="0.12"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView || reduce ? 1 : 0 }}
          transition={{ delay: reduce ? 0 : 0.6, duration: 0.5 }}
        />
        <motion.path
          d="M0,80 C30,72 50,68 80,56 C110,42 140,32 200,20"
          stroke="var(--color-primary-600)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: inView || reduce ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: EASE }}
        />
        <motion.circle
          cx="198" cy="20" r="3.5"
          fill="var(--color-primary-600)"
          animate={reduce ? undefined : { r: [3.5, 5, 3.5], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="198" cy="20" r="6" fill="var(--color-primary-600)" fillOpacity="0.18" />
      </svg>
    </div>
  )
}

// Four practice-area tiles. One tile at a time pulses cobalt on a 1.6s
// rotation, walking the eye through every area.
function ExecutivesVisual() {
  const areas = [
    { code: "IB",    name: "Investment Banking" },
    { code: "PE/VC", name: "Private Equity"     },
    { code: "Wealth", name: "Wealth"            },
    { code: "AMC",   name: "Asset Management"   },
  ]
  const activeIdx = useRotatingIndex(areas.length, 1600)
  return (
    <div className="relative h-[172px] w-full overflow-hidden rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
      <div className="absolute right-2.5 top-2.5 z-10 rounded-sm bg-[var(--color-primary-600)] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.04em] text-white">
        30+ closed
      </div>
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5">
        {areas.map((a, i) => {
          const isLit = i === activeIdx
          return (
            <div
              key={a.code}
              className={cn(
                "flex flex-col justify-center rounded-sm border px-2.5 py-1.5 transition-colors duration-300",
                isLit
                  ? "border-[var(--color-primary-600)] bg-[var(--color-primary-50)]"
                  : "border-[var(--border-default)] bg-[var(--bg-elevated)]",
              )}
            >
              <p
                className={cn(
                  "text-[12px] font-bold leading-tight tracking-tight transition-colors",
                  isLit
                    ? "text-[var(--color-primary-700)]"
                    : "text-[var(--color-primary-600)]",
                )}
              >
                {a.code}
              </p>
              <p className="mt-0.5 text-[9px] leading-tight text-[var(--text-muted)]">
                {a.name}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Course progress bars grow in from 0 on view; the certified row glows
// cobalt to anchor the "earn the certificate" promise.
function StudentsVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const courses = [
    { name: "Finance fundamentals", pct: 100, done: true  },
    { name: "Excel for analysts",   pct: 80,  done: false },
    { name: "Pitchbook & comms",    pct: 55,  done: false },
  ]
  return (
    <div
      ref={ref}
      className="relative h-[172px] w-full overflow-hidden rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] p-3"
    >
      <div className="absolute right-2.5 top-2.5 z-10 rounded-sm bg-[var(--color-primary-600)] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.04em] text-white">
        Career Centre
      </div>
      <div className="mt-7 flex flex-col gap-3">
        {courses.map((c, i) => (
          <div key={c.name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold leading-none text-[var(--text-primary)]">
                {c.name}
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] leading-none",
                  c.done
                    ? "text-[var(--color-primary-600)]"
                    : "text-[var(--text-muted)]",
                )}
              >
                {c.done ? "✓ Certified" : `${c.pct}%`}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: c.done
                    ? "var(--color-primary-600)"
                    : "var(--color-primary-400)",
                }}
                initial={{ width: 0 }}
                animate={{ width: inView || reduce ? `${c.pct}%` : 0 }}
                transition={{
                  duration: reduce ? 0 : 0.9,
                  delay: reduce ? 0 : 0.1 + i * 0.12,
                  ease: EASE,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
