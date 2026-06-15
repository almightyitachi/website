"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Check,
  Download,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import type { StepKey } from "./IndiaTalentMap"

// Shared right-rail mockup used by both HowItWorks (default) and
// HowItWorksAi. Each `StepKey` maps to a different scene:
//   1 — Pan-India network: candidates + colleges stat band, then a
//       stagger-in list of named candidates with their city chip.
//   2 — Pre-vetted pool filter: typed filter chips, a scan progress bar
//       that fills, a live count that decrements, and the top matches.
//   3 — Ranked rows: per-row bar grow-in, top row carries a rationale.
//   4 — Audit ledger: signed events stream in, then an Export pill.
//
// `compact` is used inside the mobile-only accordion content panel; the
// non-compact variant is the sticky desktop rail.

const EASE = [0.16, 1, 0.3, 1] as const

const CAPTIONS: Record<StepKey, { eyebrow: string; caption: string }> = {
  1: { eyebrow: "Network · live",    caption: "Candidates from every corner of India" },
  2: { eyebrow: "Pool · filter",     caption: "Filter by JD, the best surface instantly" },
  3: { eyebrow: "Drive · ranked",    caption: "Every rank ships with the why" },
  4: { eyebrow: "Drive · audit log", caption: "Timestamped, signed, exportable" },
}

interface StepMockupRailProps {
  step: StepKey
  compact?: boolean
}

export function StepMockupRail({ step, compact = false }: StepMockupRailProps) {
  const { eyebrow, caption } = CAPTIONS[step]
  return (
    <div
      className={
        "rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] " +
        (compact ? "p-3 shadow-sm" : "p-5 shadow-md")
      }
    >
      <div className="mb-3 flex items-center justify-between border-b border-[var(--border-default)] pb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {eyebrow}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
          <Sparkles size={10} className="text-[var(--color-primary-600)]" />
          Live
        </span>
      </div>

      <div className={compact ? "min-h-[240px]" : "min-h-[320px]"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === 1 && <NetworkMockup />}
            {step === 2 && <FilterMockup />}
            {step === 3 && <RankedMockup />}
            {step === 4 && <AuditMockup />}
          </motion.div>
        </AnimatePresence>
      </div>

      {!compact && (
        <p className="mt-4 border-t border-[var(--border-default)] pt-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {caption}
        </p>
      )}
    </div>
  )
}

// ─── 1 · Pan-India network ────────────────────────────────────────────

const NETWORK_CANDIDATES = [
  { initials: "AR", name: "A. Rao",    city: "Mumbai",    college: "IIT-B"     },
  { initials: "PS", name: "P. Sharma", city: "Delhi",     college: "DTU"       },
  { initials: "VM", name: "V. Mehta",  city: "Bangalore", college: "NITK"      },
  { initials: "SI", name: "S. Iyer",   city: "Chennai",   college: "IIT-M"     },
  { initials: "KS", name: "K. Singh",  city: "Patna",     college: "NIT-Patna" },
]

function NetworkMockup() {
  const reduce = useReducedMotion()
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between rounded-sm bg-[var(--color-primary-50)] px-3 py-2">
        <div>
          <p className="font-bold tabular-nums text-[20px] leading-none text-[var(--color-primary-900)]">
            <CountUp end={40287} delay={0.1} />
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
            Candidates · Live
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold tabular-nums text-[14px] leading-none text-[var(--color-primary-900)]">
            <CountUp end={540} delay={0.25} />+
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-primary-700)]">
            Colleges
          </p>
        </div>
      </div>

      <motion.ul
        className="space-y-1.5"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : 0.12,
              delayChildren: 0.35,
            },
          },
        }}
      >
        {NETWORK_CANDIDATES.map((c) => (
          <motion.li
            key={c.name}
            className="flex items-center gap-2.5 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 py-1.5"
            variants={{
              hidden: { opacity: 0, x: -14 },
              show:   { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
            }}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--bg-elevated)] font-mono text-[10px] font-semibold text-[var(--text-primary)]">
              {c.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold leading-tight text-[var(--text-primary)]">
                {c.name}
              </p>
              <p className="mt-0.5 truncate font-mono text-[10px] leading-tight text-[var(--text-muted)]">
                {c.college}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[var(--text-muted)]">
              <MapPin size={9} className="text-[var(--color-primary-600)]" />
              {c.city}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

// ─── 2 · Pre-vetted pool, filter running ──────────────────────────────

const FILTER_CHIPS = ["JD: Analyst", "SQL", "Excel", "2026 cohort"]
const FILTER_RESULTS = [
  { name: "A. Rao",    score: 94 },
  { name: "P. Sharma", score: 91 },
  { name: "V. Mehta",  score: 88 },
]

function FilterMockup() {
  const reduce = useReducedMotion()
  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] p-2.5">
        <div className="mb-2 flex items-center gap-1.5">
          <Search size={11} className="text-[var(--color-primary-600)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Filters · role and skills
          </span>
        </div>
        <motion.div
          className="flex flex-wrap gap-1.5"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
          }}
        >
          {FILTER_CHIPS.map((chip) => (
            <motion.span
              key={chip}
              className="inline-flex items-center rounded-sm bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-primary)]"
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                show:   { opacity: 1, scale: 1, transition: { duration: 0.25 } },
              }}
            >
              {chip}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
          <span>Searching 40,287 candidates…</span>
          <MatchCount delay={reduce ? 0 : 0.7} />
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-primary-600)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: reduce ? 0 : 0.7, duration: 1.1, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.div
        className="space-y-1.5"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : 0.12,
              delayChildren: 1.95,
            },
          },
        }}
      >
        <motion.p
          className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-primary-700)]"
          variants={{
            hidden: { opacity: 0 },
            show:   { opacity: 1, transition: { duration: 0.25 } },
          }}
        >
          Top matches · 12 surfaced
        </motion.p>
        {FILTER_RESULTS.map((r) => (
          <motion.div
            key={r.name}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 py-1.5"
            variants={{
              hidden: { opacity: 0, y: 8 },
              show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
            }}
          >
            <p className="text-[12px] font-semibold leading-tight text-[var(--text-primary)]">
              {r.name}
            </p>
            <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--color-primary-50)] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[var(--color-primary-700)]">
              <Check size={9} strokeWidth={3} />
              Match
            </span>
            <p className="font-mono text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
              {r.score}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function MatchCount({ delay }: { delay: number }) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? 12 : 40287)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let startTs = 0
    const duration = 1100
    const delayMs = delay * 1000
    const from = 40287
    const to = 12

    const tick = (t: number) => {
      if (!startTs) startTs = t
      const elapsed = t - startTs - delayMs
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [delay, reduce])

  return (
    <span className="tabular-nums text-[var(--color-primary-700)]">
      → {value.toLocaleString()} matched
    </span>
  )
}

