"use client"

// Case Studies — minimal outcome ledger.
// The earlier auto-advancing carousel buried four of the five outcomes behind
// a 5s timer and a band of chrome (arrows, dots, progress). This layout puts
// every outcome on screen at once, stat-first, in the site's hairline
// language: a featured result row, then a four-cell outcome grid divided by
// 1px rules (the gap-px trick), closed by the assessment social-proof bar.
// No autoplay, no boxes, no shadows — the numbers carry the section.
//
// Bordered column rail wraps all content (border-x on max-w-6xl container);
// the grid hairlines run full-bleed so they connect into the rail.

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { CornerPlus } from "@/components/marketing/CornerPlus"
import { MobileCaseStudyCarousel } from "@/components/marketing/MobileCaseStudyCarousel"

import { CountUpStat } from "./CountUpStat"

const EASE = [0.16, 1, 0.3, 1] as const

// One-pager: case-study detail pages and the index aren't live yet, so the
// "View all case studies" link is hidden for now. Flip to true to restore it
// once those routes ship.
const SHOW_CASE_STUDY_LINKS = false

// ─── Types ───────────────────────────────────────────────────────────────────

// Exactly three industry tags, in priority order — every case study maps to
// one of these (no per-case one-off domains).
type CaseDomain = "Banking & Finances" | "Wealth Management" | "Manufacturing"

interface CaseStudy {
  id: string
  /** Industry domain tag shown on the card. */
  domain: CaseDomain
  eyebrow: string
  wordmark: string
  logoDomain: string
  /** Brand logo image (served from /public/corporate-marquee); falls back to
   *  the letter chip when absent. */
  logoSrc?: string
  quote: string
  description: string
  author: { name: string; role: string }
  stats: { value: string; label: string }[]
  href: string
}

