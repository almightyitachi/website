"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { CornerPlus } from "@/components/marketing/CornerPlus"
import { MobileCaseStudyCarousel } from "@/components/marketing/MobileCaseStudyCarousel"

// Framed cell: a card floats inside with a margin, "+" markers
// mark the cell corners (they fall in the gutters between cards), and on hover
// the card squares its corners and fills the cell to the grid lines (padding →
// 0). Pair with `h-full ... group-hover/cell:rounded-none` on the card inside.
function FramedCell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group/cell relative border-l border-t border-[var(--border-default)] bg-[var(--bg-page)] p-2 transition-[padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:p-0 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
      <CornerPlus />
    </div>
  )
}

// ─── Data ───────────────────────────────────────────────────────────────

interface InstituteReview {
  institute: string
  quote: string
  author: { name: string; role: string }
  stat: { value: string; label: string }
}

const REVIEWS: InstituteReview[] = [
  {
    institute: "VIT Vellore",
    quote:
      "Before PluginLive, we managed placements on spreadsheets and WhatsApp groups. Now every drive invitation, student response, and outcome is tracked in one dashboard.",
    author: { name: "Dr. Rajesh Menon", role: "Training & Placement Officer" },
    stat: { value: "+34%", label: "placement rate lift" },
  },
  {
    institute: "SRM University",
    quote:
      "Recruiters now shortlist our students on verified, ranked skill profiles, not just CVs. Twelve new companies ran campus drives with us this year.",
    author: { name: "Prof. Sunita Deshmukh", role: "Placement Director" },
    stat: { value: "12", label: "new companies in year one" },
  },
  {
    institute: "Graphic Era University",
    quote:
      "Assessments run on students' own devices. We stopped booking computer labs entirely. Two weeks of scheduling saved per drive.",
    author: { name: "Arun Krishnamurthy", role: "Training & Placement Officer" },
    stat: { value: "2 wk", label: "scheduling time saved" },
  },
  {
    institute: "JBIMS",
    quote:
      "Outcome reporting took three weeks to compile. Now it generates in real time: placement rate, gender split, tier distribution.",
    author: { name: "Dr. Meera Iyer", role: "Dean of Placements" },
    stat: { value: "Real-time", label: "board-ready reporting" },
  },
]

// Real institute marks, scrolled at their native colours (no greyscale, no
// hover). Assets live in /public/institute-marquee — a separate folder from
// /institutes, so the /institutes/:path* → /place/:path* redirect can't shadow
// them into 404s.
const INSTITUTE_LOGOS: { name: string; src?: string }[] = [
  { name: "Naralkar Institute", src: "/institute-marquee/institute-marquee-logos01.png" },
  { name: "Delhi Technological University", src: "/institute-marquee/institute-marquee-logos02.png" },
  { name: "Swadha Foundation", src: "/institute-marquee/institute-marquee-logos03.png" },
  { name: "JBIMS", src: "/institute-marquee/institute-marquee-logos04.png" },
  { name: "Vishwakarma Institutes", src: "/institute-marquee/institute-marquee-logos05.png" },
  { name: "Thapar Institute", src: "/institute-marquee/institute-marquee-logos06.png" },
  { name: "Graphic Era University", src: "/institute-marquee/institute-marquee-logos07.png" },
  { name: "VIT", src: "/institute-marquee/institute-marquee-logos08.png" },
  { name: "REC", src: "/institute-marquee/institute-marquee-logos09.png" },
  { name: "SRM", src: "/institute-marquee/institute-marquee-logos10.png" },
]

// Render the set twice in the track and translate -50% for a seamless loop.
const MARQUEE_LOGOS = INSTITUTE_LOGOS

// ─── Component ──────────────────────────────────────────────────────────