// ─── 3 · Ranked rows with rationale ───────────────────────────────────

const RANKED_ROWS = [
  { name: "A. Rao",    score: 94, top: true  },
  { name: "P. Sharma", score: 91, top: false },
  { name: "V. Mehta",  score: 88, top: false },
  { name: "S. Iyer",   score: 84, top: false },
]

function RankedMockup() {
  const reduce = useReducedMotion()
  return (
    <motion.ul
      className="space-y-2.5"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.14 } },
      }}
    >
      {RANKED_ROWS.map((r, i) => (
        <motion.li
          key={r.name}
          className="rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
          }}
        >
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
            <p className="text-[12px] font-semibold leading-tight text-[var(--text-primary)]">
              {r.name}
            </p>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    i === 0
                      ? "var(--color-primary-600)"
                      : "var(--color-primary-400)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${r.score}%` }}
                transition={{
                  delay: reduce ? 0 : 0.2 + i * 0.14,
                  duration: 0.8,
                  ease: EASE,
                }}
              />
            </div>
            <p className="font-mono text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
              {r.score}
            </p>
          </div>
          {r.top && (
            <motion.div
              className="mt-1.5 flex items-center gap-1.5 rounded-sm bg-[var(--color-primary-50)] px-2 py-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : 1.0, duration: 0.35 }}
            >
              <Sparkles size={10} className="text-[var(--color-primary-700)]" />
              <span className="text-[11px] leading-tight text-[var(--color-primary-900)]">
                Top-decile SQL and a clean integrity trail drove the rank.
              </span>
            </motion.div>
          )}
        </motion.li>
      ))}
    </motion.ul>
  )
}

// ─── 4 · Audit ledger ─────────────────────────────────────────────────

const AUDIT_EVENTS = [
  { time: "14:02:11", code: "ASSESSMENT_START", sig: "sig:0xa4" },
  { time: "14:21:48", code: "PROCTOR_FLAG",     sig: "sig:0xb1" },
  { time: "14:42:03", code: "RESPONSE_SCORED",  sig: "sig:0xc7" },
  { time: "14:43:11", code: "RANKED",           sig: "sig:0xd2" },
  { time: "14:43:12", code: "SHORTLIST_SIGNED", sig: "sig:0xe9" },
]

function AuditMockup() {
  const reduce = useReducedMotion()
  return (
    <div className="space-y-3">
      <motion.ul
        className="space-y-1"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
        }}
      >
        {AUDIT_EVENTS.map((e) => (
          <motion.li
            key={e.time}
            className="flex items-center justify-between rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 py-1.5"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tabular-nums text-[var(--text-muted)]">
                {e.time}
              </span>
              <span className="rounded-sm bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.04em] text-[var(--text-primary)]">
                {e.code}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[var(--color-primary-700)]">
              <ShieldCheck size={10} className="text-[var(--color-primary-600)]" />
              {e.sig}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.button
        type="button"
        tabIndex={-1}
        aria-hidden
        className="flex w-full items-center justify-between rounded-sm border border-[var(--border-default)] bg-[var(--color-primary-50)] px-3 py-2 text-left transition-colors"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.9, duration: 0.35 }}
      >
        <div className="flex items-center gap-2">
          <Download size={12} className="text-[var(--color-primary-700)]" />
          <span className="text-[12px] font-semibold text-[var(--color-primary-900)]">
            Export audit log
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-primary-700)]">
          CSV · PDF
        </span>
      </motion.button>
    </div>
  )
}

// ─── CountUp — shared RAF tween ───────────────────────────────────────

function CountUp({ end, delay = 0 }: { end: number; delay?: number }) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? end : 0)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let startTs = 0
    const duration = 1000
    const delayMs = delay * 1000

    const tick = (t: number) => {
      if (!startTs) startTs = t
      const elapsed = t - startTs - delayMs
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, delay, reduce])

  return <>{value.toLocaleString()}</>
}