interface TrustLogo {
  name: string
  src?: string
  domain?: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

// Real recruiter brand marks, scrolled at their native colours (no greyscale,
// no hover state). Assets live in /public/corporate-marquee.
const TRUST_LOGOS: TrustLogo[] = [
  { name: "Lloyds Technology Centre", src: "/corporate-marquee/corporate-marquee-logos01.png" },
  { name: "360 ONE", src: "/corporate-marquee/corporate-marquee-logos02.png" },
  { name: "ANAND", src: "/corporate-marquee/corporate-marquee-logos03.png" },
  { name: "IDFC First Bank", src: "/corporate-marquee/corporate-marquee-logos04.png" },
  { name: "Google", src: "/corporate-marquee/corporate-marquee-logos05.png" },
  { name: "Goldman Sachs", src: "/corporate-marquee/corporate-marquee-logos06.png" },
  { name: "LIC", src: "/corporate-marquee/corporate-marquee-logos07.png" },
  { name: "IndusInd Bank", src: "/corporate-marquee/corporate-marquee-logos08.png" },
  { name: "KPMG", src: "/corporate-marquee/corporate-marquee-logos09.png" },
  { name: "HDFC Bank", src: "/corporate-marquee/corporate-marquee-logos10.png" },
  { name: "Unity Small Finance Bank", src: "/corporate-marquee/corporate-marquee-logos11.png" },
  { name: "Lighthouse Canton", src: "/corporate-marquee/corporate-marquee-logos12.png" },
  { name: "Delhivery", src: "/corporate-marquee/corporate-marquee-logos13.png" },
  { name: "Meesho", src: "/corporate-marquee/corporate-marquee-logos14.png" },
  { name: "Mahindra Finance", src: "/corporate-marquee/corporate-marquee-logos15.png" },
  { name: "Tata Consultancy Services", src: "/corporate-marquee/corporate-marquee-logos16.png" },
  { name: "NSE", src: "/corporate-marquee/corporate-marquee-logos17.png" },
  { name: "Equirus", src: "/corporate-marquee/corporate-marquee-logos18.png" },
  { name: "DLF", src: "/corporate-marquee/corporate-marquee-logos19.png" },
  { name: "JM Financial", src: "/corporate-marquee/corporate-marquee-logos20.png" },
]

// One case per domain. Every stat matches the company's marquee hover stat
// above, so the section never contradicts its own provenance.
const CASE_STUDIES: CaseStudy[] = [
  {
    id: "hdfc-bank",
    domain: "Banking & Finances",
    eyebrow: "Banking talent at scale",
    wordmark: "HDFC Bank",
    logoDomain: "hdfcbank.com",
    logoSrc: "/corporate-marquee/corporate-marquee-logos10.png",
    quote:
      "Three weeks of shortlisting became two days, and every decision carried an audit trail our risk team could sign off.",
    description:
      "HDFC Bank runs some of the largest campus drives in Indian banking. Moving assessment onto PluginLive's AI scoring cut manual screening to days and attached a tamper-proof trail to every shortlist decision, the kind a bank's risk and compliance teams expect.",
    author: { name: "Rohan Mehta", role: "Head of Talent Acquisition" },
    stats: [
      { value: "48 hr", label: "JD to ranked shortlist" },
      { value: "8,000+", label: "candidates per drive" },
    ],
    href: "/case-studies/hdfc-bank",
  },
  {
    id: "360-one",
    domain: "Wealth Management",
    eyebrow: "Private banking talent",
    wordmark: "360 ONE",
    logoDomain: "360.one",
    logoSrc: "/corporate-marquee/corporate-marquee-logos02.png",
    quote:
      "Ten wealth hires in two quarters, each one assessed on client conversations, not just the résumé.",
    description:
      "360 ONE's wealth practice needed relationship managers who could hold a client conversation, a skill no résumé shows. AI-scored communication assessments ranked candidates on exactly that, and the practice filled ten seats in two quarters.",
    author: { name: "Shruti Nair", role: "Head, Wealth Hiring" },
    stats: [
      { value: "10+", label: "wealth hires in 2 quarters" },
      { value: "2×", label: "faster seat-to-fill" },
    ],
    href: "/case-studies/360-one",
  },
  {
    id: "anand",
    domain: "Manufacturing",
    eyebrow: "Tier-blind discovery",
    wordmark: "ANAND",
    logoDomain: "anandgroup.com",
    logoSrc: "/corporate-marquee/corporate-marquee-logos03.png",
    quote:
      "A Tier-3 engineer out-scored every IIT résumé on file. We made the hire.",
    description:
      "ANAND's plant and engineering roles were drawing from the same Tier-1 campuses every year. Skills-first assessments opened a 6.8x wider pool and surfaced outliers résumé screening missed.",
    author: { name: "Karthik Iyer", role: "VP Talent" },
    stats: [
      { value: "6.8×", label: "wider sourcing pool" },
      { value: "42%", label: "hires beyond Tier-1" },
    ],
    href: "/case-studies/anand",
  },
  {
    id: "nse",
    domain: "Banking & Finances",
    eyebrow: "Market-grade compliance",
    wordmark: "NSE",
    logoDomain: "nseindia.com",
    logoSrc: "/corporate-marquee/corporate-marquee-logos17.png",
    quote:
      "From JD to a proctored campus drive in 48 hours. Compliance didn't raise a single follow-up.",
    description:
      "NSE hires into systems where a compliance gap is front-page news. The drive ran AI-proctored end to end, every assessment supervised and logged, and shipped a ranked shortlist inside the same 48-hour window the JD landed in.",
    author: { name: "Vikram Shah", role: "VP Human Resources" },
    stats: [
      { value: "48 hr", label: "drive shipped, JD to shortlist" },
      { value: "100%", label: "assessments proctored and logged" },
    ],
    href: "/case-studies/nse",
  },
  {
    id: "lic",
    domain: "Banking & Finances",
    eyebrow: "Mass hiring at speed",
    wordmark: "LIC",
    logoDomain: "licindia.in",
    logoSrc: "/corporate-marquee/corporate-marquee-logos07.png",
    quote:
      "We ran a 12,000-candidate drive with two coordinators and zero compliance gaps.",
    description:
      "LIC runs some of the largest recruitment drives in Indian insurance, shortlisting thousands of candidates each quarter under strict audit requirements. Proctoring, live monitoring, and compliance reporting ran on the platform, so two coordinators did the work of ten.",
    author: { name: "Rhea Kapoor", role: "Head of Campus Hiring" },
    stats: [
      { value: "12,000", label: "candidates in one drive" },
      { value: "2", label: "coordinators for the drive" },
    ],
    href: "/case-studies/lic",
  },
]

// Featured result (Infosys) leads; the rest fill the outcome grid.
const FEATURED = CASE_STUDIES[0]
const GRID_CASES = CASE_STUDIES.slice(1)

// Mobile carousel — every case study as one uniform card (incl. the featured).
const MOBILE_CARDS = CASE_STUDIES.map((cs) => ({
  tag: cs.domain,
  statValue: cs.stats[0].value,
  statLabel: cs.stats[0].label,
  quote: cs.quote,
  authorName: cs.author.name,
  authorRole: cs.author.role,
}))

// ─── Props ───────────────────────────────────────────────────────────────────

interface CaseStudiesV6Props {
  heading?: ReactNode
  subhead?: string
}

// Highlighted "value" word — Instrument Serif italic in cobalt, the
// landing-wide hook-word treatment (see SectionHeading / design system).
const HEADING_DEFAULT = (
  <>
    Hires that closed because of the{" "}
    <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-600)]">
      network
    </span>
  </>
)

