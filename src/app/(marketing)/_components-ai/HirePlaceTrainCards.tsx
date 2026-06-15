"use client"

// Landing Section 5 — Platform (Hire / Place / Train).
// Three stacked panels using a sticky cover-stack: each panel pins and the next
// rides up over it, entering with a slight tilt that straightens to flat as it
// settles — so the deck is never slanted at rest, only the card currently
// riding up tilts. No scale-down.
// Each card pins 96px lower than the last, so the final state is a deck stacked
// like files in a drawer, every card's eyebrow (icon + label) peeking above the
// next. Below lg the pin and tilt are dropped and all three cards flow normally
// (the old mobile design). Text lives in
// the left column, an illustrative graphic in the right column. Panels stay
// white; the per-pillar brand colour (Hire cobalt, Place amber, Train orange —
// audience-consistent with the audience cards) tints only the icon badge and the graphic
// elements (avatars, dots, status glyphs); copy stays neutral. The graphics are
// purely qualitative — no figures or stats live here, those stay in the card
// text. Each graphic is a self-running explainer of its pillar: an AI evaluation
// pipeline that ends in a ranked shortlist (Hire), an assessed cohort wired into
// a live corporate placement network (Place), and a learning platform whose
// modules upskill a student along a job-ready readiness journey (Train) — all
// conceptual floating cards, never product/dashboard screenshots. CTA is the
// neutral outline secondary.

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CircleCheck,
  GraduationCap,
  MoreHorizontal,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const EASE = [0.16, 1, 0.3, 1] as const

// Per-pillar brand accent, audience-consistent with the audience cards: Hire cobalt (the
// Corporates band), Place amber, Train orange. The accent colours only the icon
// badge and the graphical elements (dots, rings, fill bars, ping); all text and
// numbers stay neutral (--text-primary) so nothing relies on a tinted, hard-to-
// read shade.
const COBALT = "var(--color-primary-600)"
const AMBER = "var(--color-brand-amber)"
const ORANGE = "var(--color-brand-orange)"

// The decorative background texture (rings / grid / dots) reads as a neutral
// grey on every card, not the pillar accent — the accent stays on the floating
// card elements only.
const GRAPHIC_TINT = "var(--color-neutral-300)"

// ─── Data ────────────────────────────────────────────────────────────────────

interface CapabilityCard {
  id: string
  href: string
  eyebrow: string
  icon: LucideIcon
  accent: string
  title: string
  description: string
  stats: { value: string; label: string }[]
  cta: string
  Visual: React.ComponentType
}

const CARDS: CapabilityCard[] = [
  {
    id: "hire",
    href: "/hire",
    eyebrow: "Hire",
    icon: Briefcase,
    accent: COBALT,
    title: "Hire proven talent",
    description:
      "An AI-assessed talent network that scores and ranks every candidate for volume roles, founder-led search for senior mandates, and a hire-train-deploy track that upskills people to day-one ready.",
    stats: [
      { value: "2.4x", label: "Higher interview-to-offer rate" },
      { value: "48hr", label: "From drive launch to AI-ranked shortlist" },
    ],
    cta: "Hire your next candidate",
    Visual: HireGraphic,
  },
  {
    id: "place",
    href: "/place",
    eyebrow: "Place",
    icon: GraduationCap,
    accent: AMBER,
    title: "Place more students",
    description:
      "Built for institutes and NGOs. Onboard a batch once, AI assesses every student and helps them upskill to recruiter readiness, then open the drives that fit and track every outcome in one dashboard, board-ready.",
    stats: [
      { value: "+46%", label: "Lift in placement rate" },
      { value: "12", label: "New employers in year one" },
    ],
    cta: "Place your students",
    Visual: PlaceGraphic,
  },
  {
    id: "train",
    href: "/train",
    eyebrow: "Train",
    icon: BookOpen,
    accent: ORANGE,
    title: "Upskill to role-ready",
    description:
      "Role-aligned upskilling for freshers, students, and mid-career professionals. AI maps each learner's gaps to courses recruiters actually screen for, then re-assesses until they're role-ready.",
    stats: [
      { value: "3 tracks", label: "Freshers, students, mid-career" },
      { value: "Job-ready", label: "From assessed to deployable" },
    ],
    cta: "Upskill your team or students",
    Visual: TrainGraphic,
  },
]

