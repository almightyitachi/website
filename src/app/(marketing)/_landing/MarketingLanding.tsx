"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  Clock,
  Crosshair,
  Filter,
  Globe,
  GraduationCap,
  ListChecks,
  MapPin,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"

import { type HeroVariant } from "../_components/AnimatedHeroV3"
import { CandidateVoices } from "../_components/CandidateVoices"
import { CaseStudies } from "../_components/CaseStudies"
import { CaseStudiesShowcase } from "../_components-v6/CaseStudiesShowcase"
import { DataSecuritySection } from "../_components-v6/DataSecuritySection"
import { EditorialPullQuote } from "../_components-v6/EditorialPullQuote"
import { EveryStageOfHire } from "../_components-v6/EveryStageOfHire"
// Temporarily hidden — see GoLiveTimeline render site below.
// import { GoLiveTimeline } from "../_components-v6/GoLiveTimeline"
import { HireStageCards } from "../_components-v6/HireStageCards"
import { ScrollFillStatement } from "../_components-v6/ScrollFillStatement"
import {
  InfrastructureLayers,
  IsometricLayerCube,
  type LayerId,
} from "../_components-v6/InfrastructureLayers"
import { IntelligenceBeam } from "../_components-v6/IntelligenceBeamCard"
import { NetworkCards } from "../_components-v6/NetworkCards"
import { ScaledGraphic } from "../_components-v6/ScaledGraphic"
import { IndiaTalentMap } from "../_components/IndiaTalentMap"
import { TrustLogoMarquee } from "../_components/TrustLogoMarquee"

import { CapabilityFeaturesAi } from "../_components-ai/CapabilityFeaturesAi"
import { HirePlaceTrainCards } from "../_components-ai/HirePlaceTrainCards"

// V3 landing page — an alternate L1 surface keyed by NarrativeContext's
// "v3" variant. Same design system, six sections in order:
//   1 Hero          — shared shell (grid bg + floating avatars) with
//                     "Hire at every altitude." copy and a single
//                     Schedule-a-Walkthrough primary CTA.
//   2 Marketplace   — three-node semicircle bridge with trust-logo
//                     marquee + 4-up anchor stats (first cobalt, rest
//                     dark per design rule).
//   3 AI Layer      — dark band with signal-filter visual + 3 proof
//                     cards.
//   4 Platform      — 5-step pipeline with centered arrows between
//                     compact step cards + 2-column features.
//   5 Case Studies  — shared CaseStudies component (unchanged).
//   6 Voices        — shared CandidateVoices component (unchanged).

const EASE = [0.16, 1, 0.3, 1] as const

// Module-level variants reused across V3 sections. The container fades
// nothing itself; it owns the timing — when the section crosses the
// viewport threshold, children stagger in 100ms apart, each fading up
// 18px over 550ms on the shared ease-out-expo curve. Keeps the motion
// grammar uniform across every section.
const V3_STAGGER_CONTAINER = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const V3_FADE_UP = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
}

// V3-wide eyebrow — cobalt accent + a leading lucide icon for each
// section. Renders cobalt-600 on light surfaces and cobalt-300 on dark
// surfaces (the section passes `dark` accordingly). Same font-mono /
// uppercase / tracking treatment as the design-system `Eyebrow` so it
// stays in the existing rhythm.
function GuideLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0 mx-auto max-w-[1440px]">
      <div className="absolute inset-y-0 left-4 w-px bg-[var(--bg-surface)] sm:left-6 xl:left-0" />
      <div className="absolute inset-y-0 right-4 w-px bg-[var(--bg-surface)] sm:right-6 xl:right-0" />
    </div>
  )
}

interface MarketingLandingProps {
  onScheduleClick?: () => void
  heroVariant?: LandingHeroVariant
  // When true, the in-section design toggles are shown so every alternate
  // layout stays reachable for internal comparison. Production (`/`) leaves
  // this off and renders only the finalized variations: italic + bell hero
  // (Section 1), "Explore" for Section 3 (Hiring Stack), and "Infrastructure" for
  // Section 4. The discarded variations (regular/ascending hero, Levels/Stages,
  // Ecosystem) live on /other-variations-landing-page, which passes this flag.
  // Full section map: docs/landing-sections.md.
  showSectionVariants?: boolean
}

export function MarketingLanding({
  onScheduleClick,
  heroVariant = "light",
  showSectionVariants = false,
}: MarketingLandingProps = {}) {
  const heroIsDark = heroVariant === "dark"

  return (
    <main className="relative isolate overflow-x-clip bg-[var(--bg-page)] font-sans">
      {/* Sticky scope — hero sticks only while section 2 is covering it.
          The wrapper div is the sticky containing block; once its bottom
          clears the viewport the hero un-sticks and the rest scrolls normally. */}
      <div>
        <LandingHero
          variant={heroVariant}
          onScheduleClick={onScheduleClick}
          showVariantToggle={showSectionVariants}
        />
        {heroVariant === "gradient" && <ScrollFillStatement />}
        <AltitudesSection heroVariant={heroVariant} showVariantToggle={showSectionVariants} />
      </div>
      {heroVariant === "gradient" && <InfrastructureSection showVariantToggle={showSectionVariants} />}
      {heroVariant !== "gradient" && <V3Marketplace />}
      {heroVariant !== "gradient" && <V3AILayer />}
      {heroVariant !== "gradient" && <V3TrustAndStats />}
      {heroVariant === "gradient" ? (
        <HirePlaceTrainCards />
      ) : (
        <CapabilityFeaturesAi heroIsDark={heroIsDark} />
      )}
      {/* Temporarily hidden — "From JD to a ranked shortlist, in 48 hours." */}
      {/* {heroVariant === "gradient" && <GoLiveTimeline />} */}
      <CaseStudiesShowcase />
      {heroVariant === "gradient" && <EditorialPullQuote />}
      <CandidateVoices />
      {heroVariant === "gradient" && <DataSecuritySection />}
      <WalkthroughCta onScheduleClick={onScheduleClick} />
    </main>
  )
}

// ─── 1 · Hero — centred editorial stack with a 3-way theme toggle ─────

// V3 extends the upstream HeroVariant ("light" | "dark") with an "image"
// option that swaps the editorial centred layout for a left-anchored
// composition with a watercolor mountain SVG on the right (Sakata-style
// reference). The variant reads as a *light* surface for downstream
// chrome (Section 5 theming) because the mountain sits on white.
export type LandingHeroVariant = HeroVariant | "image" | "gradient"

interface LandingHeroProps {
  variant: LandingHeroVariant
  onScheduleClick?: () => void
  showVariantToggle?: boolean
}

function LandingHero({ variant, onScheduleClick, showVariantToggle = false }: LandingHeroProps) {
  return (
    <div className="relative sticky top-0 z-0">
      <V2HeroSection
        variant={variant}
        onScheduleClick={onScheduleClick}
        showVariantToggle={showVariantToggle}
      />
    </div>
  )
}

// V2 hero — grid backdrop plus a centred editorial stack: eyebrow,
// headline with a static accent word, subhead, CTAs. A "Learn more"
// chevron at the bottom drops the user into the next section.

function V2HeroSection({
  variant,
  onScheduleClick,
  showVariantToggle = false,
}: {
  variant: LandingHeroVariant
  onScheduleClick?: () => void
  showVariantToggle?: boolean
}) {
  // Image variant gets a fundamentally different layout (full-bleed
  // stock photo, giant cycling word at top, headline + tagline pinned
  // bottom-left, proof card pinned bottom-right), so we branch out
  // rather than threading isImage through every node below.
  if (variant === "image") {
    return <V2ImageHero onScheduleClick={onScheduleClick} />
  }
  if (variant === "gradient") {
    return <GradientBarHero showVariantToggle={showVariantToggle} />
  }
  return <V2EditorialHero variant={variant} onScheduleClick={onScheduleClick} />
}

// Light / dark editorial hero — centred eyebrow + headline stack, the
// established V3 narrative surface. Was the only V2 hero before the
// image variant was introduced.

function V2EditorialHero({
  variant,
  onScheduleClick,
}: {
  variant: Exclude<LandingHeroVariant, "image">
  onScheduleClick?: () => void
}) {
  const reduce = useReducedMotion()
  const isDark = variant === "dark"
  const scrollToNext = () => {
    document
      .getElementById("altitudes")
      ?.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <section
      data-section-bg={isDark ? "dark" : "light"}
      className={cn(
        "relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-32 lg:px-12 lg:py-40",
        isDark ? "bg-[var(--bg-brand)]" : "bg-[var(--bg-page)]",
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Dark-variant aurora — a soft cobalt radial that breathes at
            hero top-centre. Signals "the network is live" without the
            flashiness of a moving gradient mesh. */}
        {isDark && !reduce && (
          <motion.div
            className="absolute left-1/2 top-[-20%] h-[80%] w-[90%] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(73,79,223,0.22), rgba(73,79,223,0.06) 38%, transparent 72%)",
              filter: "blur(40px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.04, 1] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              opacity: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        )}

        <GridPattern
          width={48}
          height={48}
          squares={[
            [3, 4],  [7, 2],  [11, 6], [4, 9],
            [9, 11], [14, 4], [17, 10],[21, 7],
            [25, 3], [28, 9], [6, 14], [19, 13],
          ]}
          className={cn(
            "inset-0 h-full [mask-image:linear-gradient(to_bottom,black_0%,black_60%,rgba(0,0,0,0.45)_82%,transparent_98%)]",
            isDark
              ? "stroke-white/[0.06] fill-white/[0.06]"
              : "stroke-[var(--color-neutral-200)] fill-[var(--color-neutral-200)]",
          )}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        {/* Headline — two-part choreography: the base line lifts first,
            then the cobalt accent word reveals via clip-path (left to
            right), followed by a hairline stamp that confirms placement
            and dissolves. The signature gesture of the surface. */}
        <h1
          className={cn(
            "text-[clamp(40px,6.6vw,84px)] leading-[1.04] tracking-[-0.025em]",
            isDark ? "text-white" : "text-[var(--text-primary)]",
          )}
        >
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              delay: reduce ? 0 : 0.15,
              ease: EASE,
            }}
            className="inline-block font-bold"
          >
            Hire at every{" "}
          </motion.span>
          <motion.span
            initial={
              reduce
                ? { opacity: 1 }
                : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
            }
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: reduce ? 0 : 0.8,
              delay: reduce ? 0 : 0.36,
              ease: EASE,
            }}
            className={cn(
              // pb + -mb keep the clip-path wipe from cropping glyph bottoms.
              "relative inline-block pb-[0.2em] -mb-[0.2em] font-[900]",
              isDark
                ? "text-[var(--color-primary-300)]"
                : "text-[var(--color-primary-600)]",
            )}
          >
            Altitude
            {!reduce && (
              <motion.span
                aria-hidden
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: [1, 1, 0] }}
                transition={{
                  duration: 1.6,
                  delay: 1.06,
                  times: [0, 0.35, 1],
                  ease: EASE,
                }}
                className={cn(
                  "absolute -bottom-0.5 left-0 right-2 h-[2px] origin-left rounded-full",
                  isDark
                    ? "bg-[var(--color-primary-300)]"
                    : "bg-[var(--color-primary-600)]",
                )}
              />
            )}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.55,
            delay: reduce ? 0 : 0.54,
            ease: EASE,
          }}
          className={cn(
            "mx-auto max-w-2xl text-base leading-[1.55] lg:text-[19px]",
            isDark ? "text-white/70" : "text-[var(--text-body)]",
          )}
        >
          Ranked shortlists from campus to C-suite. Proctored, scored, and audit-ready in 48 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            delay: reduce ? 0 : 0.7,
            ease: EASE,
          }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {onScheduleClick ? (
            <Button type="button" size="lg" onClick={onScheduleClick}>
              Schedule a Walkthrough
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="#book">Schedule a Walkthrough</Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn(
              "group",
              isDark &&
                "border-white/20 bg-white/[0.05] text-white shadow-none hover:bg-white/[0.10] hover:text-white",
            )}
          >
            <Link href="#v3-institutions">
              For Institutes &amp; NGOs
              <ArrowRight
                size={16}
                className="ml-1 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Bottom-of-hero "Learn more" scroll affordance — entrance fades
          in last, then a slow bob loops infinitely. Hover lifts the
          colour to brand emphasis. */}
      <motion.button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to learn more"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduce ? 0 : 0.5,
          delay: reduce ? 0 : 0.9,
          ease: EASE,
        }}
        className={cn(
          "group absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2",
          isDark
            ? "text-white/55 hover:text-white focus-visible:ring-offset-[var(--bg-brand)]"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
        )}
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
            Learn more
          </span>
          <ChevronDown
            size={18}
            strokeWidth={2}
            aria-hidden
            className={cn(
              "transition-colors duration-200",
              isDark
                ? "group-hover:text-[var(--color-primary-300)]"
                : "group-hover:text-[var(--color-primary-600)]",
            )}
          />
        </motion.span>
      </motion.button>
    </section>
  )
}