// ─── Component ───────────────────────────────────────────────────────────────

export function CaseStudiesShowcase({
  heading = HEADING_DEFAULT,
  subhead = "Three domains. Five hiring problems. Same AI assessment engine underneath.",
}: CaseStudiesV6Props = {}) {
  const reduce = useReducedMotion()

  return (
    <section
      id="case-studies"
      data-section-bg="light"
      aria-labelledby="case-studies-heading"
      className="border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      {/* ── Bordered column rail ───────────────────────────────── */}
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)]">

        {/* ── 1. Heading — title left, description right-aligned on the same
            row (matches Section 4 / Infrastructure); no separator. ─────── */}
        <div className="px-8 pt-20 lg:px-12 lg:pt-24">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <h2
              id="case-studies-heading"
              className="max-w-[20ch] text-[clamp(32px,4.2vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]"
            >
              {heading}
            </h2>
            <p className="max-w-sm text-[15px] leading-[1.55] text-[var(--text-muted)] lg:pt-3 lg:text-right lg:text-[17px]">
              {subhead}
            </p>
          </div>
        </div>

        {/* ── 2. Logo marquee — heading on the left, logos scroll and fade out
            toward it; framed band with detached corner crosses. ── */}
        <div className="relative mt-12 border-y border-[var(--border-default)]">
          <CornerPlus />
          <div className="flex flex-col gap-4 px-8 py-7 sm:flex-row sm:items-center sm:gap-6 lg:gap-10 lg:px-12">
            <p className="shrink-0 text-[12.5px] font-medium leading-[1.35] text-[var(--text-muted)] sm:w-[150px] lg:w-[190px]">
              Trusted by recruiters at
            </p>
            <div
              className="relative w-full min-w-0 overflow-x-clip overflow-y-visible sm:flex-1"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 9%, black 96%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 9%, black 96%, transparent 100%)",
              }}
            >
              <div className="ticker-track flex w-max items-center gap-12 whitespace-nowrap py-6">
                {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
                  <MarqueeLogo key={`${logo.name}-${i}`} logo={logo} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3 + 4. Featured + outcome cards.
            Desktop: ONE connected framed block — the featured spans the full
            top row, the four short cards sit beneath it, all sharing the same
            cell-border rails and corner "+" markers, with no gap between them.
            Mobile: a swipeable carousel of uniform cards (below). ──── */}
        <div className="hidden lg:block">
        <div className="mx-8 my-12 border-b border-r border-[var(--border-default)] lg:mx-12 lg:my-14">

        {/* Featured — full-width framed cell, same floating-card-in-rails
            treatment as the short cards below, including the hover snap-fill
            (cell padding → 0 while the card's padding grows by the same 12px,
            so the cell height stays invariant — no shift of the cards below). */}
        <div className="group/cell relative border-l border-t border-[var(--border-default)] bg-[var(--bg-page)] p-3 transition-[padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:p-0 motion-reduce:transition-none">
          <CornerPlus />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="grid gap-10 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-8 shadow-sm transition-[border-radius,box-shadow,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cell:rounded-none group-hover/cell:p-[2.75rem] group-hover/cell:shadow-none motion-reduce:transition-none lg:grid-cols-12 lg:gap-0 lg:p-10 lg:group-hover/cell:p-[3.25rem]"
          >
          {/* Quote side */}
          <div className="flex flex-col lg:col-span-7 lg:pr-14">
            <div className="flex items-center gap-3">
              <CompanyLogo
                wordmark={FEATURED.wordmark}
                src={FEATURED.logoSrc}
                size={32}
              />
              <div>
                <p className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                  {FEATURED.wordmark}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {FEATURED.eyebrow}
                </p>
              </div>
              <DomainTag domain={FEATURED.domain} className="ml-auto" />
            </div>

            {/* Editorial blur-in — the one rehearsed moment of the section.
                Blur bridges the fade so the quote resolves like ink settling
                rather than two states crossfading. */}
            <motion.blockquote
              initial={
                reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
              className="mt-8 flex-1 text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.4] tracking-[-0.015em] text-[var(--text-primary)]"
            >
              &ldquo;{FEATURED.quote}&rdquo;
            </motion.blockquote>

            <p className="mt-8 text-sm text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text-primary)]">
                {FEATURED.author.name}
              </span>
              {" · "}
              {FEATURED.author.role}
            </p>
          </div>

          {/* Outcome side — stacked stats behind a hairline. Values count up
              from zero on first reveal (CountUpStat honours reduced motion). */}
          <div className="flex flex-col justify-center gap-10 border-t border-[var(--border-default)] pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
            {FEATURED.stats.map((s, si) => (
              <div key={s.label}>
                <CountUpStat
                  value={s.value}
                  duration={1.4}
                  delay={0.2 + si * 0.15}
                  className="block text-[clamp(44px,4.6vw,60px)] font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--text-primary)]"
                />
                <p className="mt-2.5 text-sm text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
          </motion.div>
        </div>

        {/* Four short outcome cards — directly below the featured cell, sharing
            its rails (each card floats in its cell and snaps to fill on hover;
            the "+" markers coincide on the shared edges). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {GRID_CASES.map((cs, i) => (
            <div
              key={cs.id}
              className="group/cell relative border-l border-t border-[var(--border-default)] bg-[var(--bg-page)] p-3 transition-[padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:p-0 motion-reduce:transition-none"
            >
              <motion.article
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.07 * i, ease: EASE }}
                // On hover the cell padding goes to 0 and this card's padding
                // grows by the same 12px (p-6 → p-9), so the content box keeps
                // its exact size and position while the border/corners expand
                // to fill the cell. No text reflow.
                className="flex h-full min-w-0 flex-col rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-sm transition-[border-radius,box-shadow,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cell:rounded-none group-hover/cell:p-9 group-hover/cell:shadow-none motion-reduce:transition-none"
              >
                <DomainTag domain={cs.domain} className="self-start" />

                <CountUpStat
                  value={cs.stats[0].value}
                  duration={1.2}
                  delay={0.15 + 0.07 * i}
                  className="mt-5 block text-[clamp(32px,2.8vw,40px)] font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--text-primary)] transition-colors duration-200 group-hover/cell:text-[var(--color-primary-600)]"
                />
                <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                  {cs.stats[0].label}
                </p>

                <blockquote className="mt-5 flex-1 text-sm leading-[1.65] text-[var(--text-body)]">
                  &ldquo;{cs.quote}&rdquo;
                </blockquote>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--border-default)] pt-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                      {cs.author.name}
                    </p>
                    <p className="truncate text-[11px] text-[var(--text-muted)]">
                      {cs.author.role}
                    </p>
                  </div>
                  <CompanyLogo
                    wordmark={cs.wordmark}
                    src={cs.logoSrc}
                    size={36}
                  />
                </div>
              </motion.article>

              {/* "+" markers at the cell corners — they sit in the gutters
                  between floating cards and land on the card's own corners as
                  it fills the cell on hover. Rendered last so they stay above
                  the filled card. */}
              <CornerPlus />
            </div>
          ))}
        </div>
        </div>{/* end connected featured + grid block */}
        </div>{/* end desktop-only */}

        {/* Mobile — swipeable carousel of uniform cards inside a cross-framed cell */}
        <div className="px-8 py-8 lg:hidden">
          <MobileCaseStudyCarousel items={MOBILE_CARDS} />
        </div>

        {/* ── 5. Social-proof close — the grid's inset bottom rail already
            separates it, so no full-width border-t (which would stick out
            past the inset frame as an extra line). ── */}
        <div className="flex flex-col items-center gap-3 px-8 pb-6 pt-7 sm:flex-row sm:justify-between lg:px-12">
          <p className="text-sm text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-primary)]">10,000+</span>{" "}
            candidates assessed per drive
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className="fill-[var(--color-brand-amber)] text-[var(--color-brand-amber)]"
              />
            ))}
            <span className="ml-1 text-sm font-semibold text-[var(--text-primary)]">
              4.9
            </span>
            <span className="text-sm text-[var(--text-muted)]">
              · from 500+ assessments
            </span>
          </div>
          {SHOW_CASE_STUDY_LINKS && (
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-brand)] underline-offset-4 hover:underline"
            >
              View all case studies
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

      </div>{/* end bordered column */}
    </section>
  )
}

