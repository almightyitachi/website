"use client"

import { motion, useReducedMotion } from "framer-motion"

import { SectionHeading } from "./SectionHeading"

// Landing velocity band — a single measured ruler from JD intake to a delivered
// ranked shortlist. The motif (one continuous tick rule, milestone nodes,
// numbered chips) reads as a precise, audit-grade instrument: speed without
// losing rigour. The rule draws left-to-right once on scroll, then each step
// title rises into place behind a mask. All motion collapses to a static state
// under reduced motion.

const EASE = [0.16, 1, 0.3, 1] as const

interface TimelineStep {
  marker: string
  title: string
  body: string
}

const STEPS: TimelineStep[] = [
  {
    marker: "Day 0",
    title: "Role in",
    body: "You send the JD. We map it to the assessment standard and open the drive.",
  },
  {
    marker: "In flight",
    title: "Proctored at scale",
    body: "Candidates are assessed on their own devices, proctored, and scored on one standard.",
  },
  {
    marker: "48 hours",
    title: "Ranked shortlist",
    body: "A ranked, audit-ready shortlist lands, every name traceable to the institution that sourced it.",
  },
]

// One continuous ruler across the full width: a hairline with evenly spaced
// ticks (every 5th taller) and cobalt milestone nodes aligned to the three
// step columns. Clipped left-to-right on view so the scale appears to fill.
function ConnectedRule({ reduce }: { reduce: boolean | null }) {
  const TICKS = 61
  return (
    <div className="relative mb-9">
      <motion.div
        aria-hidden
        className="relative h-3.5 overflow-hidden"
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
      >
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--border-strong)]" />
        <div className="absolute inset-0 flex items-center justify-between">
          {Array.from({ length: TICKS }).map((_, i) => (
            <span
              key={i}
              className="w-px bg-[var(--border-default)]"
              style={{ height: i % 5 === 0 ? 13 : 6 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Milestone nodes, aligned to the step columns below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:grid sm:grid-cols-3 sm:gap-x-10"
      >
        {STEPS.map((s, i) => (
          <span key={s.title} className="flex items-center">
            <motion.span
              className="size-2.5 rounded-full ring-4 ring-[var(--bg-page)]"
              style={{ backgroundColor: "var(--color-primary-600)" }}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.4, delay: 0.3 + i * 0.32, ease: EASE }
              }
            />
          </span>
        ))}
      </div>
    </div>
  )
}

// Step title that rises into place behind a mask (transform-only reveal).
function RevealTitle({
  children,
  delay,
  reduce,
}: {
  children: string
  delay: number
  reduce: boolean | null
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block text-[clamp(20px,2.1vw,26px)] font-semibold tracking-[-0.02em] text-[var(--text-primary)]"
        initial={reduce ? false : { y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function GoLiveTimeline({ id = "go-live" }: { id?: string } = {}) {
  const reduce = useReducedMotion()

  return (
    <section
      id={id}
      data-section-bg="light"
      className="relative border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <SectionHeading
          pre="From JD to a ranked shortlist,"
          hook="in 48 hours."
          className="mb-4"
        />
        <p className="mb-14 max-w-xl text-[15px] leading-[1.6] text-[var(--text-muted)] lg:mb-16 lg:text-[17px]">
          A proctored, scored, ranked shortlist in days, at the same scale on
          every drive.
        </p>

        <ConnectedRule reduce={reduce} />

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.32, ease: EASE }}
            >
              {/* Numbered chip + relative-time marker */}
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-sm bg-[var(--bg-surface)] px-2 font-mono text-[15px] font-semibold tabular-nums text-[var(--text-primary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {step.marker}
                </span>
              </div>

              <div className="mt-5">
                <RevealTitle delay={0.4 + i * 0.32} reduce={reduce}>
                  {step.title}
                </RevealTitle>
              </div>
              <p className="mt-2 max-w-[34ch] text-[14px] leading-[1.6] text-[var(--text-muted)]">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
