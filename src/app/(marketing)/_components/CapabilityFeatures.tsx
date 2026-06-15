"use client"

// Section 5 — Capability features. Three alternating dark/light bands,
// one per audience slice (Executive Search → Corporates → Institutes &
// NGOs). Each band carries the same anatomy: a product mockup on one
// side, an eyebrow + title + description + stats + Learn-more CTA on
// the other. The dark/light variant follows the hero so the section
// blends with the entry mood.
//
// Each mockup carries a subtle ambient activity loop — a row-highlight
// cycle, a live ping, or a fill bar — plus pointer-hover affordances
// inside the mockup so it reads as a live product surface rather than a
// frozen screenshot.

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// Shared hook — cycles a 0..length-1 index every `period` ms unless
// the user prefers reduced motion (in which case the index stays at 0).
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

interface FeatureSection {
  id: string
  href: string
  eyebrow: string
  icon: LucideIcon
  title: string
  description: string
  stats: { value: string; label: string }[]
  accent: string
  accentDark?: string
  Visual: React.ComponentType
}

const FEATURES: FeatureSection[] = [
  {
    id: "executive-search",
    href: "/executive-search",
    eyebrow: "Executive Search",
    icon: Briefcase,
    title: "Founder-led financial-services search.",
    description:
      "Four practice areas across IB, PE/VC, Wealth, and AMC. Every search runs through a co-founder with a 360° lens on acumen, alignment, values, and domain.",
    stats: [
      { value: "30+", label: "Senior mandates closed across IB · PE/VC · Wealth" },
      { value: "4",   label: "Practice areas, CXO to early-career" },
    ],
    accent: "var(--color-brand-navy)",
    accentDark: "var(--color-primary-300)",
    Visual: ExecutiveSearchMockup,
  },
  {
    id: "corporates",
    href: "/corporates",
    eyebrow: "For Corporates",
    icon: Building2,
    title: "Cohorts ranked before Friday.",
    description:
      "Set your filters; a curated shortlist fills up from the network. Proctored scores and percentile ranks in your dashboard, EEO-compliant by default.",
    stats: [
      { value: "2.4×",  label: "Recruiter-to-offer ratio lift" },
      { value: "48 hr", label: "JD to ranked shortlist" },
    ],
    accent: "var(--color-primary-600)",
    accentDark: "var(--color-primary-300)",
    Visual: CorporateShortlistMockup,
  },
  {
    id: "tpos",
    href: "/institutes",
    eyebrow: "For Institutes & NGOs",
    icon: GraduationCap,
    title: "Open doors for every student.",
    description:
      "Onboard your batch once, accept drive invitations, track placement-rate lift live. Tier-blind, and built for accredited institutions.",
    stats: [
      { value: "540+", label: "Partner colleges across India" },
      { value: "78%",  label: "Placement rate on average" },
    ],
    accent: "var(--color-brand-orange)",
    Visual: TpoInvitationsMockup,
  },
]

interface FeatureCopyOverride {
  /** Replace the band's title (text only). */
  title?: string
  /** Replace the band's description (text only). */
  description?: string
}

interface CapabilityFeaturesProps {
  heroIsDark: boolean
  /** Optional per-id copy override keyed by feature id
   *  (`executive-search` / `corporates` / `tpos`). When omitted, the
   *  default current marketing copy renders. The AI-narrative variant
   *  passes alternative title + description per band. */
  copyOverrides?: Partial<Record<string, FeatureCopyOverride>>
}