// ─── Domain tag ──────────────────────────────────────────────────────────────
// Industry chip on each case study: rounded-sm per the radius cap. The three
// priority domains carry a semantic tint (token-backed — info blue for
// banking, success green for wealth, brand orange for manufacturing); other
// domains stay on the muted outline default so the stat keeps the lead.

const DOMAIN_TONES: Record<
  CaseDomain,
  { text: string; bg: string; border: string }
> = {
  "Banking & Finances": {
    text: "var(--color-info)",
    bg: "var(--color-info-bg)",
    border: "color-mix(in srgb, var(--color-info) 30%, transparent)",
  },
  "Wealth Management": {
    text: "var(--color-success)",
    bg: "var(--color-success-bg)",
    border: "color-mix(in srgb, var(--color-success) 30%, transparent)",
  },
  Manufacturing: {
    text: "var(--color-brand-orange)",
    bg: "var(--color-brand-orange-subtle)",
    border: "color-mix(in srgb, var(--color-brand-orange) 30%, transparent)",
  },
}

function DomainTag({
  domain,
  className,
}: {
  domain: CaseDomain
  className?: string
}) {
  const tone = DOMAIN_TONES[domain]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium leading-[18px]",
        !tone &&
          "border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-muted)]",
        className,
      )}
      style={
        tone
          ? {
              color: tone.text,
              backgroundColor: tone.bg,
              borderColor: tone.border,
            }
          : undefined
      }
    >
      {domain}
    </span>
  )
}

