"use client"

// Section 8 — Case Studies.
// Three case-study cards stacked via CSS sticky + a drawer-shrink
// animation driven by framer-motion. Two card types are supported:
//   • Text only — closes with a "Read the story" link.
//   • Video    — closes with a "Watch the story" button that opens a
//                modal video player (full HTML5 <video> with controls).
// A "View all case studies" CTA sits below the stack.

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ArrowRight, Play, X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CaseStudyVideo {
  src: string
  poster?: string
}

interface CaseStudy {
  id: string
  eyebrow: string
  quote: string
  author: { initials: string; name: string; role: string }
  stats: { value: string; label: string }[]
  href: string
  /** Present on video-type case studies; opens the player modal. */
  video?: CaseStudyVideo
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "infosys",
    eyebrow: "Infosys · campus hiring at scale",
    quote:
      "Three weeks of shortlisting became two days. The audit trail alone saved us from two escalations.",
    author: {
      initials: "RK",
      name: "Rhea Kapoor",
      role: "Head of Campus Hiring · Infosys",
    },
    stats: [
      { value: "8,000+", label: "candidates per drive" },
      { value: "48 hr",  label: "JD to shortlist" },
      { value: "42",     label: "Q1 offers placed" },
    ],
    href: "/case-studies/infosys",
    video: {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster:
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    id: "mahindra",
    eyebrow: "Mahindra Group · tier-blind discovery",
    quote:
      "A Tier-3 engineer out-scored every IIT résumé on file. We made the hire.",
    author: {
      initials: "KI",
      name: "Karthik Iyer",
      role: "VP Talent · Mahindra Group",
    },
    stats: [
      { value: "42%",  label: "hires beyond Tier-1 metros" },
      { value: "6.8×", label: "sourcing pool reach" },
      { value: "100%", label: "audit-clean drives" },
    ],
    href: "/case-studies/mahindra",
  },
  {
    id: "genpact",
    eyebrow: "Genpact · recruiter productivity",
    quote:
      "Same recruiter team, double the offers landed. The math changed.",
    author: {
      initials: "AK",
      name: "Anjali Kapoor",
      role: "Senior Director, Talent · Genpact",
    },
    stats: [
      { value: "2.4×",  label: "offers per recruiter" },
      { value: "48 hr", label: "median JD-to-shortlist" },
      { value: "0",     label: "SDRs added this year" },
    ],
    href: "/case-studies/genpact",
    video: {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster:
        "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80",
    },
  },
]

interface CaseStudiesProps {
  /** Optional override for the section heading. Defaults to the
   *  current marketing copy; the AI-narrative variant passes a custom
   *  heading via this prop. */
  heading?: string
  /** Optional override for the section subhead. Same defaulting. */
  subhead?: string
}

export function CaseStudies({
  heading = "Hires that closed because of the network.",
  subhead = "Three teams. Three hiring problems. Same network underneath.",
}: CaseStudiesProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openVideoId, setOpenVideoId] = useState<string | null>(null)
  const openVideoCase = CASE_STUDIES.find((c) => c.id === openVideoId)

  // ESC + body scroll lock while the player is open.
  useEffect(() => {
    if (!openVideoId) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenVideoId(null)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [openVideoId])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const total = CASE_STUDIES.length

  return (
    <>
      <section
        id="case-studies"
        data-section-bg="light"
        aria-labelledby="case-studies-heading"
        className="border-t border-[var(--border-default)] py-28 lg:py-36"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          {/* Header */}
          <div className="max-w-2xl">
            <p className="font-sans text-xs text-[var(--text-muted)]">
              Case studies
            </p>
            <h2
              id="case-studies-heading"
              className="mt-2 text-[clamp(32px,4.2vw,48px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]"
            >
              {heading}
            </h2>
            <p className="mt-5 max-w-[52ch] text-base leading-[1.55] text-[var(--text-body)] lg:text-[17px]">
              {subhead}
            </p>
          </div>

          {/* Drawer stack — pb-8 keeps just enough runway for the last
              card to release sticky cleanly before the CTA appears. */}
          <div ref={containerRef} className="mt-16 space-y-16 pb-8">
            {CASE_STUDIES.map((c, i) => {
              const targetScale = 1 - (total - 1 - i) * 0.05
              const range: [number, number] = [i / total, 1]
              return (
                <DrawerCard
                  key={c.id}
                  data={c}
                  index={i}
                  progress={scrollYProgress}
                  range={range}
                  targetScale={targetScale}
                  onOpenVideo={() => setOpenVideoId(c.id)}
                />
              )
            })}
          </div>

          {/* View all */}
          <div className="mt-4 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/case-studies">
                View all case studies
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video popup */}
      <AnimatePresence>
        {openVideoCase?.video ? (
          <VideoModal
            key="video-modal"
            video={openVideoCase.video}
            label={`${openVideoCase.author.name} · ${openVideoCase.eyebrow}`}
            onClose={() => setOpenVideoId(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}

interface DrawerCardProps {
  data: CaseStudy
  index: number
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
  onOpenVideo: () => void
}

function DrawerCard({
  data,
  index,
  progress,
  range,
  targetScale,
  onOpenVideo,
}: DrawerCardProps) {
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      className="sticky"
      style={{
        top: `${112 + index * 28}px`,
        zIndex: index + 1,
      }}
    >
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className="rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-md lg:p-10"
      >
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* Quote + author */}
          <figure>
            <p className="font-sans text-xs text-[var(--text-muted)]">
              {data.eyebrow}
            </p>
            <blockquote className="mt-5 text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--text-primary)]">
              &ldquo;{data.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[var(--bg-brand-subtle)] text-sm font-semibold text-[var(--color-primary-700)]">
                {data.author.initials}
              </div>
              <div>
                {/* Name + (optional) play action sit on one line so the
                    video affordance reads as belonging to this person. */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {data.author.name}
                  </p>
                  {data.video ? (
                    <button
                      type="button"
                      onClick={onOpenVideo}
                      aria-label={`Watch ${data.author.name}'s story`}
                      title={`Watch ${data.author.name}'s story`}
                      className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm bg-[var(--bg-accent-subtle)] text-[var(--color-primary-700)] transition-colors hover:bg-[var(--color-primary-100)]"
                    >
                      <Play size={11} fill="currentColor" strokeWidth={0} />
                    </button>
                  ) : null}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {data.author.role}
                </p>
              </div>

              <Link
                href={data.href}
                className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-brand)] underline-offset-4 hover:underline"
              >
                Read more
                <ArrowRight size={14} />
              </Link>
            </figcaption>
          </figure>

          {/* Stats */}
          <dl className="grid grid-cols-1 gap-6 border-t border-[var(--border-default)] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {data.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[clamp(28px,3.2vw,36px)] font-bold leading-none tracking-[-0.02em] tabular-nums text-[var(--text-primary)]">
                  {s.value}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-[var(--text-body)]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.article>
    </div>
  )
}

// ─── Video modal ────────────────────────────────────────────────────

interface VideoModalProps {
  video: CaseStudyVideo
  label: string
  onClose: () => void
}

function VideoModal({ video, label, onClose }: VideoModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-12"
    >
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Player container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Close button — above the player */}
        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/65">
            {label}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video frame */}
        <div className="overflow-hidden rounded-md border border-white/[0.10] bg-black shadow-lg">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={video.src}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            className="aspect-video w-full"
          />
        </div>
      </motion.div>
    </div>
  )
}