export function CapabilityFeatures({
  heroIsDark,
  copyOverrides,
}: CapabilityFeaturesProps) {
  return (
    <>
      {FEATURES.map((f, idx) => {
        const override = copyOverrides?.[f.id]
        const bandTitle = override?.title ?? f.title
        const bandDescription = override?.description ?? f.description
        const reversed = idx % 2 === 1
        const Icon = f.icon
        const Visual = f.Visual
        const featureAccent = heroIsDark ? (f.accentDark ?? f.accent) : f.accent
        return (
          <section
            key={f.id}
            id={f.id}
            data-section-bg={heroIsDark ? "dark" : "light"}
            className={cn(
              "border-t py-28 lg:py-36 transition-colors duration-300",
              heroIsDark
                ? "border-white/[0.08] bg-[var(--bg-brand)]"
                : "border-[var(--border-default)] bg-[var(--bg-page)]",
            )}
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div className={cn(reversed ? "lg:order-2" : "lg:order-1")}>
                  <Visual />
                </div>
                <div
                  className={cn(
                    reversed ? "lg:order-1 lg:pr-4" : "lg:order-2 lg:pl-4",
                  )}
                >
                  <div
                    className="flex items-center gap-2"
                    style={{ color: featureAccent }}
                  >
                    <Icon size={16} />
                    <p className="text-sm font-semibold tracking-tight">
                      {f.eyebrow}
                    </p>
                  </div>

                  <h2
                    className={cn(
                      "mt-2 text-[clamp(30px,3.6vw,44px)] font-bold leading-[1.1] tracking-[-0.025em] transition-colors",
                      heroIsDark ? "text-white" : "text-[var(--text-primary)]",
                    )}
                  >
                    {bandTitle}
                  </h2>

                  <p
                    className={cn(
                      "mt-6 max-w-[52ch] text-base leading-[1.6] transition-colors lg:text-[17px]",
                      heroIsDark ? "text-white/75" : "text-[var(--text-body)]",
                    )}
                  >
                    {bandDescription}
                  </p>

                  <div
                    className={cn(
                      "mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t pt-8 transition-colors",
                      heroIsDark
                        ? "border-white/[0.08]"
                        : "border-[var(--border-default)]",
                    )}
                  >
                    {f.stats.map((s) => (
                      <div key={s.label}>
                        <p
                          className="text-[clamp(28px,3vw,40px)] font-bold leading-none tracking-[-0.02em] tabular-nums"
                          style={{ color: featureAccent }}
                        >
                          {s.value}
                        </p>
                        <p
                          className={cn(
                            "mt-2 text-sm leading-snug transition-colors",
                            heroIsDark
                              ? "text-white/55"
                              : "text-[var(--text-muted)]",
                          )}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Link
                      href={f.href}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 transition-colors hover:underline",
                        heroIsDark
                          ? "text-[var(--color-primary-300)]"
                          : "text-[var(--color-primary-600)]",
                      )}
                    >
                      Learn more
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

// ─── Mockups ────────────────────────────────────────────────────────────
// Each mockup is a small product surface that reads like the audience's
// actual workspace. White card, neutral border, light shadow — so they
// pop against the dark band when the hero is dark.

export function ExecutiveSearchMockup() {
  const MANDATES = [
    {
      initials: "VK", name: "Vikram Kapoor",  role: "Director, IB",
      firm: "Bulge-bracket IB", stage: "Closed",
      stageColor: "var(--color-success)", stageBg: "var(--color-success-bg)",
    },
    {
      initials: "SR", name: "Sneha Ramanathan", role: "MD, PE/VC",
      firm: "Mid-market PE fund", stage: "Offer",
      stageColor: "var(--color-primary-600)", stageBg: "var(--color-primary-50)",
    },
    {
      initials: "AB", name: "Aditya Banerjee", role: "VP, Wealth",
      firm: "Pvt-bank wealth desk", stage: "Interview",
      stageColor: "var(--color-warning)", stageBg: "var(--color-warning-bg)",
    },
    {
      initials: "RP", name: "Riya Pathak", role: "Principal, AMC",
      firm: "Boutique AMC", stage: "Sourcing",
      stageColor: "var(--text-muted)", stageBg: "var(--color-neutral-100)",
    },
  ]
  const activeIdx = useRotatingIndex(MANDATES.length, 2400)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  return (
    <div className="relative rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <div>
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            </span>
            Mandate board
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
            4 active · 30+ closed YTD
          </p>
        </div>
        <span className="rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
          IB · PE/VC · Wealth · AMC
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {MANDATES.map((m, i) => {
          const isLit = hoverIdx === i || (hoverIdx === null && activeIdx === i)
          return (
            <li
              key={m.initials}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-sm border px-3 py-2.5 transition-colors duration-300",
                isLit
                  ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)]"
                  : "border-[var(--border-default)] bg-[var(--bg-surface)]",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-sm bg-[var(--color-primary-50)] font-mono text-[11px] font-bold text-[var(--color-primary-600)]"
                >
                  {m.initials}
                </span>
                <div>
                  <p className="text-[13px] font-semibold leading-tight text-[var(--text-primary)]">
                    {m.name}
                  </p>
                  <p className="text-[11px] leading-tight text-[var(--text-muted)]">
                    {m.role} · {m.firm}
                  </p>
                </div>
              </div>
              <span
                className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold"
                style={{ color: m.stageColor, background: m.stageBg }}
              >
                {m.stage}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function CorporateShortlistMockup() {
  const CANDIDATES = [
    { name: "Aarav Rao",     college: "IIT Bombay",     score: 94, band: "Top 1%"  },
    { name: "Priya Sharma",  college: "BITS Pilani",    score: 91, band: "Top 5%"  },
    { name: "Vivek Mehta",   college: "NIT Trichy",     score: 88, band: "Top 10%" },
    { name: "Deepika Kumar", college: "IIIT Hyderabad", score: 84, band: "Top 10%" },
  ]
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" })
  const activeIdx = useRotatingIndex(CANDIDATES.length, 2400)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  return (
    <div
      ref={sectionRef}
      className="relative rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-md"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <div>
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary-600)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary-600)]" />
            </span>
            Ranked shortlist · 187 applied
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
            Analyst · 2026 batch
          </p>
        </div>
        <span className="rounded-sm bg-[var(--color-primary-50)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-primary-600)]">
          48 hr SLA
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {CANDIDATES.map((c, i) => {
          const isLit = hoverIdx === i || (hoverIdx === null && activeIdx === i)
          return (
            <li
              key={c.name}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className={cn(
                "grid grid-cols-[1.4fr_auto_1fr_auto] items-center gap-3 rounded-sm border px-3 py-2 transition-colors duration-300",
                isLit
                  ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)]"
                  : "border-[var(--border-default)] bg-[var(--bg-surface)]",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                  {c.name}
                </p>
                <p className="truncate text-[11px] text-[var(--text-muted)]">
                  {c.college}
                </p>
              </div>
              <span className="rounded-sm bg-[var(--color-success-bg)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-success)]">
                {c.band}
              </span>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-neutral-200)]">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      i === 0
                        ? "var(--color-primary-600)"
                        : "var(--color-primary-300)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: inView || reduce ? `${c.score}%` : 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.9,
                    delay: reduce ? 0 : 0.1 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
              <p
                className={cn(
                  "font-mono text-[11px] font-semibold tabular-nums transition-colors",
                  isLit
                    ? "text-[var(--color-primary-700)]"
                    : "text-[var(--text-primary)]",
                )}
              >
                {c.score}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function TpoInvitationsMockup() {
  const INVITES = [
    {
      firm: "ICICI Lombard",
      role: "Underwriting trainee",
      window: "27 Apr · 09:00",
      seats: "8 seats",
    },
    {
      firm: "Deloitte India",
      role: "Audit associate",
      window: "29 Apr · 14:00",
      seats: "12 seats",
    },
  ]
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" })
  const [accepted, setAccepted] = useState<number[]>([])
  const toggle = (i: number) =>
    setAccepted((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]))
  return (
    <div
      ref={sectionRef}
      className="relative rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-md"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <div>
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-orange)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand-orange)]" />
            </span>
            Incoming drives · {2 - accepted.length} pending
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
            Drive invitations
          </p>
        </div>
        <span className="rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
          Batch 2026 · 312 students
        </span>
      </div>
      <ul className="mt-3 space-y-2.5">
        {INVITES.map((inv, i) => {
          const isAccepted = accepted.includes(i)
          return (
            <li
              key={inv.firm}
              className="group flex items-center justify-between gap-3 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 transition-colors hover:border-[var(--color-brand-orange)]/40"
            >
              <div>
                <p className="text-[13px] font-semibold leading-tight text-[var(--text-primary)]">
                  {inv.firm}
                </p>
                <p className="text-[11px] leading-tight text-[var(--text-muted)]">
                  {inv.role} · {inv.window} · {inv.seats}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(i)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95",
                  isAccepted
                    ? "bg-[var(--color-success)] text-white"
                    : "bg-[var(--color-brand-orange)] text-white hover:brightness-110",
                )}
              >
                <Check size={12} strokeWidth={3} />
                {isAccepted ? "Accepted" : "Accept"}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mt-3 rounded-sm bg-[var(--color-warning-bg)] px-3 py-2">
        <div className="flex items-center justify-between">
          <p className="text-[var(--text-muted)] text-[12px]">
            Placement rate this season
          </p>
          <p className="font-mono text-[12px] font-semibold tabular-nums text-[var(--color-brand-orange)]">
            78% ↑ 14 pts YoY
          </p>
        </div>
        {/* Placement-rate fill — animates from 0 to 78% on view */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--color-warning-bg)] ring-1 ring-[var(--color-brand-orange)]/15">
          <motion.div
            className="h-full rounded-full bg-[var(--color-brand-orange)]"
            initial={{ width: 0 }}
            animate={{ width: inView || reduce ? "78%" : 0 }}
            transition={{
              duration: reduce ? 0 : 1.1,
              delay: reduce ? 0 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>
    </div>
  )
}