// ─── Pillar icon tile ──────────────────────────────────────────────────────
// The pillar icon on a soft accent-tinted tile, sized to complement the eyebrow
// label beside it (Hire cobalt, Place amber, Train orange).

function IconCard({ Icon, accent }: { Icon: LucideIcon; accent: string }) {
  return (
    <span
      className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border shadow-sm"
      style={{
        backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
        borderColor: `color-mix(in srgb, ${accent} 22%, transparent)`,
      }}
    >
      <Icon size={18} strokeWidth={2} style={{ color: accent }} />
    </span>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function HirePlaceTrainCards() {
  return (
    <section
      id="capabilities"
      data-section-bg="light"
      aria-label="Hire, place, and train"
      className="border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-6 py-28 lg:px-12 lg:py-36">
        {/* Cover stack: each card pins 96px lower than the one before and the
            next rides up over it with a slight tilt that straightens as it
            settles. Equal desktop heights mean each card
            covers the one beneath except its eyebrow strip, leaving a flat deck
            stacked like files in a drawer at rest. Mobile drops the pin and tilt
            and flows all three cards normally. */}
        <div className="relative space-y-16 pb-8">
          {CARDS.map((card, i) => (
            <CapabilityCardItem key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Card shell ───────────────────────────────────────────────────────────────

interface CapabilityCardItemProps {
  card: CapabilityCard
  index: number
}

function CapabilityCardItem({ card, index }: CapabilityCardItemProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8% 0px" })
  const Visual = card.Visual

  // The pinned cover-stack is a desktop affordance. On mobile the copy + 300px
  // graphic together exceed the viewport, so below lg we drop the pin entirely
  // (CSS lg:sticky) and let all three cards flow normally with no tilt — the
  // old design. isDesktop gates the tilt off there. It MUST start false so the
  // first client render matches the server (which has no window); the effect
  // below flips it on mount. Reading window in a lazy initializer would make
  // the tilt style present on the client but absent on the server — a
  // hydration mismatch.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Entrance: as the card rises toward its pinned spot it straightens
  // from a slight tilt to flat, so the deck is never slanted at rest — only the
  // card currently riding up is tilted. Sign alternates so cards lean in from
  // either side; the first card sits flat. Scroll-linked, transform-only, and
  // gated off under reduced motion and on mobile.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })
  const tilt = reduce || index === 0 ? 0 : (index % 2 === 1 ? 1 : -1) * (4 + index * 2)
  const rotate = useTransform(scrollYProgress, [0, 0.92], [tilt, 0])

  return (
    <div
      ref={ref}
      // Pin via CSS (lg:sticky) rather than a JS breakpoint flag, so the stack
      // never depends on an effect firing. top/zIndex are inert while the
      // element is static (mobile), and activate once lg:sticky kicks in.
      // Each card pins 96px lower than the one before, so the previous card's
      // top strip — its eyebrow row (icon + label) — stays visible above the
      // next, leaving a stacked-deck final state. 96px clears the eyebrow zone
      // (card padding 40px + 36px icon tile).
      className="lg:sticky"
      style={{ top: `${112 + index * 96}px`, zIndex: index + 1 }}
    >
      <motion.article
        style={isDesktop ? { rotate, transformOrigin: "50% 50%" } : undefined}
        className="group overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-md transition-shadow duration-300 hover:shadow-lg lg:min-h-[520px]"
      >
        {/* Mobile flows Title -> Graphic -> Description -> CTA in one column;
            desktop places title (row1) and the rest (row2) in the left column
            with the graphic spanning both rows on the right. Explicit grid
            lines keep the desktop two-column read while the source order gives
            the requested mobile sequence. */}
        <div className="grid gap-0 p-6 lg:h-full lg:min-h-[520px] lg:grid-cols-2 lg:content-center lg:gap-x-16 lg:p-10">
          {/* 1 — Title (eyebrow + heading) */}
          <div className="lg:col-start-1 lg:row-start-1">
            <motion.div
              className="flex items-center gap-3"
              initial={reduce ? undefined : { opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <IconCard Icon={card.icon} accent={card.accent} />
              <p className="text-base font-medium text-[var(--text-primary)]">
                {card.eyebrow}
              </p>
            </motion.div>

            <motion.h3
              className="mt-4 max-w-[18ch] text-[clamp(26px,3.1vw,40px)] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--text-primary)]"
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            >
              {card.title}
            </motion.h3>
          </div>

          {/* 2 — Graphic (between title and description on mobile; right
              column spanning both rows, vertically centred, on desktop) */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mt-3 flex items-center justify-center lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:self-center"
          >
            <Visual />
          </motion.div>

          {/* 3 — Description + stats + CTA */}
          <div className="mt-3 lg:col-start-1 lg:row-start-2 lg:mt-4">
            <motion.p
              className="max-w-[48ch] text-[15px] leading-[1.65] text-[var(--text-body)]"
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.14, ease: EASE }}
            >
              {card.description}
            </motion.p>

            {/* Stats — two values split by a hairline dot */}
            <div className="mt-8 flex items-start gap-5 border-t border-[var(--border-default)] pt-6">
              {card.stats.map((s, si) => (
                <div key={s.label} className="flex items-start gap-5">
                  {si > 0 && (
                    <span
                      aria-hidden
                      className="mt-3 size-1 shrink-0 rounded-full bg-[var(--color-neutral-300)]"
                    />
                  )}
                  <motion.div
                    initial={reduce ? undefined : { opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.4, delay: 0.22 + si * 0.08, ease: EASE }}
                  >
                    <p className="text-[clamp(22px,2.4vw,32px)] font-bold leading-none tracking-[-0.03em] tabular-nums text-[var(--text-primary)]">
                      {s.value}
                    </p>
                    <p className="mt-1.5 max-w-[20ch] text-[13px] leading-snug text-[var(--text-muted)]">
                      {s.label}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.4, delay: 0.36, ease: EASE }}
              className="mt-8"
            >
              {/* One-pager: every pillar CTA routes to the closing booking
                  note (#book) rather than its L2 route, which stays in the
                  data for later. */}
              <Button asChild variant="outline" size="default" className="group/cta">
                <Link href="#book">
                  {card.cta}
                  <ArrowRight size={14} className="ml-1 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

// ─── Shared graphic atoms ──────────────────────────────────────────────────────

// Replays a graphic's entrance choreography on a fixed period while it is in
// view: bumping the returned key remounts the animated subtree, so its
// whileInView sequences run again — the loop that keeps all three pillar
// graphics alive. Pauses off-screen; reduced motion pins to a single instant
// pass (the end state still reads the full story).
function useReplayKey(periodMs: number, active: boolean) {
  const reduce = useReducedMotion()
  const [key, setKey] = useState(0)
  useEffect(() => {
    if (!active || reduce) return
    const id = setInterval(() => setKey((v) => v + 1), periodMs)
    return () => clearInterval(id)
  }, [active, reduce, periodMs])
  return key
}

// Decorative accent texture behind each graphic — a dotted field, concentric
// rings, or a hairline grid, tinted to the pillar accent and masked to fade at
// the edges so the floating cards read against texture, not a panel. Rings
// breathe slowly; reduced motion pins them static.
function GraphicTexture({
  variant,
  color,
}: {
  variant: "dots" | "rings" | "grid"
  color: string
}) {
  const reduce = useReducedMotion()

  if (variant === "rings") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 320 320"
        preserveAspectRatio="xMidYMid slice"
        // size-full (explicit dimensions) keeps the SVG at the graphic-box size
        // and centred — avoiding the intrinsic-square off-centre drift you get
        // when only insets are set on a square-viewBox SVG.
        className="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(circle_at_50%_50%,black_0%,black_70%,transparent_100%)]"
        style={{ color }}
      >
        {[46, 72, 98, 124, 150, 176].map((r, i) => (
          <motion.circle
            key={r}
            cx="160"
            cy="160"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={reduce ? { opacity: 0.18 } : { opacity: 0.12 }}
            animate={
              reduce ? { opacity: 0.18 } : { opacity: [0.12, 0.26, 0.12] }
            }
            transition={
              reduce
                ? undefined
                : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
            }
          />
        ))}
      </svg>
    )
  }

  if (variant === "grid") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 [mask-image:radial-gradient(circle_at_50%_46%,black_0%,transparent_78%)]"
        style={{
          backgroundImage: [
            `linear-gradient(to right, color-mix(in srgb, ${color} 42%, transparent) 1px, transparent 1px)`,
            `linear-gradient(to bottom, color-mix(in srgb, ${color} 42%, transparent) 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: "28px 28px",
        }}
      />
    )
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-4 [mask-image:radial-gradient(circle_at_50%_46%,black_0%,transparent_75%)]"
      style={{
        backgroundImage: `radial-gradient(color-mix(in srgb, ${color} 78%, transparent) 1.6px, transparent 1.6px)`,
        backgroundSize: "20px 20px",
      }}
    />
  )
}

// Small pill badge — same float, pill shape.
function FloatBadge({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn(
        "absolute flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-white px-3 py-2 shadow-md",
        className,
      )}
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  )
}

// Real candidate / student portrait — circular, framed by a thin accent ring so
// the face reads as a profile chip rather than a bare photo. Decorative
// (aria-hidden); the names live in the card text, not in the image. Served from
// public/people (curated Unsplash portraits, free licence).
function PhotoAvatar({
  src,
  size,
  ring,
  className,
}: {
  src: string
  size: number
  ring: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-[var(--bg-surface)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${ring}`,
      }}
    >
      <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  )
}

// ─── Graphic: Hire (cobalt) — a ranked shortlist, scored and audit-ready ───────
// Reads as real product chrome: a "Ranked shortlist" card with three candidate
// rows ordered by fit score. Each row's score bar grows in on view (scaleX,
// transform only), the #1 row rides amber and carries a "Top match" mark that
// lands after the bar settles, and a verified badge frames the list as scored
// and audit-ready. Colour rides only on the bars, avatars, and glyphs; the
// headline figures stay in the card text.

const HIRE_RANKED = [
  {
    photo: "/people/aarav.jpg",
    name: "Aarav Rao",
    meta: "Analyst · IIT Bombay",
    score: 94,
    top: true,
  },
  {
    photo: "/people/priya.jpg",
    name: "Priya Sharma",
    meta: "Associate · BITS Pilani",
    score: 89,
    top: false,
  },
  {
    photo: "/people/karan.jpg",
    name: "Karan Mehta",
    meta: "Analyst · NIT Trichy",
    score: 86,
    top: false,
  },
]

// One ranked row — rank chip, portrait, name + meta, and a fit score (value
// over a short bar). The #1 row is tinted, rides amber, and carries the "Top
// match" verdict that lands after its bar settles.
function RankedRow({
  c,
  rank,
  delay = 0,
}: {
  c: (typeof HIRE_RANKED)[number]
  rank: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  const tone = c.top ? AMBER : COBALT
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5",
        c.top && "bg-[color-mix(in_srgb,var(--color-primary-600)_6%,white)]",
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-surface)] font-mono text-[10px] font-semibold tabular-nums text-[var(--text-muted)]">
        {rank}
      </span>
      <PhotoAvatar src={c.photo} size={32} ring={tone} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[12.5px] font-semibold leading-tight text-[var(--text-primary)]">
            {c.name}
          </p>
          {c.top && (
            <motion.span
              className="inline-flex shrink-0 items-center gap-0.5 rounded-sm px-1 py-0.5 text-[9.5px] font-semibold text-[var(--text-primary)]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-brand-amber) 24%, white)",
              }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.4, delay: delay + 0.7, ease: EASE }
              }
            >
              <Star size={9} strokeWidth={2.5} style={{ color: AMBER }} />
              Top match
            </motion.span>
          )}
        </div>
        <p className="truncate text-[11px] leading-tight text-[var(--text-muted)]">
          {c.meta}
        </p>
      </div>
      {/* Score — value over a short bar */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className="font-mono text-[13.5px] font-bold leading-none tabular-nums"
          style={{ color: c.top ? "var(--color-primary-700)" : "var(--text-primary)" }}
        >
          {c.score}
        </span>
        <span className="relative h-1.5 w-14 overflow-hidden rounded-full bg-[var(--color-neutral-100)]">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${c.score}%`, backgroundColor: tone, transformOrigin: "left" }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
          />
        </span>
      </div>
    </div>
  )
}

function HireGraphic() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-10% 0px" })
  // Bars settle by ~1.9s; replay the ranking sweep every few seconds.
  const replay = useReplayKey(5200, inView)
  return (
    <div ref={ref} className="relative h-[300px] w-full max-w-[420px] transition-transform duration-[320ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.03] motion-reduce:transform-none">
      <GraphicTexture variant="rings" color={GRAPHIC_TINT} />

      {/* Ranked-shortlist product card — centered; the inner panel keeps the
          shared idle float without fighting the centering transform. */}
      <div className="absolute left-1/2 top-1/2 w-full max-w-[340px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-white shadow-md"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-[var(--border-default)] px-4 py-3">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-white"
              style={{ backgroundColor: COBALT }}
            >
              <Scale size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight text-[var(--text-primary)]">
                Ranked shortlist
              </p>
              <p className="truncate text-[11px] leading-tight text-[var(--text-muted)]">
                Senior Analyst · 8,000 assessed
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-sm bg-[var(--bg-surface)] px-1.5 py-1 text-[10px] font-medium text-[var(--text-muted)]">
              By fit score
            </span>
          </div>

          {/* Rows — ordered by score; the keyed wrapper replays the score
              sweep on a loop while the card is in view */}
          <div key={replay} className="divide-y divide-[var(--border-default)]">
            {HIRE_RANKED.map((c, i) => (
              <RankedRow key={c.name} c={c} rank={i + 1} delay={0.15 + i * 0.12} />
            ))}
          </div>

          {/* Footer — provenance + overflow affordance */}
          <div className="flex items-center justify-between gap-2 border-t border-[var(--border-default)] px-4 py-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
              <BadgeCheck size={13} style={{ color: COBALT }} />
              Audit trail attached
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--text-brand)]">
              View all 12
              <ArrowRight size={12} />
            </span>
          </div>
        </motion.div>
      </div>

      <FloatBadge className="right-2 top-6" delay={0.4}>
        <ShieldCheck size={14} style={{ color: COBALT }} />
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
          Proctored
        </span>
      </FloatBadge>
    </div>
  )
}

// ─── Graphic: Place (amber) — placement-rate impact, cohort over cohort ────────
// A "Placement impact" panel charts the rate climbing cohort over cohort, with
// the inflection where the programme starts highlighted and the lift called out
// in success green. A floating trend pill restates the outcome. No figures live
// on the axis; the headline stats stay in the card text. Amber rides the line
// and dots; green marks the positive lift only.

const PLACE_SERIES = [0.26, 0.32, 0.29, 0.44, 0.6, 0.74, 0.9]
const PLACE_LABELS = ["’20", "’21", "’22", "’23", "’24", "’25", "’26"]
const PLACE_JUMP = 3

// Placement-rate line. The path draws on view (pathLength), dots pop in
// sequence, and a success-green band marks the cohort where outcomes lift.
function ImpactChart() {
  const reduce = useReducedMotion()
  const W = 244
  const H = 96
  const padX = 8
  const padTop = 16
  const padBottom = 8
  const plotW = W - padX * 2
  const plotH = H - padTop - padBottom
  const pts = PLACE_SERIES.map((v, i) => ({
    x: padX + (i / (PLACE_SERIES.length - 1)) * plotW,
    y: padTop + (1 - v) * plotH,
  }))
  const d = pts
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")
  // Closed area under the line, down to the baseline, for a soft amber fill.
  const baseY = (H - padBottom).toFixed(1)
  const areaD = `${d} L ${pts[pts.length - 1].x.toFixed(1)} ${baseY} L ${pts[0].x.toFixed(1)} ${baseY} Z`
  const jx = pts[PLACE_JUMP].x
  const lastPt = pts[pts.length - 1]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Placement rate climbing cohort over cohort"
    >
      <defs>
        <linearGradient id="place-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AMBER} stopOpacity={0.22} />
          <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Area fill — fades in once the line has finished drawing, so the climb
          reads as a stroke first, then gains volume. */}
      <motion.path
        d={areaD}
        fill="url(#place-area)"
        stroke="none"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 1.1, ease: EASE }}
      />
      {/* Lift band + marker at the inflection cohort */}
      <rect
        x={jx - 11}
        y={padTop - 6}
        width={22}
        height={plotH + 10}
        rx={4}
        fill="color-mix(in srgb, var(--color-success) 12%, white)"
      />
      <line
        x1={jx}
        y1={padTop - 4}
        x2={jx}
        y2={H - padBottom}
        stroke="var(--color-success)"
        strokeWidth={1}
        strokeDasharray="2 2"
        strokeOpacity={0.55}
      />
      <text
        x={jx}
        y={padTop - 8}
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="700"
        fill="var(--color-success)"
      >
        +46%
      </text>

      {/* Rate line */}
      <motion.path
        d={d}
        fill="none"
        stroke={AMBER}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
      />

      {/* Outcome halo — a calm pulse behind the final cohort dot, marking the
          point the climb lands on. Gated on reduced motion. */}
      {!reduce && (
        <motion.circle
          cx={lastPt.x}
          cy={lastPt.y}
          r={3.4}
          fill="none"
          stroke={AMBER}
          strokeWidth={1.4}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ scale: 1, opacity: 0 }}
          whileInView={{ scale: [1, 2.6], opacity: [0.5, 0] }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 1.8,
            delay: 1.5,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
        />
      )}

      {/* Cohort dots */}
      {pts.map((p, i) => {
        const last = i === pts.length - 1
        return (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={last ? 4 : 2.8}
            fill={last ? AMBER : "white"}
            stroke={AMBER}
            strokeWidth={1.6}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.3, delay: 0.4 + i * 0.09, ease: EASE }
            }
          />
        )
      })}
    </svg>
  )
}

function PlaceGraphic() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-10% 0px" })
  // The line + dots settle by ~2s; replay the climb every few seconds.
  const replay = useReplayKey(6400, inView)

  return (
    <div ref={ref} className="relative h-[300px] w-full max-w-[420px] transition-transform duration-[320ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.03] motion-reduce:transform-none">
      <GraphicTexture variant="grid" color={GRAPHIC_TINT} />

      {/* Centered impact card — static wrapper centers it; inner panel keeps the
          shared idle float without fighting the centering transform. */}
      <div className="absolute left-1/2 top-1/2 w-full max-w-[312px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-full rounded-lg border border-[var(--border-default)] bg-white shadow-md"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-1.5">
              <GraduationCap size={15} style={{ color: AMBER }} />
              <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                Placement impact
              </p>
              <MoreHorizontal size={14} className="ml-auto text-[var(--text-muted)]" />
            </div>
            <div key={replay} className="mt-3">
              <ImpactChart />
            </div>
            <div className="mt-1.5 flex justify-between px-1">
              {PLACE_LABELS.map((l) => (
                <span
                  key={l}
                  className="text-[10px] tabular-nums text-[var(--text-muted)]"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Outcome pill — the positive lift, in success green */}
      <div className="absolute left-1/2 top-5 -translate-x-1/2">
        <motion.div
          className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-md"
          style={{
            borderColor: "color-mix(in srgb, var(--color-success) 32%, white)",
          }}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="flex size-5 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-success-bg)" }}
          >
            <TrendingUp
              size={11}
              strokeWidth={2.5}
              style={{ color: "var(--color-success)" }}
            />
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--color-success)" }}
          >
            Placement rate +46%
          </span>
        </motion.div>
      </div>

      <FloatBadge className="bottom-6 right-3" delay={0.5}>
        <Sparkles size={14} strokeWidth={2.25} style={{ color: AMBER }} />
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
          AI-assessed cohort
        </span>
      </FloatBadge>
    </div>
  )
}

// ─── Graphic: Train — an upskilling path, module by module ─────────────────────
// Reads as real product chrome, like the Hire panel: an "Upskilling path" card
// for one learner. Four modules clear in sequence — each bar fills, then its
// check lands — while a readiness ring in the header sweeps up to the
// composite score. When the last module clears, a "Role-ready" chip blooms in
// the footer. Accents deepen navy → cobalt → amber → orange down the path; the
// headline stats stay in the card text.

const TRAIN_LEARNER = "/people/ananya.jpg"

// Upskilling covers exactly these two: domain skills and interview readiness.
const TRAIN_MODULES = [
  { label: "Domain skills", score: 90, color: AMBER },
  { label: "Interview prep", score: 88, color: ORANGE },
]

// Composite of the module scores above — the ring and the modules must agree.
const TRAIN_READINESS = 89

// Per-module beat: the bar fills, its check lands, the next module starts as
// the previous one settles. The ring sweep spans the whole sequence.
const MODULE_BASE = 0.3
const MODULE_STEP = 0.5

function ReadinessRing({ value, delay }: { value: number; delay: number }) {
  const reduce = useReducedMotion()
  const R = 14
  const C = 2 * Math.PI * R
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center">
      <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          stroke="var(--color-neutral-200)"
          strokeWidth="3"
        />
        <motion.circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          stroke={ORANGE}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={reduce ? false : { strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - value / 100) }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: MODULE_STEP * TRAIN_MODULES.length,
                  delay,
                  ease: EASE,
                }
          }
        />
      </svg>
      <span className="font-mono text-[12px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
        {value}
      </span>
    </span>
  )
}

// One module row — label, fill bar, score, and a check that lands as the bar
// settles. The row accent deepens down the list (navy → orange).
function ModuleRow({
  m,
  index,
}: {
  m: (typeof TRAIN_MODULES)[number]
  index: number
}) {
  const reduce = useReducedMotion()
  const delay = MODULE_BASE + index * MODULE_STEP
  return (
    <div className="flex items-center gap-2.5 px-4 py-3">
      <span className="w-[100px] shrink-0 truncate text-[12px] font-medium leading-tight text-[var(--text-primary)]">
        {m.label}
      </span>
      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-neutral-100)]">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${m.score}%`,
            backgroundColor: m.color,
            transformOrigin: "left",
          }}
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.45, delay, ease: EASE }
          }
        />
      </span>
      <span className="w-7 shrink-0 text-right font-mono text-[12px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
        {m.score}
      </span>
      <motion.span
        className="flex shrink-0"
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.3, delay: delay + 0.42, ease: EASE }
        }
      >
        <CircleCheck
          size={15}
          strokeWidth={2.5}
          style={{ color: m.color }}
          aria-hidden
        />
      </motion.span>
    </div>
  )
}