// Image-variant hero — full-bleed stock photo with two anchored zones
// on the left edge: an editorial "Hire at every / ALTITUDE." block
// at the top, and an elaborated description + CTAs at the base. A glass
// proof card pins the bottom-right.

const V3_HERO_PHOTO_URL =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"

const V3_HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"

const V3_HERO_PROOF_AVATARS: Array<{ initials: string; tint: string }> = [
  { initials: "SR", tint: "bg-[var(--color-primary-600)]" },
  { initials: "AK", tint: "bg-[var(--color-brand-navy)]" },
  { initials: "MV", tint: "bg-[var(--color-brand-amber)]" },
]

// Seamless two-phase loop:
//   Phase 1 — PREROLL  (2 s before A ends): B starts playing at opacity 0
//             so it has time to buffer and produce frames before the dissolve.
//   Phase 2 — CROSSFADE (1 s before A ends): opacity swap triggers a 1 s
//             CSS dissolve. A is paused and reset after the dissolve completes,
//             ready for the next cycle.
// This eliminates both the black-frame glitch (native loop seek) and the
// "B appears blank" flash (starting B too late).

const PREROLL_S     = 2.0   // seconds before end to silently start standby video
const CROSSFADE_S   = 1.0   // seconds before end to begin the opacity dissolve
const CROSSFADE_MS  = 1000  // dissolve duration (must match CSS transition below)

function SeamlessLoopVideo({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const [opacityA, setOpacityA] = useState(1)
  const [opacityB, setOpacityB] = useState(0)

  useEffect(() => {
    const a = aRef.current
    const b = bRef.current
    if (!a || !b) return
    const videoA: HTMLVideoElement = a
    const videoB: HTMLVideoElement = b

    type Phase = "playing" | "preroll" | "crossfading"
    let active: "a" | "b" = "a"
    let phase: Phase = "playing"

    function onTimeUpdate() {
      if (phase === "crossfading") return
      const curr = active === "a" ? videoA : videoB
      const next = active === "a" ? videoB : videoA
      if (!curr.duration) return
      const remaining = curr.duration - curr.currentTime

      if (phase === "playing" && remaining <= PREROLL_S) {
        // Phase 1: start standby video silently so it's already delivering frames
        phase = "preroll"
        next.currentTime = 0
        next.play().catch(() => {})
        return
      }

      if (phase === "preroll" && remaining <= CROSSFADE_S) {
        // Phase 2: dissolve from active → standby
        phase = "crossfading"
        const nextActive = active === "a" ? "b" : "a"
        if (nextActive === "b") { setOpacityA(0); setOpacityB(1) }
        else                    { setOpacityA(1); setOpacityB(0) }

        setTimeout(() => {
          // Dissolve complete — reset the old video and hand off
          ;(active === "a" ? videoA : videoB).pause()
          ;(active === "a" ? videoA : videoB).currentTime = 0
          active = nextActive
          phase  = "playing"
        }, CROSSFADE_MS + 150)
      }
    }

    videoA.addEventListener("timeupdate", onTimeUpdate)
    videoB.addEventListener("timeupdate", onTimeUpdate)
    return () => {
      videoA.removeEventListener("timeupdate", onTimeUpdate)
      videoB.removeEventListener("timeupdate", onTimeUpdate)
    }
  }, [])

  const transition = `opacity ${CROSSFADE_MS}ms ease-in-out`

  return (
    <div className={cn("relative", className)}>
      <video
        ref={aRef}
        src={src}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: opacityA, transition }}
      />
      <video
        ref={bRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: opacityB, transition }}
      />
    </div>
  )
}

// ─── V4 · Gradient-bar hero ────────────────────────────────────────────
// Fifteen vertical bars, tallest at the centre and tapering toward the
// edges (quadratic falloff). Each bar is a bottom-anchored gradient that
// fades from a dark-primary shade upward to transparent, so the bars read
// as structured depth on the near-black brand surface rather than bright
// decoration. A staggered pulseBar CSS animation makes them breathe.

const BAR_GRADIENT_COLORS = [
  "var(--color-primary-900)",
  "var(--color-primary-800)",
  "var(--color-primary-900)",
  "var(--color-primary-700)",
  "var(--color-primary-800)",
  "var(--color-primary-900)",
  "var(--color-primary-700)",
  "var(--color-primary-800)",
  "var(--color-primary-700)",
  "var(--color-primary-900)",
  "var(--color-primary-800)",
  "var(--color-primary-700)",
  "var(--color-primary-900)",
  "var(--color-primary-800)",
  "var(--color-primary-900)",
] as const

const BAR_ENTRANCE_VARIANTS = {
  hidden: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function GradientBars({ reduce }: { reduce: boolean | null }) {
  const BAR_COUNT = BAR_GRADIENT_COLORS.length
  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 flex h-[70vh] items-end justify-center gap-1.5 overflow-hidden px-4 sm:gap-2 sm:px-8 lg:gap-2.5 lg:px-12"
      initial={!!reduce ? false : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
      }}
    >
      {BAR_GRADIENT_COLORS.map((color, i) => {
        const center = (BAR_COUNT - 1) / 2
        const dist = Math.abs(i - center) / center // 0 at centre, 1 at edges
        const height = 12 + (1 - dist * dist) * 83 // 12 % → 95 % of container
        const duration = 2.4 + (i % 4) * 0.35
        const delay = i * 0.12
        const shineDuration = 12 + (i % 3) * 2
        const shineDelay = -(i * 1.1) // negative = bar is mid-cycle on load, staggered
        return (
          <motion.div
            key={i}
            variants={BAR_ENTRANCE_VARIANTS}
            className={cn(
              "relative flex-1 overflow-hidden rounded-t-[2px]",
              // On mobile, drop every other bar so the surviving 7 bars render
              // at roughly the width they have on desktop (where all 15 fit
              // comfortably). Hiding the even indices samples the set evenly
              // and, for the bell, keeps it symmetric with the centre peak.
              i % 2 === 0 && "hidden sm:block",
            )}
            style={{
              height: `${height}%`,
              background: `linear-gradient(to top, ${color}, transparent)`,
              animation: reduce
                ? "none"
                : `pulseBar ${duration}s ease-in-out ${delay}s infinite`,
            }}
          >
            {/* Per-bar shine — clipped to this bar's bounds by overflow-hidden */}
            {!reduce && (
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  width: "200%",
                  height: "200%",
                  top: "-50%",
                  left: "-50%",
                  background:
                    "linear-gradient(135deg, transparent 42%, rgba(255,255,255,0.025) 48%, rgba(255,255,255,0.045) 50%, rgba(255,255,255,0.025) 52%, transparent 58%)",
                  animation: `shineSweep ${shineDuration}s linear ${shineDelay}s infinite`,
                }}
              />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

function AscendingBars({ reduce }: { reduce: boolean | null }) {
  const BAR_COUNT = BAR_GRADIENT_COLORS.length
  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 flex h-[70vh] items-end justify-center gap-1.5 overflow-hidden px-4 sm:gap-2 sm:px-8 lg:gap-2.5 lg:px-12"
      initial={!!reduce ? false : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
      }}
    >
      {BAR_GRADIENT_COLORS.map((color, i) => {
        const height = 10 + (i / (BAR_COUNT - 1)) * 85
        const duration = 2.4 + (i % 4) * 0.35
        const delay = i * 0.12
        const shineDuration = 12 + (i % 3) * 2
        const shineDelay = -(i * 1.1)
        return (
          <motion.div
            key={i}
            variants={BAR_ENTRANCE_VARIANTS}
            className={cn(
              "relative flex-1 overflow-hidden rounded-t-[2px]",
              // On mobile, drop every other bar so the surviving 7 bars render
              // at roughly the width they have on desktop (where all 15 fit
              // comfortably). Hiding the even indices samples the set evenly
              // and, for the bell, keeps it symmetric with the centre peak.
              i % 2 === 0 && "hidden sm:block",
            )}
            style={{
              height: `${height}%`,
              background: `linear-gradient(to top, ${color}, transparent)`,
              animation: reduce
                ? "none"
                : `pulseBar ${duration}s ease-in-out ${delay}s infinite`,
            }}
          >
            {!reduce && (
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  width: "200%",
                  height: "200%",
                  top: "-50%",
                  left: "-50%",
                  background:
                    "linear-gradient(135deg, transparent 42%, rgba(255,255,255,0.025) 48%, rgba(255,255,255,0.045) 50%, rgba(255,255,255,0.025) 52%, transparent 58%)",
                  animation: `shineSweep ${shineDuration}s linear ${shineDelay}s infinite`,
                }}
              />
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Rotating verbs for the hero first line — "Hire / Assess / Grow" cycle
// above the static serif "Altitude". "Assess" is the widest, so it sizes the
// fixed slot below and "at every" never shifts as the word changes.
const HERO_VERBS = ["Hire", "Assess", "Grow"] as const

function GradientBarHero({
  showVariantToggle = false,
}: {
  showVariantToggle?: boolean
}) {
  // Finalized hero: italic headline + bell-curve bars. The italic/regular and
  // bell/ascending toggles only surface on the variations page; production
  // locks to the finalized pair below.
  const [altStyle, setAltStyle] = useState<"italic" | "regular">("italic")
  const [barStyle, setBarStyle] = useState<"bell" | "ascending">("bell")
  const altEnteredRef = useRef(false)
  const reduce = useReducedMotion()
  // Cycle the leading verb every ~1.5s; reduced-motion pins to the first word.
  const [verbIndex, setVerbIndex] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = setTimeout(
      () => setVerbIndex((v) => (v + 1) % HERO_VERBS.length),
      1500,
    )
    return () => clearTimeout(id)
  }, [verbIndex, reduce])
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  // Bars travel up faster than the viewport scroll — deeper parallax depth.
  const barsY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "22%"],
  )
  // Content drifts up more slowly so it stays legible through the scroll.
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "8%"],
  )

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg-brand)]"
    >
      {/* Gradient-bar visualization — parallax layer, travels faster than scroll */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ y: barsY }}
      >
        <AnimatePresence mode="wait">
          {barStyle === "bell" ? (
            <motion.div key="bell" className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <GradientBars reduce={reduce} />
            </motion.div>
          ) : (
            <motion.div key="ascending" className="h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <AscendingBars reduce={reduce} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle top vignette so the toggle is legible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-black/40 to-transparent"
      />

      {/* Seam — blends into AltitudesSection below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 bg-gradient-to-b from-transparent to-[var(--bg-brand)]"
      />

      {/* Centred editorial block — drifts up at a slower rate */}
      <motion.div
        style={{ y: contentY }}
        className="absolute inset-0 z-[20] flex flex-col items-center justify-center px-4 text-center md:px-8"
      >
        {showVariantToggle && (
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-md bg-white/[0.08] p-1">
              <button
                type="button"
                onClick={() => { altEnteredRef.current = true; setAltStyle("italic") }}
                className={cn(
                  "rounded-sm px-3 py-1 text-xs font-medium transition-colors",
                  altStyle === "italic" ? "bg-white/[0.18] text-white" : "text-white/45 hover:text-white/70",
                )}
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => { altEnteredRef.current = true; setAltStyle("regular") }}
                className={cn(
                  "rounded-sm px-3 py-1 text-xs font-medium transition-colors",
                  altStyle === "regular" ? "bg-white/[0.18] text-white" : "text-white/45 hover:text-white/70",
                )}
              >
                Regular
              </button>
            </div>
            <div className="inline-flex items-center gap-1 rounded-md bg-white/[0.08] p-1">
              <button
                type="button"
                onClick={() => setBarStyle("bell")}
                className={cn(
                  "rounded-sm px-3 py-1 text-xs font-medium transition-colors",
                  barStyle === "bell" ? "bg-white/[0.18] text-white" : "text-white/45 hover:text-white/70",
                )}
              >
                Bell
              </button>
              <button
                type="button"
                onClick={() => setBarStyle("ascending")}
                className={cn(
                  "rounded-sm px-3 py-1 text-xs font-medium transition-colors",
                  barStyle === "ascending" ? "bg-white/[0.18] text-white" : "text-white/45 hover:text-white/70",
                )}
              >
                Ascending
              </button>
            </div>
          </div>
        )}
        <h1 className="leading-[0.9] tracking-[-0.025em]">
          <motion.span
            className="mb-0 block font-sans text-[clamp(32px,8.5vw,64px)] font-semibold text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.2, ease: EASE }}
          >
            {/* Verb slot — fixed to the widest word so "at every" never
                shifts. The outer span keeps a normal text baseline (no
                overflow) so the rotating verbs sit on the exact baseline as
                "at every"; clipping of the sliding words happens on the inner
                absolute layer, which doesn't perturb the outer baseline. */}
            <span className="relative inline-block align-baseline">
              <span aria-hidden className="invisible">
                Assess
              </span>
              <span aria-hidden className="absolute inset-0 overflow-hidden">
                {HERO_VERBS.map((verb, i) => (
                  <motion.span
                    key={verb}
                    aria-hidden={verbIndex !== i}
                    className="absolute inset-0 flex items-start justify-end"
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={
                      verbIndex === i
                        ? { y: "0%", opacity: 1 }
                        : { y: verbIndex > i ? "-150%" : "150%", opacity: 0 }
                    }
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.38, bounce: 0.18 }
                    }
                  >
                    {verb}
                  </motion.span>
                ))}
              </span>
            </span>{" "}
            at every
          </motion.span>
          <AnimatePresence mode="wait">
            {altStyle === "italic" ? (
              <motion.span
                key="altitude-italic"
                className="mt-1 block font-serif text-[clamp(54px,15vw,120px)] font-normal tracking-[-0.04em] italic text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: reduce ? 0 : 0.22,
                  delay: reduce ? 0 : (altEnteredRef.current ? 0 : 0.38),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Altitude
              </motion.span>
            ) : (
              <motion.span
                key="altitude-regular"
                className="mt-1 block font-serif text-[clamp(54px,15vw,120px)] font-normal tracking-[-0.04em] text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: reduce ? 0 : 0.22,
                  delay: reduce ? 0 : (altEnteredRef.current ? 0 : 0.38),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Altitude
              </motion.span>
            )}
          </AnimatePresence>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.55,
            delay: reduce ? 0 : 0.44,
            ease: EASE,
          }}
          className="mx-auto mt-6 max-w-md text-[14px] leading-[1.55] text-white"
        >
          An integrated AI-powered platform that sources talent, assesses real ability, upskills the gaps, and lands ranked shortlists in 48 hours.
        </motion.p>
      </motion.div>
    </section>
  )
}

