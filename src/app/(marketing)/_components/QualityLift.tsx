"use client"

import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import {
  Clock,
  ShieldCheck,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

const EASE = [0.16, 1, 0.3, 1] as const

// ─── Feature data ────────────────────────────────────────────────────

const QUALITY_DRAWER_PAIRS = [
  {
    left: {
      Icon: Clock,
      title: "48-hr shortlist",
      desc: "Three weeks of manual screening compressed to two days. Ranked, not filtered. The strongest fit surfaces before the first call.",
    },
    right: {
      Icon: ShieldCheck,
      title: "100% audit-ready",
      desc: "Every drive generates a timestamped audit trail tied to the campus TPO who sourced each student. Legal never needs a follow-up email.",
    },
    center: "comparison" as const,
  },
  {
    left: {
      Icon: TrendingUp,
      title: "2.4× recruiter output",
      desc: "Same team, twice the offers placed. The platform handles the volume so your recruiters close the decisions, not the inbox.",
    },
    right: {
      Icon: Star,
      title: "Tier-blind ranking",
      desc: "Candidates are ranked on demonstrated capability, not college prestige. A Tier-3 engineer can out-score every IIT résumé on file.",
    },
    center: "shortlist" as const,
  },
] as const

// ─── Sub-components ───────────────────────────────────────────────────

function QualityFeatureCard({
  Icon,
  title,
  desc,
}: {
  Icon: LucideIcon
  title: string
  desc: string
}) {
  return (
    <div className="rounded-md border border-white/[0.07] bg-white/[0.03] p-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-white/[0.05]">
        <Icon size={18} className="text-white/55" />
      </div>
      <p className="text-[15px] font-semibold leading-snug text-white">{title}</p>
      <p className="mt-2 text-sm leading-[1.6] text-white/40">{desc}</p>
    </div>
  )
}

const COMPARISON_ROWS = [
  { label: "Time to shortlist", without: "3 wks", with: "48 hr" },
  { label: "Offers per recruiter", without: "1×", with: "2.4×" },
  { label: "Audit-ready drives", without: "0%", with: "100%" },
]

function ComparisonPanel() {
  return (
    <div className="p-5">
      <div className="mb-5 grid grid-cols-[1fr_auto_auto] items-end gap-x-4 gap-y-1">
        <div />
        <p className="text-right font-mono text-[9px] uppercase tracking-widest text-white/25">
          Before
        </p>
        <p className="text-right font-mono text-[9px] uppercase tracking-widest text-[var(--color-primary-400)]">
          With PL
        </p>

        {COMPARISON_ROWS.map((r) => (
          <div key={r.label} className="contents">
            <p className="py-2 text-[11px] text-white/40">{r.label}</p>
            <p className="py-2 text-right text-[18px] font-bold tabular-nums text-white/25">
              {r.without}
            </p>
            <p className="py-2 text-right text-[18px] font-bold tabular-nums text-[var(--color-primary-400)]">
              {r.with}
            </p>
            <div className="col-span-3 h-px bg-white/[0.05]" />
          </div>
        ))}
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          className="h-full rounded-full bg-[var(--color-primary-600)]"
          initial={{ width: "0%" }}
          animate={{ width: "72%" }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        />
      </div>
      <p className="mt-1.5 text-right font-mono text-[9px] text-white/25">
        quality lift · 72%
      </p>
    </div>
  )
}

const SHORTLIST_ROWS = [
  { name: "Priya Sharma", college: "IIT Bombay", score: 94 },
  { name: "Arjun Mehta", college: "NIT Surathkal", score: 91 },
  { name: "Rahul Kumar", college: "VIT Vellore", score: 87 },
]

function ShortlistPanel() {
  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
          Top matches
        </span>
        <span className="font-mono text-[10px] text-white/30">3 of 247</span>
      </div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-sm bg-[var(--color-primary-600)] py-1.5 text-[11px] font-semibold text-white"
        >
          Shortlist all
        </button>
        <button
          type="button"
          className="flex-1 rounded-sm border border-white/[0.10] py-1.5 text-[11px] font-medium text-white/45"
        >
          Review
        </button>
      </div>
      <div className="space-y-1.5">
        {SHORTLIST_ROWS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: EASE }}
            className="flex items-center gap-3 rounded-sm bg-white/[0.04] px-3 py-2"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-sm bg-[var(--color-primary-600)]/20 font-mono text-[10px] font-semibold text-[var(--color-primary-400)]">
              #{i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-white/75">
                {c.name}
              </p>
              <p className="truncate text-[9px] text-white/30">{c.college}</p>
            </div>
            <p className="text-[12px] font-bold tabular-nums text-[var(--color-primary-400)]">
              {c.score}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Drawer row (CaseStudies sticky+scale mechanic) ───────────────────

interface DrawerRowProps {
  pair: (typeof QUALITY_DRAWER_PAIRS)[number]
  index: number
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

function QualityDrawerRow({
  pair,
  index,
  progress,
  range,
  targetScale,
}: DrawerRowProps) {
  const scale = useTransform(progress, range, [1, targetScale])
  return (
    <div
      className="sticky"
      style={{ top: `${112 + index * 24}px`, zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, transformOrigin: "top center" }}
        className="grid gap-5 lg:grid-cols-[1fr_260px_1fr] lg:gap-8"
      >
        <QualityFeatureCard {...pair.left} />

        <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-md border border-white/[0.09] bg-[rgba(14,14,14,0.85)] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.55)]">
          {pair.center === "comparison" ? (
            <ComparisonPanel />
          ) : (
            <ShortlistPanel />
          )}
        </div>

        <QualityFeatureCard {...pair.right} />
      </motion.div>
    </div>
  )
}

// ─── Public export ────────────────────────────────────────────────────

interface QualityLiftProps {
  headingPrefix?: string
  headingAccent?: string
  subhead?: React.ReactNode
}

export function QualityLift({
  headingPrefix = "Our systems that power ",
  headingAccent = "the ecosystem.",
  subhead = (
    <>
      Cleaner pools. Faster shortlists. An audit trail legal will sign,
      without adding to the recruiter roster.
    </>
  ),
}: QualityLiftProps = {}) {
  useReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const total = QUALITY_DRAWER_PAIRS.length

  return (
    <section
      id="quality"
      data-section-bg="dark"
      aria-labelledby="quality-heading"
      className="border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      <div className="mx-auto max-w-6xl px-8 py-20 lg:px-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <h2
            id="quality-heading"
            className="text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-white"
          >
            {headingPrefix}
            <span className="text-[var(--color-primary-400)]">
              {headingAccent}
            </span>
          </h2>
          <p className="mt-5 text-base leading-[1.55] text-white/50 lg:text-[17px]">
            {subhead}
          </p>
        </motion.div>

        <div ref={containerRef} className="mt-16 space-y-6 pb-6">
          {QUALITY_DRAWER_PAIRS.map((pair, i) => {
            const targetScale = 1 - (total - 1 - i) * 0.04
            const range: [number, number] = [i / total, 1]
            return (
              <QualityDrawerRow
                key={i}
                pair={pair}
                index={i}
                progress={scrollYProgress}
                range={range}
                targetScale={targetScale}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