function TrainGraphic() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-10% 0px" })
  // Modules + ring settle by ~2s; replay the path every few seconds.
  const replay = useReplayKey(5200, inView)
  // The role-ready payoff lands after the last module's check settles.
  const settleDelay = MODULE_BASE + TRAIN_MODULES.length * MODULE_STEP + 0.15

  return (
    <div ref={ref} className="relative h-[300px] w-full max-w-[420px] transition-transform duration-[320ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.03] motion-reduce:transform-none">
      <GraphicTexture variant="dots" color={GRAPHIC_TINT} />

      {/* Upskilling-path product card — centered; the inner panel keeps the
          shared idle float without fighting the centering transform. */}
      <div className="absolute left-1/2 top-1/2 w-full max-w-[340px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-white shadow-md"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          {/* Keyed wrapper replays the whole path (ring, modules, payoff) on a
              loop while the card is in view, without restarting the float. */}
          <div key={replay}>
          {/* Header — the learner, their track, and the readiness ring */}
          <div className="flex items-center gap-2.5 border-b border-[var(--border-default)] px-4 py-3">
            <PhotoAvatar src={TRAIN_LEARNER} size={32} ring={ORANGE} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-tight text-[var(--text-primary)]">
                Upskilling path
              </p>
              <p className="truncate text-[11px] leading-tight text-[var(--text-muted)]">
                Ananya Iyer · Business Analyst track
              </p>
            </div>
            <ReadinessRing value={TRAIN_READINESS} delay={MODULE_BASE} />
          </div>

          {/* Modules — clear in sequence, deepening in accent */}
          <div className="divide-y divide-[var(--border-default)]">
            {TRAIN_MODULES.map((m, i) => (
              <ModuleRow key={m.label} m={m} index={i} />
            ))}
          </div>

          {/* Footer — provenance + the role-ready payoff */}
          <div className="flex items-center justify-between gap-2 border-t border-[var(--border-default)] px-4 py-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
              <BadgeCheck size={13} style={{ color: ORANGE }} />
              Re-assessed on live benchmarks
            </span>
            <motion.span
              className="inline-flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-primary)]"
              style={{ backgroundColor: "var(--color-brand-orange-subtle)" }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.4, delay: settleDelay, ease: EASE }
              }
            >
              <Trophy size={11} strokeWidth={2.5} style={{ color: ORANGE }} aria-hidden />
              Role-ready
            </motion.span>
          </div>
          </div>
        </motion.div>
      </div>

      <FloatBadge className="left-4 top-5" delay={0.2}>
        <BookOpen size={14} style={{ color: ORANGE }} />
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
          Role-aligned upskilling
        </span>
      </FloatBadge>
    </div>
  )
}
