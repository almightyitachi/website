"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import {
  FloatingAvatarsHero,
  type FloatingAvatar,
} from "@/components/ui/floating-avatars-hero"
import { cn } from "@/lib/utils"

// 16 student avatars scattered evenly across the full hero viewport. The 6
// default avatars (ids 1-6) also show on mobile; the 10 fillers (ids 7-16)
// are desktop-only so the mobile layout stays uncluttered.
//
// Desktop layout (16 = 5 + 4 + 3 + 4):
//   • Top strip (top-[2–10%]) — 5 avatars across the full width. Text is
//     well below this band so any horizontal position is safe.
//   • Left side gutter (top-[26–70%], left-[4–14%]) — 4 avatars hugging
//     the left edge, all outside the max-w-3xl text column.
//   • Right side gutter (top-[26–70%], right-[4–8%]) — 3 avatars on the
//     mirror side.
//   • Bottom strip (top-[86–88%]) — 4 avatars below the CTAs and above
//     the LEARN MORE scroll prompt. No avatar at the center column of
//     the bottom strip — that vertical column is reserved for the
//     CTA bar / LEARN MORE so nothing gets clipped on shorter laptops.
const STUDENT_AVATARS: FloatingAvatar[] = [
  {
    id: 1,
    name: "Aarav Rao",
    persona: "student",
    accent: "amber",
    imgSrc: "https://randomuser.me/api/portraits/men/15.jpg",
    quote: "I'm a final-year student, placed at IIT Bombay's research lab through PluginLive's network.",
    stat: { value: "₹22 LPA", label: "Final offer" },
    className: "top-[1%] left-[6%] lg:top-[3%]",
  },
  {
    id: 2,
    name: "Ananya Sharma",
    persona: "student",
    accent: "navy",
    imgSrc: "https://randomuser.me/api/portraits/women/90.jpg",
    quote: "I'm a B.Tech student. Cleared the proctored assessment, got 3 offers in 10 days.",
    stat: { value: "3 offers", label: "In 10 days" },
    className: "top-[1%] right-[6%] lg:top-[4%]",
  },
  {
    id: 3,
    name: "Karan Mehta",
    persona: "student",
    accent: "orange",
    imgSrc: "https://randomuser.me/api/portraits/men/91.jpg",
    quote: "I'm an MBA grad who joined a Big-4 strategy team. Zero recruiter spam, all signal.",
    stat: { value: "Top 2%", label: "Percentile" },
    className: "top-[1%] left-1/2 -translate-x-1/2 lg:top-[28%] lg:left-[4%] lg:translate-x-0",
  },
  {
    id: 4,
    name: "Riya Kulkarni",
    persona: "student",
    accent: "amber",
    imgSrc: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "I'm a Data Science student. Recruiters reached me directly, no college-tier filter.",
    stat: { value: "5 recruiters", label: "Reached out" },
    className: "bottom-[1%] left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:top-[26%] lg:right-[4%]",
  },
  {
    id: 5,
    name: "Vivek Joshi",
    persona: "student",
    accent: "navy",
    imgSrc: "https://randomuser.me/api/portraits/men/41.jpg",
    quote: "I'm a final-year ECE. Proctored test cleared, offer signed in two weeks.",
    stat: { value: "14 days", label: "Test to offer" },
    className: "bottom-[1%] left-[6%] lg:bottom-auto lg:top-[86%]",
  },
  {
    id: 6,
    name: "Diya Reddy",
    persona: "student",
    accent: "orange",
    imgSrc: "https://randomuser.me/api/portraits/women/33.jpg",
    quote: "I'm a Stella Maris graduate. Corporates discovered our college via PluginLive.",
    stat: { value: "8 corporates", label: "Found her college" },
    className: "bottom-[1%] right-[6%] lg:bottom-auto lg:top-[86%]",
  },
  // Top band — wide horizontal scatter above the headline
  {
    id: 7,
    name: "Neha Iyer",
    persona: "student",
    accent: "navy",
    imgSrc: "https://randomuser.me/api/portraits/women/12.jpg",
    quote: "I'm a CS undergrad. The audit trail meant my offer letter shipped the same day.",
    stat: { value: "₹18 LPA", label: "Day-zero" },
    className: "hidden lg:block lg:top-[8%] lg:left-[22%]",
  },
  {
    id: 8,
    name: "Rohan Pillai",
    persona: "student",
    accent: "amber",
    imgSrc: "https://randomuser.me/api/portraits/men/77.jpg",
    quote: "I'm an Electrical student. Every interview round was logged, no surprises, no rework.",
    stat: { value: "100%", label: "Audit-pass" },
    className: "hidden lg:block lg:top-[3%] lg:left-[42%]",
  },
  // Upper-middle — closer to headline, outer
  {
    id: 9,
    name: "Sanya Bose",
    persona: "student",
    accent: "orange",
    imgSrc: "https://randomuser.me/api/portraits/women/52.jpg",
    quote: "I'm a Tier-2 MBA, shortlisted alongside IIM grads. Pre-vetting opened the door.",
    stat: { value: "4 offers", label: "In 2 weeks" },
    className: "hidden lg:block lg:top-[8%] lg:right-[22%]",
  },
  {
    id: 10,
    name: "Aditya Nair",
    persona: "student",
    accent: "navy",
    imgSrc: "https://randomuser.me/api/portraits/men/29.jpg",
    quote: "I'm a Mechanical final-year, ranked top of my cohort. Three corporates reached out that week.",
    stat: { value: "Top 5%", label: "Cohort rank" },
    className: "hidden lg:block lg:top-[48%] lg:left-[7%]",
  },
  // Lower-middle — below CTAs, outer
  {
    id: 11,
    name: "Tara Krishnan",
    persona: "student",
    accent: "amber",
    imgSrc: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "I'm a Chemical Eng student who closed a pre-placement offer before campus week even started.",
    stat: { value: "₹16 LPA", label: "PPO" },
    className: "hidden lg:block lg:top-[46%] lg:right-[7%]",
  },
  {
    id: 12,
    name: "Vikram Singh",
    persona: "student",
    accent: "orange",
    imgSrc: "https://randomuser.me/api/portraits/men/55.jpg",
    quote: "I'm a B.Tech CSE, ranked top of the coding test. Three product teams chased the call.",
    stat: { value: "Top 1%", label: "Coding test" },
    className: "hidden lg:block lg:top-[68%] lg:left-[4%]",
  },
  // Bottom band — wide horizontal scatter below the CTAs
  {
    id: 13,
    name: "Meera Joshi",
    persona: "student",
    accent: "navy",
    imgSrc: "https://randomuser.me/api/portraits/women/24.jpg",
    quote: "I'm a Mass Comm student who landed at a creative agency I'd never have found without the network.",
    stat: { value: "12 days", label: "Application to offer" },
    className: "hidden lg:block lg:top-[70%] lg:right-[4%]",
  },
  {
    id: 14,
    name: "Ishaan Verma",
    persona: "student",
    accent: "orange",
    imgSrc: "https://randomuser.me/api/portraits/men/63.jpg",
    quote: "I'm a Tier-3 college student. Pre-vetting flattened the prestige gap. Corporates judged my score, not my college name.",
    stat: { value: "₹14 LPA", label: "First offer" },
    className: "hidden lg:block lg:top-[88%] lg:left-[22%]",
  },
  // Upper-mid second row for richer scatter
  {
    id: 15,
    name: "Lakshmi Pillai",
    persona: "student",
    accent: "amber",
    imgSrc: "https://randomuser.me/api/portraits/women/45.jpg",
    quote: "I'm a Biotech student. Three R&D teams reviewed my proctored result before I'd left campus.",
    stat: { value: "3 R&D teams", label: "Reviewed" },
    // Was lg:top-[82%] lg:left-[42%] — center-bottom landed under the
    // CTA bar on shorter laptop viewports. Moved into the left gutter at
    // the subtitle vertical (60%) so it sits clear of both the CTA row
    // and the LEARN MORE prompt at every viewport height.
    className: "hidden lg:block lg:top-[60%] lg:left-[14%]",
  },
  {
    id: 16,
    name: "Aryan Bhatt",
    persona: "student",
    accent: "navy",
    imgSrc: "https://randomuser.me/api/portraits/men/85.jpg",
    quote: "I'm a final-year Civil. The audit trail showed exactly where I stood at every interview round.",
    stat: { value: "Top 8%", label: "Cohort rank" },
    className: "hidden lg:block lg:top-[88%] lg:right-[22%]",
  },
]

