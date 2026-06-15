"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  Briefcase,
  Gem,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

import { CountUpStat } from "./CountUpStat"
import { SectionHeading } from "./SectionHeading"

const EASE = [0.16, 1, 0.3, 1] as const

// ─── Data ─────────────────────────────────────────────────────────────

interface StageCard {
  Icon: LucideIcon
  title: string
  description: string
}

const STAGE_CARDS: StageCard[] = [
  {
    Icon: GraduationCap,
    title: "Campus",
    description:
      "2M+ assessed students. 540+ colleges. Shortlists delivered in 48 hours.",
  },
  {
    Icon: Briefcase,
    title: "Mid-Career",
    description:
      "AI assessments and interviews that surface fit, not just availability.",
  },
  {
    Icon: Gem,
    title: "Executive Search",
    description:
      "Senior hires that move your company forward. We search until the role is closed.",
  },
]

interface StatCard {
  value: string
  label: string
}

const STATS: StatCard[] = [
  { value: "2.4M+", label: "Candidates onboarded" },
  { value: "800+", label: "Corporate partners hiring with us" },
  { value: "1,200+", label: "Institutes & NGOs connected" },
  { value: "62%", label: "Faster time to offer (avg.)" },
]

// ─── Public export ─────────────────────────────────────────────────────

interface EveryStageOfHireProps {
  /** Section anchor id — defaults to "v3-altitudes" so the V6 Section 2
   *  deep link resolves here whichever variant is showing. */
  id?: string
}

export function EveryStageOfHire({
  id = "v3-altitudes",
}: EveryStageOfHireProps = {}) {
  const reduce = useReducedMotion()

  return (
    <section
      id={id}
      data-section-bg="light"
      // z-10 so the section covers the sticky V4 hero as it scrolls up,
      // matching V3AltitudesV6's stacking. Pure-white canvas — the grid
      // texture and card borders carry the visual interest.
      className="relative z-10 overflow-hidden border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      {/* Faint cobalt grid texture from the Figma reference. Anchored to
          the top centre at its native 1440px width so the diagonal hatch
          motifs land at the outer edges; crops symmetrically on narrower
          viewports. Masked to fade into the surface near the bottom. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 flex justify-center [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
      >
        <div
          className="h-[890px] w-[1440px] shrink-0 bg-top bg-no-repeat opacity-70"
          style={{ backgroundImage: "url(/images/bg-grid.svg)" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        {/* Title */}
        <SectionHeading
          pre="One platform."
          hook="Every stage"
          post="of hire"
          className="mb-16 lg:mb-20"
        />

        {/* Stage cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {STAGE_CARDS.map((card, i) => (
            <motion.article
              key={card.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: EASE }}
              className="rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-7 shadow-sm lg:p-8"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[var(--bg-brand-subtle)]">
                <card.Icon
                  size={24}
                  strokeWidth={1.75}
                  className="text-[var(--text-brand)]"
                />
              </div>
              <h3 className="mt-9 text-[var(--text-md)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--text-primary)]">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.55] text-[var(--text-muted)]">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Stats row */}
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
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
