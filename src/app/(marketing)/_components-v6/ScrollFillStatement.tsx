"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion"

// Landing Section 2 — problem → solution statement, between the hero
// (Section 1) and the Hiring Stack (Section 3). See docs/landing-sections.md.
// As the band scrolls through the viewport the words "fill" in one by one —
// each word lifts from a faint rest state to full ink, and the PluginLive
// solution clause resolves to cobalt. A pure transform/opacity effect (no
// layout animation), gated for reduced motion.

const PROBLEM =
  "Every learner has potential. Every employer seeks capability. Resumes often tell only part of the story."
const SOLUTION =
  "PluginLive's AI platform assesses real-world skills, identifies opportunities for growth, and delivers personalised upskilling pathways, bridging the gap between talent and opportunity so employers hire with confidence and learners become truly role-ready."

const WORDS: { word: string; brand: boolean }[] = [
  ...PROBLEM.split(" ").map((word) => ({ word, brand: false })),
  ...SOLUTION.split(" ").map((word) => ({ word, brand: true })),
]

export function ScrollFillStatement() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Fill is driven by the band's pass through the viewport: it starts as the
  // band rises into the lower third and completes as it clears the upper
  // half, so the reveal tracks the read rather than the whole scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  })

  const total = WORDS.length

  return (
    <section
      data-section-bg="light"
      aria-label="Why PluginLive"
      className="relative z-10 overflow-hidden border-y border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      {/* Bordered frame — column rails matching the other light bands */}
      <div className="relative mx-auto max-w-6xl border-x border-[var(--border-default)] px-6 py-28 lg:px-12 lg:py-40">
        <div ref={ref} className="mx-auto max-w-4xl">
          <p className="flex flex-wrap text-[clamp(26px,4.2vw,50px)] font-semibold leading-[1.22] tracking-[-0.02em]">
            {WORDS.map((w, i) => (
              <Word
                key={i}
                brand={w.brand}
                progress={scrollYProgress}
                range={[i / total, (i + 1) / total]}
                reduce={reduce ?? false}
              >
                {w.word}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

function Word({
  children,
  brand,
  progress,
  range,
  reduce,
}: {
  children: string
  brand: boolean
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const fill = brand ? "var(--color-primary-600)" : "var(--text-primary)"

  return (
    <span className="relative mr-[0.28em] mt-[0.18em]">
      {/* Faint rest layer — always visible so unfilled words read as ghosted */}
      <span aria-hidden className="text-[var(--text-primary)] opacity-[0.14]">
        {children}
      </span>
      {/* Filled layer — fades to full ink (or cobalt) as scroll reaches it */}
      <motion.span
        className="absolute inset-0"
        style={{ color: fill, opacity: reduce ? 1 : opacity }}
      >
        {children}
      </motion.span>
    </span>
  )
}
