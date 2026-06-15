"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { useColorIteration } from "@/components/platform/ColorIterationSwitcher"
import { cn } from "@/lib/utils"

import { HeroProductMockup } from "./HeroProductMockup"

const MULTI_WORD_COLORS = [
  "var(--color-primary-600)",
  "var(--color-brand-navy)",
  "var(--color-brand-amber)",
  "var(--color-brand-orange)",
  "var(--color-primary-600)",
] as const

const MULTI_ANCHOR_COLORS = [
  "var(--color-primary-600)",
  "var(--color-brand-navy)",
  "var(--color-brand-amber)",
  "var(--color-brand-orange)",
] as const

const ROTATING_WORDS = [
  "audited",
  "proctored",
  "ranked",
  "verified",
  "cleared",
] as const

const HERO_ANCHORS = [
  { value: "40,000+", label: "Pre-vetted students" },
  { value: "540+",    label: "Partner colleges" },
  { value: "48 hr",   label: "JD to ranked shortlist" },
  { value: "EEO",     label: "Compliant by default" },
] as const

// Exponential ease-out (matches brand motion law: no bounce, no elastic)
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export function AnimatedHero() {
  const reduceMotion = useReducedMotion()
  const colorIter = useColorIteration()
  const [index, setIndex] = useState(0)
  const words = useMemo(() => ROTATING_WORDS, [])
  const wordColor =
    colorIter === "multi"
      ? MULTI_WORD_COLORS[index % MULTI_WORD_COLORS.length]
      : "var(--color-primary-600)"

  useEffect(() => {
    if (reduceMotion) return
    const id = setTimeout(() => {
      setIndex((n) => (n === words.length - 1 ? 0 : n + 1))
    }, 2400)
    return () => clearTimeout(id)
  }, [index, words, reduceMotion])

  return (
    <section
      data-section-bg="light"
      className="relative overflow-hidden pt-32 lg:pt-40"
    >
      {/* Background grid — design-system neutral, fades around the middle of
          the product mockup and dissolves into the white canvas before the
          stats anchor strip. */}
      <GridPattern
        width={48}
        height={48}
        squares={[
          [3, 4],
          [7, 2],
          [11, 6],
          [4, 9],
          [9, 11],
          [14, 4],
          [17, 10],
          [21, 7],
          [25, 3],
          [28, 9],
        ]}
        className="inset-0 h-full stroke-[var(--color-neutral-200)] fill-[var(--color-neutral-200)] [mask-image:linear-gradient(to_bottom,black_0%,black_42%,rgba(0,0,0,0.45)_62%,transparent_88%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* ─── TEXT CONTAINER (top) ─── */}
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="fade-up text-[clamp(38px,5vw,64px)] font-bold leading-[1.04] tracking-[-0.025em] text-[var(--text-primary)]"
            style={{ animationDelay: "0ms" }}
          >
            <span className="block">Hire campus talent</span>
            <span className="block">that&apos;s already been</span>

            {/* Rotating word slot. Reserve height with non-breaking space;
                absolute-position the active word centered in the slot. */}
            <span
              className="relative block overflow-hidden transition-colors duration-300"
              style={{ color: wordColor }}
              aria-live="polite"
            >
              <span aria-hidden="true">&nbsp;</span>
              {words.map((word, i) => {
                const active = i === index
                return (
                  <motion.span
                    key={word}
                    className="absolute inset-x-0 top-0 font-bold"
                    aria-hidden={!active}
                    initial={reduceMotion ? false : { opacity: 0, y: "100%" }}
                    animate={
                      active
                        ? { opacity: 1, y: "0%" }
                        : {
                            opacity: 0,
                            y: i < index ? "-100%" : "100%",
                          }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.6,
                      ease: EASE_OUT_EXPO,
                    }}
                  >
                    {word}.
                  </motion.span>
                )
              })}
              <span className="sr-only">{words.join(", ")}.</span>
            </span>
          </h1>

          <p
            className="fade-up mx-auto mt-8 max-w-2xl text-lg leading-[1.55] text-[var(--text-body)] lg:text-[19px]"
            style={{ animationDelay: "100ms" }}
          >
            PluginLive runs proctored assessments at 540+ Indian colleges,
            then opens that pool to corporates as a ranked, audit-ready
            shortlist. No job-board noise. No agency middle stack.
          </p>

          <div
            className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "200ms" }}
          >
            <Button asChild size="lg">
              <Link href="#book">Book a walkthrough</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#audit">
                See the audit trail
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* ─── IMAGE CONTAINER (bottom) ─── */}
        <div
          className="fade-up mx-auto mt-16 max-w-5xl lg:mt-20"
          style={{ animationDelay: "300ms" }}
        >
          <HeroProductMockup />
        </div>

        {/* Stats anchor strip — sits on clean white below the grid fade */}
        <div
          className="fade-up mt-20 lg:mt-28"
          style={{ animationDelay: "400ms" }}
        >
          <div className="grid grid-cols-2 border-y border-[var(--border-default)] lg:grid-cols-4">
            {HERO_ANCHORS.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "px-4 py-6 lg:px-6 lg:py-8",
                  i % 2 === 1 && "border-l border-[var(--border-default)]",
                  "lg:border-l lg:border-[var(--border-default)]",
                  i === 0 && "lg:border-l-0",
                  i >= 2 && "border-t border-[var(--border-default)] lg:border-t-0"
                )}
              >
                <p
                  className="text-[clamp(22px,6vw,40px)] font-bold leading-[1] tracking-[-0.02em] tabular-nums"
                  style={{
                    color:
                      colorIter === "multi"
                        ? MULTI_ANCHOR_COLORS[i % MULTI_ANCHOR_COLORS.length]
                        : "var(--text-primary)",
                  }}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)] lg:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