function handleScrollDown() {
  if (typeof window === "undefined") return
  window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
}

export type HeroVariant = "light" | "dark"

interface AnimatedHeroV3Props {
  variant?: HeroVariant

  /** Optional eyebrow node rendered above the H1. Used by the AI
   *  narrative variant to inject the cobalt Sparkles chip. */
  eyebrow?: React.ReactNode
  /** Optional H1 override. When provided, replaces the default
   *  two-span ("540+ corporates." / "One curated talent network.")
   *  headline. The AI narrative variant uses this to render the
   *  gradient accent phrase. */
  headline?: React.ReactNode
  /** Optional subhead override. */
  subhead?: React.ReactNode
  /** Optional CTA row override. Replaces the default two-button row
   *  (Schedule a Demo / See how prevetting is done). The V3 variant
   *  uses this to render its own "Schedule a Walkthrough" CTA. */
  ctas?: React.ReactNode
}

export function AnimatedHeroV3({
  variant: variantProp,
  eyebrow,
  headline,
  subhead,
  ctas,
}: AnimatedHeroV3Props = {}) {
  const variant = variantProp ?? "dark"
  const isDark = variant === "dark"

  // Track scroll progress through the hero so the avatar layer can
  // converge toward the bottom-centre (where the India map sits in the
  // section below) as the user scrolls.
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  // Background parallax — the structural grid drifts down as the user
  // scrolls, lagging behind the foreground content. Sells the hero as a
  // layered scene rather than a flat band.
  const gridY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, 160],
  )
  // Dark-mode cobalt halo drifts gently with the same scroll, slightly
  // faster than the grid so the depth reads as two distinct planes.
  const haloY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, 90],
  )

  return (
    <section
      ref={sectionRef}
      data-section-bg={isDark ? "dark" : "light"}
      className={cn(
        "relative flex min-h-screen flex-col overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#0A0A0A]" : "bg-[var(--bg-page)]",
      )}
    >
      {/* Column rail — transparent vertical lines at max-w-6xl edges,
          matching the border-x rail in every section below. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 mx-auto max-w-6xl border-x",
          isDark ? "border-white/[0.06]" : "border-[var(--border-default)]",
        )}
      />

      {/* Dark variant — glass radial gradient of primary indigo seated
          behind the nav. Two layered ellipses give the gradient depth: a
          wide soft cobalt outer halo and a deeper navy inner core. The
          halo drifts down on scroll for a parallax depth layer. */}
      {isDark && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70vh]"
          style={{
            y: haloY,
            background:
              "radial-gradient(ellipse 75% 60% at 50% -5%, rgba(73,79,223,0.38) 0%, rgba(31,35,116,0.22) 28%, transparent 70%), radial-gradient(ellipse 45% 35% at 50% 0%, rgba(73,79,223,0.30) 0%, transparent 65%)",
          }}
        />
      )}

      {/* Background grid — same texture, stroke flips between neutral and
          near-transparent white in dark mode. Wrapped in a motion layer
          that drifts down on scroll, sitting BEHIND the foreground
          content for a parallax depth effect. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ y: gridY }}
      >
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
      </motion.div>

      {/* Avatar layer — unchanged. The light-coloured pills pop against
          the dark background nicely so we keep them as-is. */}
      <div className="pointer-events-none absolute inset-x-0 top-[100px] bottom-[120px] hidden min-[320px]:block">
        <div className="pointer-events-auto relative mx-auto h-full max-w-7xl px-6 lg:px-12">
          <FloatingAvatarsHero
            avatars={STUDENT_AVATARS}
            scrollProgress={scrollYProgress}
          />
        </div>
      </div>

      {/* Vertically-centered text block */}
      <div className="pointer-events-none relative z-10 flex flex-1 items-center pb-28 pt-32 lg:pb-32 lg:pt-40">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl px-6 text-center lg:px-12">
          {eyebrow && (
            <div
              className="fade-up mb-2 flex justify-center"
              style={{ animationDelay: "0ms" }}
            >
              {eyebrow}
            </div>
          )}

          <h1
            className={cn(
              "fade-up text-[clamp(38px,5vw,64px)] font-bold leading-[1.04] tracking-[-0.025em] transition-colors",
              isDark ? "text-white" : "text-[var(--text-primary)]",
            )}
            style={{ animationDelay: eyebrow ? "60ms" : "0ms" }}
          >
            {headline ?? (
              <>
                <span className="block text-[clamp(18px,2.5vw,26px)] font-medium tracking-normal">Hire at every</span>
                <span className="block font-[900] uppercase">ALTITUDE</span>
              </>
            )}
          </h1>

          <p
            className={cn(
              "fade-up mx-auto mt-8 max-w-2xl text-lg leading-[1.55] lg:text-[19px] transition-colors",
              isDark ? "text-white/75" : "text-[var(--text-body)]",
            )}
            style={{ animationDelay: "100ms" }}
          >
            {subhead ?? (
              <>
                Pre-vetted at 540+ colleges. Every shortlist ranked,
                audit-ready, and shipped in 48 hours.
              </>
            )}
          </p>

          <div
            className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "200ms" }}
          >
            {ctas ?? (
              <>
                <Button asChild size="lg">
                  <Link href="#book">Schedule a Demo</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(
                    isDark &&
                      "border-white/20 bg-white/[0.05] text-white shadow-none hover:bg-white/[0.10] hover:text-white",
                  )}
                >
                  <Link href="#prevet">
                    See how prevetting is done
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Learn-more scroll prompt */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        aria-label="Scroll to learn more"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 transition-colors",
          isDark
            ? "text-white/55 hover:text-white"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
        )}
      >
        <ChevronDown size={18} strokeWidth={2.25} />
      </motion.button>
    </section>
  )
}