function V2ImageHero({ onScheduleClick }: { onScheduleClick?: () => void }) {
  const [altStyle, setAltStyle] = useState<"italic" | "regular">("italic")
  const altEnteredRef = useRef(false)
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "18%"],
  )
  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "6%"],
  )

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg-brand)]"
    >
      {/* ── Video backdrop (z-0) — scroll parallax ── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ y: photoY }}
      >
        <SeamlessLoopVideo src={V3_HERO_VIDEO_URL} className="h-full w-full" />
      </motion.div>

      {/* Gradient overlay — lighter through the middle, heavier at the base
          so the mountain photo reads through and the bottom content is legible */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/65"
      />


      {/* Page-background seam beneath the SVG — fades to --bg-brand so the
          mountain blends seamlessly into the dark section 2 below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[11] h-14 bg-gradient-to-b from-transparent to-[var(--bg-brand)]"
      />

      {/* ── Bottom-left text block (z-20) ──
          ~50 % wide on desktop so the right half of the video breathes.
          Heading, description, and CTAs all stack vertically on the left. */}
      <motion.div
        className="absolute bottom-12 left-0 z-[20] px-4 pb-8 md:px-8 lg:max-w-[55%] lg:px-12 lg:pb-12"
        style={{ y: titleY }}
      >
        {/* Heading — "Hire at every" sentence-case white + "ALTITUDE." larger
            all-caps white at font-black, 4px larger than the first line */}
        <div className="mb-4 inline-flex items-center gap-1 rounded-md bg-white/[0.08] p-1">
          <button
            type="button"
            onClick={() => { altEnteredRef.current = true; setAltStyle("italic") }}
            className={cn(
              "rounded-sm px-3 py-1 text-xs font-medium transition-colors",
              altStyle === "italic" ? "bg-white/[0.18] text-white" : "text-white/45 hover:text-white/70",
            )}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => { altEnteredRef.current = true; setAltStyle("regular") }}
            className={cn(
              "rounded-sm px-3 py-1 text-xs font-medium transition-colors",
              altStyle === "regular" ? "bg-white/[0.18] text-white" : "text-white/45 hover:text-white/70",
            )}
          >
            Regular
          </button>
        </div>
        <h1 className="leading-[0.9] tracking-[-0.025em]">
          <motion.span
            className="mb-1 block font-sans text-[64px] font-medium text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.2, ease: EASE }}
          >
            Hire at every
          </motion.span>
          <AnimatePresence mode="wait">
            {altStyle === "italic" ? (
              <motion.span
                key="altitude-italic"
                className="block font-sans text-[120px] font-[900] italic text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: reduce ? 0 : 0.22,
                  delay: reduce ? 0 : (altEnteredRef.current ? 0 : 0.38),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Altitude
              </motion.span>
            ) : (
              <motion.span
                key="altitude-regular"
                className="block font-sans text-[120px] font-[900] text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: reduce ? 0 : 0.22,
                  delay: reduce ? 0 : (altEnteredRef.current ? 0 : 0.38),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Altitude
              </motion.span>
            )}
          </AnimatePresence>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5, ease: EASE }}
          className="mt-5 max-w-sm text-sm leading-relaxed text-white/70 lg:text-[15px]"
        >
          Every candidate proctored, scored, and ranked — campus fresher
          to executive search. One platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.68, ease: EASE }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          {onScheduleClick ? (
            <Button type="button" size="lg" onClick={onScheduleClick}>
              Schedule a Walkthrough
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="#book">Schedule a Walkthrough</Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group border-white/25 bg-white/[0.06] text-white shadow-none backdrop-blur-sm hover:bg-white/[0.12] hover:text-white"
          >
            <Link href="#altitudes">
              See how it works
              <ArrowRight
                size={16}
                className="ml-1 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── 2 · Altitudes ────────────────────────────────────────────────────
// Lands the experience-range story before the network section, so the
// reader knows the platform spans the full ladder (campus fresher up to
// founder-led executive search) before they meet the bridge diagram.

// Section 2 — 4-column tier row, modelled on the Duna platform-tour
// reference (adapted to 4 columns instead of 3). A left-aligned intro
// stack sits above a horizontal divider, followed by four equal-width
// columns separated by vertical dividers on lg+. Each column carries
// one outline icon, a tier title, and a 1–2 sentence description.

interface V3TierColumn {
  Icon: LucideIcon
  title: string
  description: string
}

const V3_TIER_COLUMNS: V3TierColumn[] = [
  {
    Icon: Sparkles,
    title: "Executive search",
    description:
      "Founder-led search across IB, PE/VC, Wealth, and AMC. Every mandate runs through a co-founder.",
  },
  {
    Icon: ShieldCheck,
    title: "Senior mandates",
    description:
      "Specialist IC and leadership, ranked in 48 hours by capability scores from proctored assessments.",
  },
  {
    Icon: TrendingUp,
    title: "Mid-career, vetted",
    description:
      "Capability signal, not pedigree. Same scoring applies to every candidate, regardless of background.",
  },
  {
    Icon: GraduationCap,
    title: "Campus freshers",
    description:
      "540+ colleges, proctored at 10,000+ concurrent candidates. Country-wide signal at the broadest tier.",
  },
]

// V6 variant — three hiring levels
const LEVEL_ITEMS: V3TierColumn[] = [
  {
    Icon: GraduationCap,
    title: "Campus",
    description:
      "Aptitude, coding, and domain tests run on students' own devices. 540+ colleges, one scoring standard, shortlists before Monday.",
  },
  {
    Icon: TrendingUp,
    title: "Mid-Career",
    description:
      "Lateral hires scored on demonstrated skill, not job titles. Domain assessments replace résumé screening.",
  },
  {
    Icon: Sparkles,
    title: "Executives",
    description:
      "Co-founder-led search across IB, PE/VC, Wealth, and AMC. Each mandate evaluated on acumen, domain, and leadership fit.",
  },
]


// How far each card is offset from its natural grid position to appear
// stacked at the container center. Outer cards travel more, inner cards
// less. All values are positive for left cards (move right) and negative
// for right cards (move left) so everything converges toward the centre.
const DECK_OFFSET_X  = [460, 155, -155, -460] as const
const DECK_ROTATE    = [-8,  -3,   3,    8  ] as const
const DECK_SCALE     = [0.88, 0.95, 0.95, 0.88] as const
const DECK_Z_INDEX   = [1,   3,   3,    1  ] as const

// Switcher — picks the right layout without holding any hooks itself,
// so neither child's hook set is conditionally called.
function AltitudesSection({
  heroVariant = "light",
  showVariantToggle = false,
}: {
  heroVariant?: LandingHeroVariant
  showVariantToggle?: boolean
}) {
  if (heroVariant === "gradient") return <NetworkStagesSection showVariantToggle={showVariantToggle} />
  return <V3AltitudesDefault />
}

// Landing Section 3 — "Hiring Stack" (nav label "Stack"). Production renders the finalized "Explore"
// layout only (see showVariantToggle below). The variations page exposes three
// interchangeable layouts behind a top toggle:
//   • "levels"  → the animated tier list + stack graphic (NetworkAltitudes)
//   • "stages"  → the stage-cards + stats overview (EveryStageOfHire)
//   • "explore" → the flip-card stages (HireStageCards) — the production pick
// The toggle band sits at the top of the section and carries the same
// z-10/bg as the views so it covers the sticky V4 hero on scroll. Both
// views render their own <section id="altitudes">; only the active one
// is mounted, so the anchor id stays unique.
type NetworkStagesView = "levels" | "stages" | "explore"

const NETWORK_STAGES_VIEWS: { id: NetworkStagesView; label: string }[] = [
  { id: "levels", label: "Levels" },
  { id: "stages", label: "Stages" },
  { id: "explore", label: "Explore" },
]

function NetworkStagesSection({ showVariantToggle = false }: { showVariantToggle?: boolean }) {
  const [view, setView] = useState<NetworkStagesView>("explore")
  const reduce = useReducedMotion()

  // Production renders the finalized "Explore" layout only. The Levels and
  // Stages alternates stay reachable behind the toggle on the variations page.
  if (!showVariantToggle) return <HireStageCards />

  return (
    <>
      {/* Toggle band — top of Section 3 (Stages) */}
      <div className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-page)]">
        <div className="mx-auto flex max-w-6xl justify-center border-x border-[var(--border-default)] px-8 py-5 lg:px-12">
          <div
            role="tablist"
            aria-label="Section layout"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-1"
          >
            {NETWORK_STAGES_VIEWS.map((v) => {
              const selected = view === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setView(v.id)}
                  className={cn(
                    "relative rounded-sm px-4 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {/* Active indicator glides between tabs via shared layout */}
                  {selected && (
                    <motion.span
                      layoutId="v6-section-two-tab"
                      aria-hidden
                      className="absolute inset-0 rounded-sm bg-[var(--bg-elevated)] shadow-sm"
                      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE }}
                    />
                  )}
                  <span className="relative z-10">{v.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active view — only one mounts at a time (keeps the section's
          z-10/bg covering the sticky hero with no crossfade gap). Each
          view owns its whileInView entrance, which replays on remount. */}
      {view === "levels" ? (
        <NetworkAltitudes />
      ) : view === "stages" ? (
        <EveryStageOfHire />
      ) : (
        <HireStageCards />
      )}
    </>
  )
}

// Landing Section 4 — "Infrastructure". Production renders the finalized
// layer-cube layout only (see showVariantToggle below). The variations page
// exposes two interchangeable layouts behind a top toggle:
//   • "ecosystem"      → the auto-advancing "Our systems that power the
//                        ecosystem" accordion (EcosystemLayers)
//   • "infrastructure" → the layer-cube accordion (InfrastructureLayers) — the
//                        production pick
// Section 4 sits on the brand-dark surface, so the toggle band is dark to
// match. Both views render their own dark <section> beneath it.
type InfrastructureView = "ecosystem" | "infrastructure"

const INFRASTRUCTURE_VIEWS: { id: InfrastructureView; label: string }[] = [
  { id: "ecosystem", label: "Ecosystem" },
  { id: "infrastructure", label: "Infrastructure" },
]

function InfrastructureSection({ showVariantToggle = false }: { showVariantToggle?: boolean }) {
  const [view, setView] = useState<InfrastructureView>("infrastructure")
  const reduce = useReducedMotion()

  // Production renders the finalized "Infrastructure" layer-cube layout only.
  // The Ecosystem alternate stays reachable behind the toggle on the
  // variations page.
  if (!showVariantToggle) {
    return (
      <InfrastructureLayers
        renderGraphic={(activeId) => {
          if (activeId === "intelligence") return <IntelligenceBeam tone="dark" />
          if (activeId === "data") return <TalentPoolGraphic />
          return (
            <ScaledGraphic designWidth={587} designHeight={477}>
              <NetworkCards />
            </ScaledGraphic>
          )
        }}
      />
    )
  }

  return (
    <>
      {/* Toggle band — dark, sits at the top of Section 4 (Infrastructure) */}
      <div className="border-t border-white/[0.06] bg-[var(--bg-brand)]">
        <div className="mx-auto flex max-w-6xl justify-center px-8 py-5 lg:px-12">
          <div
            role="tablist"
            aria-label="Section layout"
            className="inline-flex items-center gap-1 rounded-md border border-white/[0.10] bg-white/[0.04] p-1"
          >
            {INFRASTRUCTURE_VIEWS.map((v) => {
              const selected = view === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setView(v.id)}
                  className={cn(
                    "relative rounded-sm px-4 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "text-white"
                      : "text-white/45 hover:text-white/70",
                  )}
                >
                  {/* Active indicator glides between tabs via shared layout */}
                  {selected && (
                    <motion.span
                      layoutId="v6-section-three-tab"
                      aria-hidden
                      className="absolute inset-0 rounded-sm bg-white/[0.12]"
                      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE }}
                    />
                  )}
                  <span className="relative z-10">{v.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {view === "ecosystem" ? (
        <EcosystemLayers />
      ) : (
        <InfrastructureLayers
          renderGraphic={(activeId) => {
            if (activeId === "intelligence") return <IntelligenceBeam tone="dark" />
            if (activeId === "data") return <TalentPoolGraphic />
            return (
              <ScaledGraphic designWidth={587} designHeight={477}>
                <NetworkCards />
              </ScaledGraphic>
            )
          }}
        />
      )}
    </>
  )
}

// V6 "Levels" layout — full-width heading up top, then a two-column
// content row (tier list left, animated tier graphic right), then stats.
function NetworkAltitudes() {
  const reduce = useReducedMotion()
  const statsRef = useRef<HTMLDivElement | null>(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-10% 0px" })
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null)

  const LEVEL_ACCENTS = [
    "var(--color-primary-600)",
    "var(--color-brand-navy)",
    "var(--color-brand-amber)",
  ]

  return (
    <section
      id="altitudes"
      data-section-bg="light"
      className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">

        {/* ── Top: full-width heading with accent reveal ── */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <h2 className="max-w-[24ch] text-[clamp(32px,4vw,52px)] font-medium leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]">
            One platform.{" "}
            <motion.span
              className="inline-block font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-600)]"
              initial={reduce ? undefined : { opacity: 0, x: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              Every level
            </motion.span>{" "}
            of hire.
          </h2>
        </motion.div>

        {/* ── Content: left tier list, right animated graphic ── */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left — 3 levels with hover accent */}
          <div className="-mx-4 flex flex-col">
            {LEVEL_ITEMS.map((item, i) => {
              const { Icon } = item
              const isHovered = hoveredLevel === i
              const accent = LEVEL_ACCENTS[i]
              return (
                <motion.div
                  key={item.title}
                  initial={reduce ? undefined : { opacity: 0, x: -24 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                  onHoverStart={() => setHoveredLevel(i)}
                  onHoverEnd={() => setHoveredLevel(null)}
                  className={cn(
                    "group flex items-start gap-5 rounded-md px-4 py-6 transition-colors duration-200",
                    isHovered ? "bg-[var(--bg-surface)]" : "bg-transparent",
                  )}
                >
                  <motion.div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors duration-200"
                    animate={{
                      backgroundColor: isHovered ? accent : "var(--bg-surface)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className={cn(
                        "transition-colors duration-200",
                        isHovered ? "text-white" : "text-[var(--text-primary)]",
                      )}
                      aria-hidden
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-[16px] font-bold leading-snug tracking-tight text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right — animated tier stack graphic */}
          <TierStackGraphic activeLevel={hoveredLevel} />
        </div>

        {/* ── Bottom: stats row with hover micro-interaction ── */}
        <div
          ref={statsRef}
          className="mt-20 border-t border-[var(--border-default)] pt-16 lg:mt-24 lg:pt-20"
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {ANCHOR_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                animate={statsInView || reduce ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="flex cursor-default flex-col gap-1"
              >
                <p className="text-[clamp(32px,4vw,52px)] font-bold leading-none tabular-nums tracking-[-0.03em] text-[var(--text-primary)]">
                  {s.staticDisplay ?? (
                    <>
                      <CountUp end={s.value} trigger={statsInView} delay={i * 0.08} />
                      {s.suffix}
                    </>
                  )}
                </p>
                <p className="text-[13px] text-[var(--text-muted)]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// Animated tier-depth graphic for Section 2 right column.
// Three horizontal fill bars (Campus → Mid-Career → Executives) animate in
// on mount, each with a subtle liquid shimmer reusing the nav keyframe.
function TierStackGraphic({ activeLevel }: { activeLevel: number | null }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  const TIERS = [
    {
      label: "Campus",
      meta: "540+ colleges · 10k+ concurrent",
      fill: 0.88,
      count: "2.4M+",
      color: "var(--color-primary-600)",
      shineDuration: 9,
    },
    {
      label: "Mid-Career",
      meta: "All backgrounds · unified scoring",
      fill: 0.62,
      count: "800+",
      color: "var(--color-brand-navy)",
      shineDuration: 11,
    },
    {
      label: "Executives",
      meta: "Co-founder led · IB, PE/VC, Wealth",
      fill: 0.38,
      count: "30+",
      color: "var(--color-brand-amber)",
      shineDuration: 13,
    },
  ]

  return (
    <div
      ref={ref}
      className="flex flex-col gap-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8"
    >
      <div className="flex flex-col gap-6">
        {TIERS.map((tier, i) => {
          const isActive = activeLevel === i
          const isDimmed = activeLevel !== null && activeLevel !== i
          return (
            <motion.div
              key={tier.label}
              className="flex flex-col gap-2"
              animate={{ opacity: isDimmed ? 0.35 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {tier.label}
                </span>
                <span className="truncate text-[11px] text-[var(--text-muted)]">
                  {tier.meta}
                </span>
              </div>
              <div className="relative h-10 overflow-hidden rounded-sm bg-white">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView || reduce ? {
                    width: `${tier.fill * 100}%`,
                    scale: isActive ? 1.02 : 1,
                  } : {}}
                  transition={{
                    width: { duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.18 },
                    scale: { duration: 0.2 },
                  }}
                  className="relative h-full overflow-hidden rounded-sm"
                  style={{
                    background: tier.color,
                    boxShadow: isActive ? `0 0 16px ${tier.color}` : "none",
                    transformOrigin: "left center",
                  }}
                >
                  {/* Shimmer */}
                  {!reduce && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0"
                      style={{
                        width: "200%",
                        left: "-50%",
                        background:
                          "linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.10) 50%, transparent 70%)",
                        animation: `navLiquidShift ${tier.shineDuration}s ease-in-out infinite alternate`,
                      }}
                    />
                  )}

                  {/* Count label inside the bar */}
                  <motion.span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-bold tabular-nums text-white"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {tier.count}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Default layout — 4-column deck that spreads from a stacked centre as
// the section scrolls into view. Scroll hooks live here, not in the switcher.
function V3AltitudesDefault() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "start 25%"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    restDelta: 0.001,
  })

  const x0 = useTransform(progress, [0, 1], [DECK_OFFSET_X[0], 0])
  const x1 = useTransform(progress, [0, 1], [DECK_OFFSET_X[1], 0])
  const x2 = useTransform(progress, [0, 1], [DECK_OFFSET_X[2], 0])
  const x3 = useTransform(progress, [0, 1], [DECK_OFFSET_X[3], 0])

  const r0 = useTransform(progress, [0, 1], [DECK_ROTATE[0], 0])
  const r1 = useTransform(progress, [0, 1], [DECK_ROTATE[1], 0])
  const r2 = useTransform(progress, [0, 1], [DECK_ROTATE[2], 0])
  const r3 = useTransform(progress, [0, 1], [DECK_ROTATE[3], 0])

  const s0 = useTransform(progress, [0, 1], [DECK_SCALE[0], 1])
  const s1 = useTransform(progress, [0, 1], [DECK_SCALE[1], 1])
  const s2 = useTransform(progress, [0, 1], [DECK_SCALE[2], 1])
  const s3 = useTransform(progress, [0, 1], [DECK_SCALE[3], 1])

  const cardMotion = [
    { x: x0, rotate: r0, scale: s0 },
    { x: x1, rotate: r1, scale: s1 },
    { x: x2, rotate: r2, scale: s2 },
    { x: x3, rotate: r3, scale: s3 },
  ]

  const containerMotion = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: "-15% 0px" },
        variants: V3_STAGGER_CONTAINER,
      }

  return (
    <section
      ref={sectionRef}
      id="altitudes"
      data-section-bg="light"
      className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <motion.div {...containerMotion} className="max-w-2xl">
          <motion.h2
            variants={reduce ? undefined : V3_FADE_UP}
            className="mt-2 text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Every{" "}
            <span className="text-[var(--color-primary-600)]">tier.</span>
          </motion.h2>
          <motion.p
            variants={reduce ? undefined : V3_FADE_UP}
            className="mt-5 text-base leading-[1.55] text-[var(--text-body)] lg:text-[17px]"
          >
            One engine ranks every tier. From 10,000-candidate campus drives
            to founder-led mandates — scored the same way, start to finish.
          </motion.p>
        </motion.div>

        <div className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {V3_TIER_COLUMNS.map((col, i) => {
            const { Icon } = col
            return (
              <motion.div
                key={col.title}
                style={reduce ? undefined : {
                  x: cardMotion[i].x,
                  rotate: cardMotion[i].rotate,
                  scale: cardMotion[i].scale,
                  zIndex: DECK_Z_INDEX[i],
                  position: "relative",
                }}
                className="flex flex-col gap-5 rounded-lg border border-[var(--border-default)] bg-transparent p-6 transition-colors hover:bg-[var(--bg-surface)]"
              >
                <Icon size={28} strokeWidth={1.6} className="text-[var(--text-primary)]" aria-hidden />
                <h3 className="text-[18px] font-bold leading-tight tracking-tight text-[var(--text-primary)] lg:text-[20px]">
                  {col.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  {col.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── 3 · Marketplace ──────────────────────────────────────────────────

const ANCHOR_STATS: Array<{
  value: number
  suffix: string
  label: string
  Icon: LucideIcon
  staticDisplay?: string
}> = [
  { value: 0,    suffix: "",  staticDisplay: "2.4M+", label: "Candidates onboarded across all tiers", Icon: Users },
  { value: 800,  suffix: "+",                         label: "Corporate partners hiring with us",      Icon: Building2 },
  { value: 1200, suffix: "+",                         label: "Institutes & TPOs connected",            Icon: GraduationCap },
  { value: 62,   suffix: "%",                         label: "Faster time-to-offer (avg)",             Icon: Clock },
]

// ─── V6 Section 3 · Ecosystem Layers ──────────────────────────────────

interface EcosystemLayer {
  id: string
  icon: LucideIcon
  number: string
  title: string
  description: string
  tags: string[]
}

const ECOSYSTEM_LAYERS: EcosystemLayer[] = [
  {
    id: "intelligence",
    icon: Sparkles,
    number: "01",
    title: "Intelligence",
    description:
      "AI cuts the noise. Role-to-skill matching scores every candidate and surfaces who fits before the first interview. Every rank ships with a rationale your team can defend.",
    tags: ["match score", "cuts the noise", "rationale"],
  },
  {
    id: "talent-pool",
    icon: Users,
    number: "02",
    title: "Data",
    description:
      "A pan-India talent pool: 2M+ candidates across 540+ colleges in 28 states, scored on one scale. From Kashmir to Kanyakumari, capability surfaces by performance, not postcode.",
    tags: ["pan-India", "28 states", "2M+ candidates"],
  },
  {
    id: "network",
    icon: Globe,
    number: "03",
    title: "Network",
    description:
      "Institutional partnerships and corporate pipelines wired into one placement layer. Drives coordinated live, outcomes reported the same week.",
    tags: ["college partnerships", "corporate pipeline", "live coordination"],
  },
]

function TalentPoolGraphic() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  const REGIONS = [
    { label: "North", x: "44%", y: "34%", count: "4,200", delay: 0.3 },
    { label: "South", x: "48%", y: "68%", count: "12,800", delay: 0.5 },
    { label: "West", x: "34%", y: "46%", count: "9,600", delay: 0.4 },
    { label: "East", x: "62%", y: "40%", count: "5,100", delay: 0.6 },
  ]

  return (
    <div ref={ref} className="relative flex h-full items-center justify-center">
      {/* Radial glow behind the map */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 62% at 50% 50%, color-mix(in srgb, var(--color-primary-500) 16%, transparent) 0%, transparent 72%)",
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 1 }}
      />

      {/* Map with entrance animation + regional dots inside */}
      <motion.div
        className="relative h-full overflow-visible"
        style={{ aspectRatio: "645 / 720" }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <IndiaTalentMap step={1} demoMode />

        {/* Regional hotspot indicators — positioned relative to the map */}
        {REGIONS.map((r) => (
          <motion.div
            key={r.label}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: r.x, top: r.y }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.4, delay: r.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            {!reduce && inView && (
              <motion.span
                className="absolute left-1/2 top-1/2 block size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary-400)]"
                animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                transition={{ duration: 2.5, delay: r.delay + 0.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <div className="flex flex-col items-center">
              <span className="block size-2.5 rounded-full bg-[var(--color-primary-400)]" />
              <span className="mt-1 whitespace-nowrap rounded-sm bg-black/50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white/80">
                {r.count}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}

function EcosystemLayers() {
  const reduce = useReducedMotion()
  const DURATION = 5600 // ms each item is shown before auto-advancing

  const sectionRef = useRef<HTMLElement | null>(null)
  const inView = useInView(sectionRef, { once: false, margin: "-10% 0px" })

  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0) // 0–1, drives the timer bar width

  // Refs let the RAF loop read current pause/elapsed state without stale closures
  const isPausedRef = useRef(false)
  const startRef = useRef<number | null>(null)       // RAF timestamp when current run started
  const elapsedAtPauseRef = useRef(0)                // ms already elapsed before last pause
  const rafRef = useRef(0)

  // Restart the RAF timer whenever the active item changes — only when in viewport
  useEffect(() => {
    if (reduce || !inView) return
    startRef.current = null
    elapsedAtPauseRef.current = 0
    setProgress(0)

    const tick = (ts: number) => {
      if (isPausedRef.current) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      // On first tick after a resume, anchor start so elapsed continues from the pause point
      if (startRef.current === null) {
        startRef.current = ts - elapsedAtPauseRef.current
      }
      const elapsed = ts - startRef.current
      const p = Math.min(1, elapsed / DURATION)
      setProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setActiveIdx((i) => (i + 1) % ECOSYSTEM_LAYERS.length)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [activeIdx, reduce, inView])

  const pauseTimer = () => {
    if (isPausedRef.current) return
    if (startRef.current !== null) {
      elapsedAtPauseRef.current = performance.now() - startRef.current
      startRef.current = null
    }
    isPausedRef.current = true
  }

  const resumeTimer = () => {
    isPausedRef.current = false
    // Next RAF tick will set startRef = ts - elapsedAtPauseRef so elapsed resumes correctly
  }

  const selectItem = (idx: number) => {
    isPausedRef.current = false
    elapsedAtPauseRef.current = 0
    startRef.current = null
    setActiveIdx(idx)
  }

  const activeId = ECOSYSTEM_LAYERS[activeIdx].id

  return (
    <section
      ref={sectionRef}
      id="ecosystem-layers"
      data-section-bg="dark"
      className="relative border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      <div className="mx-auto max-w-6xl px-8 py-20 lg:px-12 lg:py-24">
        <motion.div
          className="mb-16 lg:mb-20"
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="max-w-[26ch] text-[clamp(32px,4vw,52px)] font-medium leading-[1.08] tracking-[-0.025em] text-white">
            Our systems that power{" "}
            <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-300)]">the ecosystem.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-20">
          {/* Left — auto-advancing accordion with timer separators */}
          <div className="flex min-w-0 flex-col">
            {ECOSYSTEM_LAYERS.map((layer, i) => {
              const isActive = activeIdx === i
              return (
                <motion.div
                  key={layer.id}
                  initial={reduce ? undefined : { opacity: 0, y: 14 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
                >
                  {/* Timer bar on top of every item — fills white while active */}
                  <div className="relative h-[2px] overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      aria-hidden
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      style={{ width: isActive ? `${progress * 100}%` : "0%" }}
                    />
                  </div>

                  {/* Wrap in a div so hover covers the full item including expanded body */}
                  <div
                    onMouseEnter={isActive ? pauseTimer : undefined}
                    onMouseLeave={isActive ? resumeTimer : undefined}
                  >
                    <button
                      onClick={() => selectItem(i)}
                      className="group w-full py-6 text-left"
                      aria-expanded={isActive}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold transition-colors duration-200",
                            isActive
                              ? "bg-[var(--color-primary-600)] text-white"
                              : "bg-white/[0.08] text-white/35",
                          )}
                        >
                          {layer.number}
                        </div>
                        <span
                          className={cn(
                            "flex-1 text-[16px] font-semibold transition-colors duration-200",
                            isActive ? "text-white" : "text-white/40",
                          )}
                        >
                          {layer.title}
                        </span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="pb-2 pl-[52px] pt-3">
                              <p className="text-[14px] leading-[1.65] text-white/55">
                                {layer.description}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {layer.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-sm border border-white/[0.10] bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/45"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>
              )
            })}

            <p className="mt-10 text-center font-mono text-[11px] text-white/20">
              ↑ each layer compounds the one beneath it ↑
            </p>
          </div>

          {/* Right — graphic panel, sticky on desktop */}
          <div
            className="min-w-0 lg:sticky lg:top-32"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
          >
            <div className="h-[480px]">
              <div className="flex h-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03] p-8">
                <IsometricLayerCube
                  activeId={activeId === "talent-pool" ? "data" : (activeId as LayerId)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Marketplace / bridge diagram ─────────────────────────────────────

function V3Marketplace({ minimal = false }: { minimal?: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })
  const containerMotion = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: "-15% 0px" },
        variants: V3_STAGGER_CONTAINER,
      }
  return (
    <section
      id="v3-marketplace"
      data-section-bg="light"
      className="border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <motion.div
          {...containerMotion}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.h2
            variants={reduce ? undefined : V3_FADE_UP}
            className="mt-2 text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]"
          >
            Talent.{" "}
            <span className="text-[var(--color-primary-600)]">At scale.</span>
          </motion.h2>
          {!minimal && (
            <motion.p
              variants={reduce ? undefined : V3_FADE_UP}
              className="mt-5 text-base leading-[1.55] text-[var(--text-body)] lg:text-[17px]"
            >
              AI matches, scores, and routes every candidate before the first
              interview. Corporates get a ranked shortlist. Institutions get
              placement outcomes. No middlemen.
            </motion.p>
          )}
        </motion.div>

        <div ref={ref} className="mt-16 lg:mt-20">
          <BridgeDiagram inView={inView} />
        </div>
      </div>
    </section>
  )
}

// ─── Trust marquee + Anchor stats (combined) ──────────────────────────
// Lives after the AI section. Same `<section>`: marquee on top, stats
// underneath, separated by a thin divider so the two halves read as a
// single trust-block rather than two stacked bands.

function V3TrustAndStats() {
  return (
    <section
      data-section-bg="light"
      className="border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <TrustLogoMarquee />

        {/* Anchor stats — values rotate through the brand-multi palette
            (cobalt → navy → amber → orange) to land the colour story used
            by the hero word-cycle and the Pan-India stat row. Each stat
            fades up on view and the value RAF-tweens from 0 to its final
            number so the section reads as "loading in" rather than fully
            rendered. */}
        <V3StatsGrid />
      </div>
    </section>
  )
}

function V3StatsGrid() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const [featured, ...rest] = ANCHOR_STATS
  const FeaturedIcon = featured.Icon
  return (
    <div
      ref={ref}
      className="mt-10 lg:mt-12"
    >
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Featured dark card — hugs content, stretches to right column height. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: reduce ? 0 : 0.5,
            delay: reduce ? 0 : 0.1,
            ease: EASE,
          }}
          className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-brand)] p-5 lg:p-6"
        >
          <GridPattern
            width={32}
            height={32}
            className="absolute inset-0 z-0 fill-[var(--color-primary-400)]/10 stroke-[var(--color-primary-400)]/20"
          />
          <FeaturedIcon
            size={24}
            strokeWidth={1.6}
            className="relative z-10 text-[var(--color-primary-300)]"
            aria-hidden
          />
          <div className="relative z-10">
            <p className="font-bold leading-[0.9] tracking-[-0.04em] tabular-nums text-[var(--color-primary-400)] text-[clamp(48px,7vw,96px)]">
              {featured.staticDisplay ?? (
                <>
                  <CountUp end={featured.value} trigger={inView} delay={0.2} />
                  {featured.suffix}
                </>
              )}
            </p>
            <p className="mt-3 max-w-[16ch] text-sm leading-snug text-white/70">
              {featured.label}
            </p>
          </div>
        </motion.div>

        {/* Right column — three white cards stacked, each hugs its content. */}
        <div className="grid grid-cols-1 gap-4">
          {rest.map((s, i) => {
            const Icon = s.Icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : 0.18 + i * 0.08,
                  ease: EASE,
                }}
                className="relative flex items-center justify-between gap-4 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-3.5 lg:px-5 lg:py-4"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                    className="shrink-0 text-[var(--text-muted)]"
                    aria-hidden
                  />
                  <p className="text-sm leading-snug text-[var(--text-muted)]">
                    {s.label}
                  </p>
                </div>
                <p className="shrink-0 font-bold leading-none tracking-[-0.03em] tabular-nums text-[var(--text-primary)] text-[clamp(28px,3vw,40px)]">
                  {s.staticDisplay ?? (
                    <>
                      <CountUp end={s.value} trigger={inView} delay={0.28 + i * 0.08} />
                      {s.suffix}
                    </>
                  )}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BridgeDiagram({ inView }: { inView: boolean }) {
  const reduce = useReducedMotion()
  const ARC = "M120,220 A240,140 0 0 1 600,220"
  const LEFT_ARC = "M120,220 A240,140 0 0 1 360,80"
  const RIGHT_ARC = "M600,220 A240,140 0 0 0 360,80"

  return (
    <div className="relative mx-auto h-[300px] w-full max-w-4xl lg:h-[280px]">
      {/* Ambient glow at apex */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[28.6%] h-[120px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(73,79,223,0.10) 0%, transparent 70%)" }}
      />

      <svg
        viewBox="0 0 720 280"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {/* Bridge arc with draw-on animation */}
        <motion.path
          d={ARC}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Glow duplicate of the arc */}
        <motion.path
          d={ARC}
          stroke="rgba(73,79,223,0.06)"
          strokeWidth="6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {!reduce && inView && (
          <>
            {/* Left stream: navy dots along the left half of the arc */}
            {[0, 1, 2].map((i) => (
              <circle key={`l-${i}`} r="3" fill="var(--color-brand-navy)" opacity="0.8">
                <animateMotion
                  dur="2.4s"
                  begin={`${i * 0.8}s`}
                  repeatCount="indefinite"
                  path={LEFT_ARC}
                  calcMode="linear"
                />
              </circle>
            ))}

            {/* Right stream: orange dots along the right half */}
            {[0, 1, 2].map((i) => (
              <circle key={`r-${i}`} r="3" fill="var(--color-brand-orange)" opacity="0.8">
                <animateMotion
                  dur="2.4s"
                  begin={`${i * 0.8}s`}
                  repeatCount="indefinite"
                  path={RIGHT_ARC}
                  calcMode="linear"
                />
              </circle>
            ))}

            {/* Cobalt pulse at apex where streams converge */}
            <motion.circle
              cx="360"
              cy="80"
              r="6"
              fill="var(--color-primary-600)"
              animate={{ r: [6, 12, 6], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </svg>

      {/* Corporates node */}
      <motion.div
        className="absolute left-[16.7%] top-[78.6%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <NodeCard
          icon={<Building2 size={18} className="text-[var(--text-primary)]" />}
          label="Corporates"
          sub="Recruit · screen · hire"
        />
      </motion.div>

      {/* PluginLive apex */}
      {!reduce && inView && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[28.6%] -translate-x-1/2 -translate-y-1/2"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 block size-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary-400)]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 2.5], opacity: [0.2, 0] }}
              transition={{ duration: 3.5, delay: i * 1.1, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        </div>
      )}
      <motion.div
        className="absolute left-1/2 top-[28.6%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <NodeCard
          icon={<Sparkles size={18} className="text-white" />}
          label="PluginLive"
          sub="The intelligent layer"
          primary
        />
      </motion.div>

      {/* Institutions node */}
      <motion.div
        className="absolute left-[83.3%] top-[78.6%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <NodeCard
          icon={<GraduationCap size={18} className="text-[var(--text-primary)]" />}
          label="Institutions"
          sub="540+ colleges · 2M+ students"
        />
      </motion.div>
    </div>
  )
}

function NodeCard({
  icon,
  label,
  sub,
  primary = false,
  className,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  primary?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md border px-3 py-2 shadow-md sm:px-4 sm:py-3",
        primary ? "w-[180px] sm:w-[220px]" : "w-[150px] sm:w-[180px]",
        primary
          ? "border-white/[0.08] bg-[var(--bg-brand)]"
          : "border-[var(--border-default)] bg-[var(--bg-elevated)]",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-sm",
          primary ? "bg-white/15" : "bg-[var(--bg-surface)]",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-[13px] font-semibold leading-tight",
            primary ? "text-white" : "text-[var(--text-primary)]",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "truncate font-mono text-[10px] uppercase tracking-[0.1em]",
            primary ? "text-white/70" : "text-[var(--text-muted)]",
          )}
        >
          {sub}
        </p>
      </div>
    </div>
  )
}

// ─── 3 · AI Layer (dark) ──────────────────────────────────────────────

const AI_POINTS: Array<{ Icon: LucideIcon; title: string; body: string }> = [
  {
    Icon: Crosshair,
    title: "Smart matching",
    body: "Capability-matched, not keyword-matched. Ranked in minutes, not days.",
  },
  {
    Icon: Filter,
    title: "Automated screening",
    body: "10,000+ concurrent. Proctored, scored, flagged before the inbox opens.",
  },
  {
    Icon: TrendingUp,
    title: "Predictive readiness",
    body: "Scored before they apply. Gaps in, signals out.",
  },
]

function V3AILayer({ minimal = false }: { minimal?: boolean }) {
  const reduce = useReducedMotion()
  const containerMotion = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: "-15% 0px" },
        variants: V3_STAGGER_CONTAINER,
      }
  return (
    <section
      data-section-bg="dark"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      <div className="relative mx-auto max-w-6xl px-8 py-20 lg:px-12 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <motion.div {...containerMotion}>
            <motion.h2
              variants={reduce ? undefined : V3_FADE_UP}
              className="mt-2 text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-white"
            >
              Cut the{" "}
              <span className="text-[var(--color-primary-300)]">noise.</span>
            </motion.h2>
            {!minimal && (
              <motion.p
                variants={reduce ? undefined : V3_FADE_UP}
                className="mt-5 text-base leading-[1.6] text-white/70 lg:text-[17px]"
              >
                Capability signals, not keyword overlap. The right candidates
                surface before you open a single inbox.
              </motion.p>
            )}

            <motion.ul
              variants={reduce ? undefined : V3_FADE_UP}
              className={cn("space-y-3", minimal ? "mt-6" : "mt-7")}
            >
              {AI_POINTS.map(({ Icon, title }) => (
                <li key={title} className="flex items-center gap-3">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-sm bg-white/[0.06] text-[var(--color-primary-300)]"
                    aria-hidden
                  >
                    <Icon size={14} strokeWidth={1.75} />
                  </span>
                  <p className="text-[14px] font-semibold leading-snug text-white">
                    {title}
                  </p>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <SignalFilter />
        </div>

        {/* Pan-India strip — full-width card that closes the section by
            naming the coverage that powers the matcher. Left half: copy.
            Right half: city-pill cloud stagger-in. */}
        <PanIndiaStrip minimal={minimal} />
      </div>
    </section>
  )
}

const PAN_INDIA_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Pune",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad",
  "Patna",
  "Jaipur",
  "Lucknow",
  "+529 more",
]

function PanIndiaStrip({ minimal = false }: { minimal?: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  return (
    <div
      ref={ref}
      className="mt-6 rounded-xl border border-white/[0.10] bg-white/[0.03] p-6 lg:mt-8 lg:p-8"
    >
      <div className="grid items-start gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
        {/* Left — heading + body */}
        <div>
          <h3 className="text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.2] tracking-tight text-white">
            Every state. Every tier.
          </h3>
          {!minimal && (
            <p className="mt-3 text-[14px] leading-[1.55] text-white/65 lg:text-[15px]">
              Signal spans metros and tier-3 cities equally. The AI ranks
              capability, not geography — your shortlist is limited by skill,
              not where candidates happened to study.
            </p>
          )}
        </div>

        {/* Right — stat row + animated city pills */}
        <div>
          <div className="grid grid-cols-3 gap-3 border-b border-white/[0.10] pb-4">
            {[
              { value: "540+", label: "Colleges",   color: "var(--color-primary-300)" },
              { value: "28",   label: "States",     color: "var(--color-brand-amber)" },
              { value: "2M+",  label: "Candidates", color: "var(--color-brand-orange)" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  style={{ color: s.color }}
                  className="text-[clamp(20px,2vw,26px)] font-bold leading-none tabular-nums"
                >
                  {s.value}
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial="hidden"
            animate={inView || reduce ? "show" : "hidden"}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduce ? 0 : 0.06,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {PAN_INDIA_CITIES.map((city) => (
              <motion.span
                key={city}
                className="inline-flex items-center gap-1.5 rounded-sm border border-white/[0.10] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/80"
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: EASE },
                  },
                }}
              >
                <MapPin
                  size={10}
                  aria-hidden
                  className="text-[var(--color-primary-300)]"
                />
                {city}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function SignalFilter() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px" })
  const DOTS = Array.from({ length: 40 }, (_, i) => i)
  const HIGHLIGHTS = new Set([6, 14, 19, 22, 28, 33])
  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.10] bg-white/[0.03] p-6 lg:p-8"
    >
      <div className="flex items-center justify-between border-b border-white/[0.10] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
          Signal filter · 40 candidates
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-primary-300)]">
          6 quality matches
        </p>
      </div>
      <div className="mt-5 grid grid-cols-10 gap-2">
        {DOTS.map((i) => {
          const isHighlight = HIGHLIGHTS.has(i)
          return (
            <motion.div
              key={i}
              className="aspect-square rounded-full"
              initial={{
                backgroundColor: "rgba(255,255,255,0.18)",
                scale: 1,
              }}
              animate={
                reduce
                  ? undefined
                  : inView
                    ? {
                        backgroundColor: isHighlight
                          ? "var(--color-primary-600)"
                          : "rgba(255,255,255,0.10)",
                        scale: isHighlight ? [1, 1.4, 1] : [1, 0.85, 0.85],
                      }
                    : undefined
              }
              transition={{
                duration: 0.6,
                delay: isHighlight ? 0.6 + i * 0.015 : 0.05 + i * 0.012,
                ease: EASE,
              }}
            />
          )
        })}
      </div>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
        Resume noise filtered. Capability signals surface.
      </p>
    </div>
  )
}

// ─── 4 · Platform ─────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { Icon: ClipboardList, label: "Post Role" },
  { Icon: Filter,        label: "Screen & Assess" },
  { Icon: ListChecks,    label: "Shortlist" },
  { Icon: Users,         label: "Evaluation Rounds" },
  { Icon: ShieldCheck,   label: "Hire" },
]

// ─── Audience card data ───────────────────────────────────────────────

type PlatformMockupType = "executive" | "corporate" | "institute"

interface PlatformAudienceCardData {
  Icon: LucideIcon
  title: string
  desc: string
  cta: { label: string; href: string }
  mockup: PlatformMockupType
}

const PLATFORM_AUDIENCE_CARDS: PlatformAudienceCardData[] = [
  {
    Icon: Briefcase,
    title: "For executives",
    desc: "Identify senior leadership candidates across sectors without the six-week agency loop. Ranked shortlists, verified credentials, and full audit trail before the first call.",
    cta: { label: "Get started", href: "/executive-search" },
    mockup: "executive",
  },
  {
    Icon: Building2,
    title: "For corporates",
    desc: "Run campus drives at scale — from JD to shortlist in 48 hours. One platform handles sourcing, screening, and audit so your recruiters close offers, not inboxes.",
    cta: { label: "Get started", href: "/corporates" },
    mockup: "corporate",
  },
  {
    Icon: GraduationCap,
    title: "For institutes & NGOs",
    desc: "Give every student a fair shot. Tier-blind ranking surfaces talent on capability, not college prestige — every placement timestamped and TPO-attributed.",
    cta: { label: "Get started", href: "/institutes" },
    mockup: "institute",
  },
]

// ─── Mockup panels (light theme) ─────────────────────────────────────

const PLATFORM_SKILL_BARS = [
  { label: "Leadership", pct: 92 },
  { label: "Technical depth", pct: 88 },
  { label: "Culture fit", pct: 95 },
]

function PlatformExecutiveMockup() {
  return (
    <div className="p-5">
      <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-[var(--text-disabled)]">
        Candidate profile
      </p>
      <div className="mb-3 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--bg-brand-subtle)]">
            <span className="font-mono text-[11px] font-semibold text-[var(--color-primary-600)]">
              RV
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-[var(--text-primary)]">Ravi Verma</p>
            <p className="text-[9px] text-[var(--text-muted)]">VP Engineering · 14 yrs exp</p>
          </div>
          <p className="text-[20px] font-bold tabular-nums text-[var(--color-primary-600)]">
            94
          </p>
        </div>
        <div className="space-y-2">
          {PLATFORM_SKILL_BARS.map(({ label, pct }) => (
            <div key={label}>
              <div className="mb-0.5 flex items-center justify-between">
                <p className="text-[9px] text-[var(--text-muted)]">{label}</p>
                <p className="text-[9px] text-[var(--text-muted)]">{pct}%</p>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--border-default)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--color-primary-600)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.0, delay: 0.2, ease: EASE }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-sm bg-[var(--interactive-primary)] py-1.5 text-[10px] font-semibold text-white"
        >
          Schedule call
        </button>
        <button
          type="button"
          className="flex-1 rounded-sm border border-[var(--border-default)] py-1.5 text-[10px] font-medium text-[var(--text-muted)]"
        >
          Full report
        </button>
      </div>
    </div>
  )
}

const PLATFORM_FUNNEL_ROWS = [
  { label: "Applied", val: "1,240", pct: 100, color: "bg-[var(--color-neutral-300)]" },
  { label: "Screened", val: "312",   pct: 25,  color: "bg-[var(--color-primary-300)]" },
  { label: "Shortlisted", val: "48", pct: 4,   color: "bg-[var(--color-primary-600)]" },
]

function PlatformCorporateMockup() {
  return (
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-disabled)]">
          Live drive
        </p>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary-600)]" />
          <span className="font-mono text-[9px] text-[var(--text-muted)]">247 live</span>
        </span>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-1.5">
        {PLATFORM_FUNNEL_ROWS.map(({ label, val }) => (
          <div
            key={label}
            className="rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] py-2 text-center"
          >
            <p className="text-[14px] font-bold tabular-nums text-[var(--text-primary)]">{val}</p>
            <p className="text-[8px] text-[var(--text-disabled)]">{label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {PLATFORM_FUNNEL_ROWS.map(({ label, pct, color }) => (
          <div key={label} className="flex items-center gap-2">
            <p className="w-16 shrink-0 text-[9px] text-[var(--text-muted)]">{label}</p>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--border-default)]">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: "0%" }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PLATFORM_TOP_RECRUITERS = [
  { name: "Infosys", offers: 42 },
  { name: "TCS", offers: 38 },
  { name: "Deloitte", offers: 27 },
]

function PlatformInstituteMockup() {
  return (
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-disabled)]">
          Placement stats
        </p>
        <span className="font-mono text-[9px] text-[var(--text-muted)]">2024–25</span>
      </div>
      <div className="mb-4 text-center">
        <p className="text-[36px] font-bold leading-none tabular-nums text-[var(--color-primary-600)]">
          84%
        </p>
        <p className="mt-1 text-[9px] text-[var(--text-muted)]">placement rate</p>
      </div>
      <p className="mb-1.5 font-mono text-[8px] uppercase tracking-widest text-[var(--text-disabled)]">
        Top recruiters
      </p>
      <div className="space-y-1">
        {PLATFORM_TOP_RECRUITERS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.1 + i * 0.07, ease: EASE }}
            className="flex items-center gap-2 rounded-sm bg-[var(--bg-surface)] px-2.5 py-1.5"
          >
            <span className="font-mono text-[9px] text-[var(--text-disabled)]">#{i + 1}</span>
            <p className="flex-1 text-[10px] text-[var(--text-body)]">{r.name}</p>
            <p className="text-[10px] font-semibold text-[var(--color-primary-600)]">
              {r.offers} offers
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Audience card (left content + right mockup, light theme) ─────────

function PlatformAudienceCard({ Icon, title, desc, cta, mockup }: PlatformAudienceCardData) {
  return (
    <div className="grid overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm lg:grid-cols-2">
      {/* Left: content */}
      <div className="flex flex-col justify-center p-8 lg:p-10">
        <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[var(--bg-brand-subtle)]">
          <Icon size={16} className="text-[var(--color-primary-600)]" />
        </div>
        <h3 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-[var(--text-primary)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-[1.65] text-[var(--text-muted)]">{desc}</p>
        <Link
          href={cta.href}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-brand)] transition-colors hover:text-[var(--interactive-primary-hover)]"
        >
          {cta.label}
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Right: product mockup on a slightly recessed surface */}
      <div className="flex items-center justify-center border-t border-[var(--border-default)] bg-[var(--bg-surface)] p-8 lg:border-l lg:border-t-0">
        <div className="w-full max-w-[260px] overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm">
          {mockup === "executive" && <PlatformExecutiveMockup />}
          {mockup === "corporate" && <PlatformCorporateMockup />}
          {mockup === "institute" && <PlatformInstituteMockup />}
        </div>
      </div>
    </div>
  )
}

// ─── Drawer row (CaseStudies sticky+scale mechanic) ───────────────────

interface PlatformDrawerRowProps {
  card: PlatformAudienceCardData
  index: number
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

function PlatformDrawerRow({
  card,
  index,
  progress,
  range,
  targetScale,
}: PlatformDrawerRowProps) {
  const scale = useTransform(progress, range, [1, targetScale])
  return (
    <div
      className="sticky"
      style={{ top: `${80 + index * 20}px`, zIndex: index + 1 }}
    >
      <motion.div style={{ scale, transformOrigin: "top center" }}>
        <PlatformAudienceCard {...card} />
      </motion.div>
    </div>
  )
}

export function V3Platform() {
  useReducedMotion()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const total = PLATFORM_AUDIENCE_CARDS.length

  return (
    <section
      id="v3-platform"
      data-section-bg="light"
      className="border-t border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <h2 className="text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]">
            Built for every side of{" "}
            <span className="text-[var(--color-primary-600)]">campus hiring.</span>
          </h2>
          <p className="mt-5 text-base leading-[1.55] text-[var(--text-muted)] lg:text-[17px]">
            Executives, corporate teams, and placement offices — each gets the
            tools they actually need, not a generic dashboard.
          </p>
        </motion.div>

        {/* Drawer stack — same sticky+scale mechanic as CaseStudies */}
        <div ref={containerRef} className="mt-16 space-y-5 pb-5">
          {PLATFORM_AUDIENCE_CARDS.map((card, i) => {
            const targetScale = 1 - (total - 1 - i) * 0.04
            const range: [number, number] = [i / total, 1]
            return (
              <PlatformDrawerRow
                key={card.title}
                card={card}
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

// ─── Platform step mockups ────────────────────────────────────────────
// Single bordered surface that swaps between five mini-mockups keyed
// off the active step. Each child mockup remounts on swap so its
// internal entrance animation re-plays — that gives the section a
// "live walkthrough" feel as the highlight walks the pipeline.

function PlatformStepMockup({ step }: { step: number }) {
  const reduce = useReducedMotion()
  return (
    <div
      id="v3-platform-mockup"
      role="tabpanel"
      aria-live="polite"
      className="relative mx-auto mt-8 h-[360px] w-full max-w-[614px] overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-sm lg:mt-10 lg:h-[380px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          className="absolute inset-0"
        >
          {step === 0 && <PostRoleMockup />}
          {step === 1 && <ScreenAssessMockup />}
          {step === 2 && <ShortlistMockup />}
          {step === 3 && <EvaluationMockup />}
          {step === 4 && <HireMockup />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const POST_ROLE_FIELDS: { label: string; value: string; span?: 2 }[] = [
  { label: "Role title",   value: "Senior Frontend Engineer", span: 2 },
  { label: "Location",     value: "Mumbai · Remote OK" },
  { label: "Type",         value: "Full-time" },
  { label: "Experience",   value: "3-5 years" },
  { label: "Compensation", value: "Competitive" },
]

function PostRoleMockup() {
  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          New role · Draft
        </p>
        <motion.span
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-sm bg-[var(--bg-brand-subtle)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-brand)]"
        >
          Publishing
        </motion.span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:gap-4">
        {POST_ROLE_FIELDS.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: EASE }}
            className={cn(
              "rounded-sm border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-2",
              f.span === 2 && "col-span-2",
            )}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {f.label}
            </p>
            <p className="mt-1 text-[13px] font-medium text-[var(--text-primary)]">
              {f.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-end gap-2 pt-4">
        <span className="rounded-sm border border-[var(--border-default)] px-3 py-1.5 text-[12px] font-medium text-[var(--text-muted)]">
          Save draft
        </span>
        <span className="rounded-sm bg-[var(--color-primary-600)] px-3 py-1.5 text-[12px] font-semibold text-white">
          Publish role
        </span>
      </div>
    </div>
  )
}

function ScreenAssessMockup() {
  const DOTS = Array.from({ length: 60 }, (_, i) => i)
  const HIGH = new Set([8, 14, 21, 27, 32, 41, 48, 53])
  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Assessment in progress · 60 candidates
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-primary-600)]">
          8 passed
        </span>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-2">
        {DOTS.map((i) => {
          const hi = HIGH.has(i)
          return (
            <motion.div
              key={i}
              className="aspect-square rounded-full"
              initial={{
                backgroundColor: "var(--color-neutral-200)",
                scale: 1,
              }}
              animate={{
                backgroundColor: hi
                  ? "var(--color-primary-600)"
                  : "var(--color-neutral-200)",
                scale: hi ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.05 + i * 0.01,
                ease: EASE,
              }}
            />
          )
        })}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-3 border-t border-[var(--border-default)] pt-4">
        {[
          { v: "82",  l: "Avg score"       },
          { v: "97%", l: "Completion"      },
          { v: "8",   l: "Quality matches" },
        ].map((s) => (
          <div key={s.l}>
            <p className="text-[18px] font-bold tabular-nums text-[var(--text-primary)]">
              {s.v}
            </p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {s.l}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const SHORTLIST_ROWS = [
  { name: "Aarav Mehta",  role: "FE · Mumbai",    match: 96 },
  { name: "Priya Iyer",   role: "FE · Bangalore", match: 91 },
  { name: "Rahul Sharma", role: "FE · Delhi",     match: 88 },
  { name: "Sneha Reddy",  role: "FE · Hyderabad", match: 84 },
]

function ShortlistMockup() {
  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Top matches · Ranked
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          4 of 247
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {SHORTLIST_ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: EASE }}
            className={cn(
              "flex items-center gap-3 rounded-sm border px-3 py-2.5",
              i === 0
                ? "border-[var(--color-primary-300)] bg-[var(--bg-brand-subtle)]"
                : "border-[var(--border-default)] bg-[var(--bg-page)]",
            )}
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-sm font-mono text-[10px] font-semibold",
                i === 0
                  ? "bg-[var(--color-primary-600)] text-white"
                  : "bg-[var(--bg-surface)] text-[var(--text-primary)]",
              )}
            >
              #{i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                {r.name}
              </p>
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {r.role}
              </p>
            </div>
            <div className="hidden w-32 sm:block">
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-surface)]">
                <motion.div
                  className="h-full bg-[var(--color-primary-600)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.match}%` }}
                  transition={{
                    duration: 0.7,
                    delay: 0.25 + i * 0.08,
                    ease: EASE,
                  }}
                />
              </div>
            </div>
            <p className="w-10 text-right text-[13px] font-semibold tabular-nums text-[var(--color-primary-600)]">
              {r.match}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const EVALUATION_ROUNDS = [
  { name: "Technical screen",  status: "passed"    as const, score: 8.6 },
  { name: "System design",     status: "passed"    as const, score: 9.1 },
  { name: "Culture interview", status: "scheduled" as const, score: null },
]

function EvaluationMockup() {
  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Evaluation pipeline · Aarav Mehta
        </p>
        <span className="rounded-sm bg-[var(--bg-warning-subtle)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-warning)]">
          Round 3 of 3
        </span>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {EVALUATION_ROUNDS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: EASE }}
            className={cn(
              "rounded-sm border p-3",
              r.status === "passed"
                ? "border-[var(--border-default)] bg-[var(--bg-page)]"
                : "border-[var(--color-primary-300)] bg-[var(--bg-brand-subtle)]",
            )}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Round {i + 1}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[var(--text-primary)]">
              {r.name}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {r.status === "passed" ? (
                <>
                  <ShieldCheck
                    size={12}
                    className="text-[var(--color-primary-600)]"
                  />
                  <span className="text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
                    {r.score}/10
                  </span>
                </>
              ) : (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-primary-600)]"
                >
                  Scheduled
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-auto pt-4 text-[12px] leading-[1.5] text-[var(--text-muted)]">
        Recruiter feedback syncs from each round into the candidate profile.
      </p>
    </div>
  )
}

const HIRE_STATS = [
  { v: "5",    l: "Hires this cycle"  },
  { v: "18d",  l: "Time to hire"      },
  { v: "100%", l: "Offer acceptance"  },
  { v: "92",   l: "Quality score"     },
]

function HireMockup() {
  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Offer dispatched · 5 candidates
        </p>
        <span className="rounded-sm bg-[var(--bg-success-subtle)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-success)]">
          All accepted
        </span>
      </div>
      <div className="mt-5 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[5fr_4fr]">
        <div className="flex flex-col justify-center rounded-sm border border-[var(--border-default)] bg-[var(--bg-page)] p-4">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="grid size-12 place-items-center rounded-md bg-[var(--color-primary-600)]/15"
          >
            <ShieldCheck
              size={20}
              className="text-[var(--color-primary-600)]"
            />
          </motion.div>
          <p className="mt-3 text-[14px] font-semibold text-[var(--text-primary)]">
            Welcome to the team
          </p>
          <p className="mt-1 text-[12px] leading-[1.55] text-[var(--text-muted)]">
            Offer letters auto-generated, NDAs e-signed, onboarding kicked off
            in HRIS.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {HIRE_STATS.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.25 + i * 0.08,
                ease: EASE,
              }}
              className="rounded-sm border border-[var(--border-default)] bg-[var(--bg-page)] p-3"
            >
              <p className="text-[18px] font-bold tabular-nums text-[var(--color-primary-600)]">
                {s.v}
              </p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {s.l}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Walkthrough CTA band ─────────────────────────────────────────────
// Mirrors the dark band that sits before the footer on the current and
// AI variants — cobalt orb + grid parallax, eyebrow + H2 + subhead +
// trust bullets + a single Schedule-a-Walkthrough button that opens the
// same modal hoisted in page.tsx.

const TRUST_BULLETS = [
  "Reply within 24 hours",
  "Start with a 30-day pilot on your roles.",
  "We sign your NDA, not the other way around.",
]

function WalkthroughCta({ onScheduleClick }: { onScheduleClick?: () => void }) {
  const ref = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const orbY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-80, 80])
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 120])

  return (
    <section
      ref={ref}
      id="book"
      data-section-bg="dark"
      // Closing note repeats every nav link (Hire / Place / Train) and the
      // Schedule-a-Walkthrough CTA, so the top nav retracts once this section
      // reaches the nav line — read by MarketingNav's section probe.
      data-nav-hidden="true"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[600px] w-[800px] rounded-full"
        style={{
          x: "-50%",
          y: orbY,
          background:
            "radial-gradient(ellipse, rgba(73, 79, 223, 0.22) 0%, transparent 60%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ y: gridY }}
      >
        <GridPattern
          width={56}
          height={56}
          squares={[
            [2, 3],
            [5, 6],
            [3, 9],
            [6, 2],
            [4, 11],
          ]}
          className="inset-0 stroke-white/[0.06] fill-white/[0.06] [mask-image:radial-gradient(900px_circle_at_30%_40%,black,transparent_75%)]"
        />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-8 pb-0 pt-20 lg:px-12 lg:pb-0 lg:pt-24">
        {/* Section heading */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold leading-[1.06] tracking-[-0.025em] text-white">
            Hire, place, or train, we&apos;ll meet you there
          </h2>
        </motion.div>

        {/* Two-card audience split */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-2">
          {/* Hire — Corporates */}
          <div className="flex flex-col rounded-xl border border-white/[0.12] bg-white/[0.06] p-7 lg:p-8">
            <p className="flex items-center gap-1 text-xs font-medium tracking-[0.05em] text-white/45">
              If you&apos;re hiring <ArrowRight size={12} />
            </p>
            <h3 className="mt-3 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white lg:text-[26px]">
              Hire
            </h3>
            <p className="mt-3 flex-1 text-sm leading-[1.6] text-white/55 lg:text-[15px]">
              Campus to senior mandates. Hire from a network that&apos;s AI-assessed and upskilled before you see them, proctored at scale, audit trail included. Your first drive ships in days.
            </p>
          </div>

          {/* Place — Institutes */}
          <div className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.04] p-7 lg:p-8">
            <p className="flex items-center gap-1 text-xs font-medium tracking-[0.05em] text-white/45">
              If you&apos;re looking for placements <ArrowRight size={12} />
            </p>
            <h3 className="mt-3 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white lg:text-[26px]">
              Place
            </h3>
            <p className="mt-3 flex-1 text-sm leading-[1.6] text-white/55 lg:text-[15px]">
              Onboard your batch once. Upskill and assess them to recruiter readiness, then track invitations and outcomes in one dashboard. Built for accredited institutions and NGOs.
            </p>
          </div>
        </div>

        {/* Common CTA */}
        <div className="mt-12 flex justify-center">
          {onScheduleClick ? (
            <Button type="button" size="lg" onClick={onScheduleClick}>
              Schedule a Walkthrough
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="#book">Schedule a Walkthrough</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── CountUp helper ───────────────────────────────────────────────────

// RAF count-up tween. Either provides its own `useInView` trigger (when
// `trigger` is omitted) or accepts one from a parent that wants to
// stagger several counters in sync with a section-entrance animation.
// `delay` (seconds) waits before the tween starts.
function CountUp({
  end,
  trigger,
  delay = 0,
}: {
  end: number
  trigger?: boolean
  delay?: number
}) {
  const reduce = useReducedMotion()
  const localRef = useRef<HTMLSpanElement | null>(null)
  const localInView = useInView(localRef, {
    once: true,
    margin: "-10% 0px",
  })
  const isActive = trigger ?? localInView
  const [value, setValue] = useState(reduce ? end : 0)

  useEffect(() => {
    if (reduce || !isActive) return
    let raf = 0
    let startTs = 0
    const duration = 1800
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
  }, [end, isActive, reduce, delay])

  return <span ref={localRef}>{value.toLocaleString()}</span>
}