export function CandidateVoices() {
  const featured = REVIEWS[0]
  const highlight = REVIEWS[1]
  const card3 = REVIEWS[2]
  const card4 = REVIEWS[3]

  // Mobile carousel — every review as one uniform card.
  const mobileCards = REVIEWS.map((r) => ({
    tag: r.institute,
    statValue: r.stat.value,
    statLabel: r.stat.label,
    quote: r.quote,
    authorName: r.author.name,
    authorRole: r.author.role,
  }))

  return (
    <section
      data-section-bg="light"
      className="border-t border-[var(--border-default)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 pt-20 pb-4 lg:px-12 lg:pt-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]">
            And on the Institutes side
          </h2>
        </motion.div>

        {/* Institute logo marquee — heading on the left, logos scroll and fade
            out toward it; full-bleed framed band with detached corner crosses
            (mirrors the corporate case-study marquee). */}
        <div className="relative -mx-8 mb-10 border-y border-[var(--border-default)] lg:-mx-12">
          <CornerPlus />
          <div className="flex items-center gap-6 px-8 py-7 lg:gap-10 lg:px-12">
            <p className="w-[116px] shrink-0 text-[12.5px] font-medium leading-[1.35] text-[var(--text-muted)] sm:w-[150px] lg:w-[190px]">
              Trusted by placement teams at
            </p>
            <div
              className="relative min-w-0 flex-1 overflow-x-clip overflow-y-visible"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 9%, black 96%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 9%, black 96%, transparent 100%)",
              }}
            >
              <div className="ticker-track flex w-max items-center gap-12 whitespace-nowrap py-6">
                {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((logo, i) => (
                  <div
                    key={`${logo.name}-${i}`}
                    className="relative flex-shrink-0"
                  >
                    {logo.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-[76px] w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                        {logo.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card grid.
            Desktop: framed cells in one 4×2 grid (rails + corner
            crosses, snap-fill on hover). Mobile: a swipeable carousel of
            uniform cards (below). */}
        <div className="hidden lg:block">
        <div className="grid grid-cols-1 items-stretch border-b border-r border-[var(--border-default)] lg:grid-cols-4 lg:grid-rows-2">

          {/* Featured — cols 1–2, both rows */}
          <FramedCell className="lg:col-span-2 lg:row-span-2">
            <div className="flex h-full flex-col rounded-xl border border-[var(--border-default)] bg-white p-8 shadow-sm transition-[border-radius,box-shadow,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cell:rounded-none group-hover/cell:p-10 group-hover/cell:shadow-none motion-reduce:transition-none">
              <div>
                <p className="text-[clamp(40px,4vw,56px)] font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--text-primary)]">
                  {featured.stat.value}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {featured.stat.label}
                </p>
              </div>
              <p
                aria-hidden
                className="mt-6 text-[36px] font-bold leading-none text-[var(--color-primary-600)]"
              >
                &ldquo;
              </p>
              <blockquote className="mt-1 flex-1 text-[17px] leading-[1.75] text-[var(--text-body)]">
                {featured.quote}
              </blockquote>
              <div className="mt-8 flex items-center gap-3 border-t border-[var(--border-default)] pt-6">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-semibold text-[var(--color-primary-700)]">
                  {featured.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {featured.author.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {featured.author.role}, {featured.institute}
                  </p>
                </div>
              </div>
            </div>
          </FramedCell>

          {/* Top card — cols 3–4, row 1 */}
          <FramedCell className="lg:col-span-2">
              <div className="flex h-full flex-col rounded-xl border border-[var(--border-default)] bg-white p-6 shadow-sm transition-[border-radius,box-shadow,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cell:rounded-none group-hover/cell:p-8 group-hover/cell:shadow-none motion-reduce:transition-none">
                <div className="flex items-baseline gap-2">
                  <p className="text-[clamp(28px,3vw,40px)] font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--text-primary)]">
                    {highlight.stat.value}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {highlight.stat.label}
                  </p>
                </div>
                <p
                  aria-hidden
                  className="mt-4 text-[28px] font-bold leading-none text-[var(--color-primary-600)]"
                >
                  &ldquo;
                </p>
                <blockquote className="mt-1 text-[15px] leading-[1.7] text-[var(--text-body)]">
                  {highlight.quote}
                </blockquote>
                <div className="mt-5 flex items-center gap-2.5 border-t border-[var(--border-default)] pt-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-xs font-semibold text-[var(--color-primary-700)]">
                    {highlight.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {highlight.author.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {highlight.author.role}, {highlight.institute}
                    </p>
                  </div>
                </div>
              </div>
            </FramedCell>

          {/* Two compact cards — cols 3 and 4, row 2 */}
          {[card3, card4].map((r) => (
            <FramedCell key={r.institute}>
                  <div className="flex h-full flex-col rounded-xl border border-[var(--border-default)] bg-white p-5 shadow-sm transition-[border-radius,box-shadow,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cell:rounded-none group-hover/cell:p-7 group-hover/cell:shadow-none motion-reduce:transition-none">
                    <p
                      aria-hidden
                      className="text-[22px] font-bold leading-none text-[var(--color-primary-600)]"
                    >
                      &ldquo;
                    </p>
                    <blockquote className="mt-1 flex-1 text-[13px] leading-[1.65] text-[var(--text-body)]">
                      {r.quote}
                    </blockquote>
                    <div className="mt-4 flex items-center gap-2 border-t border-[var(--border-default)] pt-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[11px] font-semibold text-[var(--color-primary-700)]">
                        {r.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-primary)]">
                          {r.author.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {r.author.role}, {r.institute}
                        </p>
                      </div>
                    </div>
                  </div>
                </FramedCell>
              ))}
        </div>
        </div>{/* end desktop-only */}

        {/* Mobile — swipeable carousel of uniform cards inside a cross-framed cell */}
        <div className="lg:hidden">
          <MobileCaseStudyCarousel items={mobileCards} />
        </div>

        {/* Bottom social-proof bar */}
        <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border-default)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-primary)]">540+</span>{" "}
            partner institutes across India
          </p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className="fill-[var(--color-brand-amber)] text-[var(--color-brand-amber)]"
              />
            ))}
            <span className="ml-1 text-sm font-semibold text-[var(--text-primary)]">4.8</span>
            <span className="text-sm text-[var(--text-muted)]">from TPO feedback</span>
          </div>
        </div>
      </div>
    </section>
  )
}
