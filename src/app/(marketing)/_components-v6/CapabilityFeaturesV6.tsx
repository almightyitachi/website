"use client"

// Section 5 — Capability Features V6
// Same 2-column layout as CaseStudiesV6:
//   Left  — feature icon + eyebrow · two KPI stats · arrow buttons + dot nav
//   Right — feature card (title + description + learn more)
// Auto-advances every INTERVAL_MS. Arrow buttons and dot nav allow manual navigation.

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Constants ───────────────────────────────────────────────────────────────

const INTERVAL_MS = 5000

// ─── Types ───────────────────────────────────────────────────────────────────

interface Feature {
  id: string
  eyebrow: string
  icon: LucideIcon
  iconColor: string
  title: string
  description: string
  href: string
  stats: { value: string; label: string }[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    id: "corporates",
    eyebrow: "For Corporates",
    icon: Building2,
    iconColor: "var(--color-primary-600)",
    title: "Cohorts ranked before Friday.",
    description:
      "Set your filters; a curated shortlist fills up from the network. Proctored scores and percentile ranks in your dashboard, EEO-compliant by default.",
    href: "/corporates",
    stats: [
      { value: "2.4×", label: "Recruiter-to-offer ratio lift" },
      { value: "48 hr", label: "JD to ranked shortlist" },
    ],
  },
  {
    id: "tpos",
    eyebrow: "For Institutes & NGOs",
    icon: GraduationCap,
    iconColor: "var(--color-brand-orange)",
    title: "Open doors for every student.",
    description:
      "Onboard your batch once, accept drive invitations, track placement-rate lift live. Tier-blind, and built for accredited institutions.",
    href: "/institutes",
    stats: [
      { value: "540+", label: "Partner colleges across India" },
      { value: "78%", label: "Placement rate on average" },
    ],
  },
  {
    id: "executive-search",
    eyebrow: "Executive Search",
    icon: Briefcase,
    iconColor: "var(--color-brand-navy)",
    title: "Founder-led financial-services search.",
    description:
      "Four practice areas across IB, PE/VC, Wealth, and AMC. Every search runs through a co-founder with a 360° lens on acumen, alignment, values, and domain.",
    href: "/executive-search",
    stats: [
      { value: "30+", label: "Senior mandates closed across IB, PE/VC, Wealth" },
      { value: "4", label: "Practice areas, CXO to early-career" },
    ],
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function CapabilityFeaturesV6() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [timerKey, setTimerKey] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % FEATURES.length)
      setTimerKey((k) => k + 1)
    }, INTERVAL_MS)
  }, [])

  const navigate = useCallback(
    (index: number) => {
      setActiveIndex(index)
      setTimerKey((k) => k + 1)
      startTimer()
    },
    [startTimer],
  )

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + FEATURES.length) % FEATURES.length)
    setTimerKey((k) => k + 1)
    startTimer()
  }, [startTimer])

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % FEATURES.length)
    setTimerKey((k) => k + 1)
    startTimer()
  }, [startTimer])

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimer])

  const active = FEATURES[activeIndex]
  const Icon = active.icon

  return (
    <section
      id="capabilities"
      data-section-bg="light"
      aria-labelledby="cap-v6-heading"
      className="border-t border-[var(--border-default)]"
    >
      {/* ── Bordered column rail ─────────────────────────────────── */}
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)]">

        {/* ── 1. Heading ─────────────────────────────────────────── */}
        <div className="px-8 pt-20 lg:px-12 lg:pt-24">
          <h2
            id="cap-v6-heading"
            className="text-[clamp(32px,4.2vw,48px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]"
          >
            One platform, every stakeholder.
          </h2>
        </div>

        {/* ── 2. 2-column feature viewer ─────────────────────────── */}
        <div className="px-8 pb-20 pt-12 lg:px-12 lg:pb-24">
          <div className="grid h-[520px] grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">

            {/* Left — icon + eyebrow + stats + navigation */}
            <div className="flex flex-col justify-between py-2">

              {/* Top: icon badge + eyebrow */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-icon"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="flex size-10 flex-shrink-0 items-center justify-center rounded-sm"
                    style={{
                      background: active.iconColor + "1A",
                      color: active.iconColor,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                      {active.eyebrow}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Middle: two KPI stats */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-stats"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {active.stats.map((s) => (
                    <div key={s.label}>
                      <p
                        className="text-[clamp(40px,4.5vw,56px)] font-bold tabular-nums leading-none tracking-[-0.04em]"
                        style={{ color: active.iconColor }}
                      >
                        {s.value}
                      </p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Bottom: arrow buttons + dot-progress nav */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous feature"
                  className="inline-flex size-8 items-center justify-center rounded-sm border border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next feature"
                  className="inline-flex size-8 items-center justify-center rounded-sm border border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  <ChevronRight size={16} />
                </button>

                <div className="ml-1 flex items-center gap-2">
                  {FEATURES.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => navigate(i)}
                      aria-label={`Go to ${f.eyebrow}`}
                      className={cn(
                        "relative h-[3px] flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-neutral-200)] transition-all duration-300",
                        i === activeIndex
                          ? "w-10"
                          : "w-3 hover:bg-[var(--color-neutral-300)]",
                      )}
                    >
                      {i === activeIndex && (
                        <motion.span
                          key={timerKey}
                          className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-primary-600)]"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: INTERVAL_MS / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — feature card */}
            <div className="relative overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id + "-card"}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 flex flex-col p-8 lg:p-10"
                >
                  {/* Category tag */}
                  <div
                    className="inline-flex items-center gap-1.5 self-start rounded-sm px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: active.iconColor,
                      background: active.iconColor + "18",
                    }}
                  >
                    <Icon size={12} />
                    {active.eyebrow}
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--text-primary)]">
                    {active.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 flex-1 text-[clamp(16px,1.6vw,18px)] leading-[1.75] text-[var(--text-body)]">
                    {active.description}
                  </p>

                  {/* Learn more */}
                  <Link
                    href={active.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-brand)] underline-offset-4 hover:underline"
                  >
                    Learn more
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>{/* end bordered column */}
    </section>
  )
}