// ─── Marquee logo with image + text fallback ────────────────────────────────

function MarqueeLogo({ logo, darkMode = false }: { logo: TrustLogo; darkMode?: boolean }) {
  const [errored, setErrored] = useState(false)
  const imgSrc = logo.src ?? null

  // Logos render at their native colours with no hover state — a quiet,
  // self-running trust band.
  return (
    <div className="relative flex-shrink-0">
      {imgSrc && !errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={logo.name}
          width={160}
          height={76}
          className="h-[76px] w-auto object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className={cn(
          "text-sm font-semibold tracking-tight",
          darkMode ? "text-white/70" : "text-[var(--text-primary)]",
        )}>
          {logo.name}
        </span>
      )}
    </div>
  )
}

// ─── Company logo with letter fallback ───────────────────────────────────────

function CompanyLogo({
  wordmark,
  src,
  size = 32,
}: {
  wordmark: string
  /** Brand logo image. Falls back to the letter chip when absent or failing. */
  src?: string
  size?: number
}) {
  const [errored, setErrored] = useState(false)

  const sizeClass =
    size <= 24 ? "size-6" : size <= 28 ? "size-7" : size <= 32 ? "size-8" : "size-9"
  const textClass =
    size <= 24 ? "text-[10px]" : size <= 28 ? "text-[11px]" : size <= 32 ? "text-xs" : "text-sm"

  // No image (or it failed to load) → a brand-tinted letter chip.
  if (errored || !src) {
    return (
      <div
        className={cn(
          sizeClass,
          textClass,
          "flex shrink-0 items-center justify-center rounded-sm bg-[var(--color-primary-600)] font-bold text-white",
        )}
      >
        {wordmark.charAt(0)}
      </div>
    )
  }

  // Brand logo: a uniform 1:1 (square) white chip on every card, so the marks
  // sit on a consistent grid. Logos are contained, never cropped — a wide mark
  // simply centres as a band within the square.
  return (
    <div
      className={cn(
        sizeClass,
        "flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[var(--border-default)] bg-white p-1",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={wordmark}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  )
}
