"use client"

import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Shared V6 section heading — matches the "Levels" / "Ecosystem" pattern:
 * a bold headline with one cobalt-highlighted hook word that wipes in.
 * `pre` / `hook` / `post` compose the line; `tone` picks the surface so
 * the highlight reads on light (cobalt-600) or dark (cobalt-300) bands.
 */
export function SectionHeading({
  pre,
  hook,
  post,
  tone = "light",
  className,
}: {
  pre: string
  hook: string
  post?: string
  tone?: "light" | "dark"
  className?: string
}) {
  const reduce = useReducedMotion()
  const isDark = tone === "dark"

  return (
    <motion.h2
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, ease: EASE }}
      className={cn(
        "max-w-[24ch] text-[clamp(32px,4vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em]",
        isDark ? "text-white" : "text-[var(--text-primary)]",
        className,
      )}
    >
      {pre}{" "}
      <motion.span
        className={cn(
          // Highlighted hook word — serif (Instrument Serif), italic — the
          // landing-wide treatment for emphasised heading values. Reveal is
          // opacity + slide (NOT a clip-path wipe) so the italic serif's
          // descenders (y, g) can never be cropped by a clip box.
          "inline-block font-serif font-normal italic tracking-[-0.04em]",
          isDark
            ? "text-[var(--color-primary-300)]"
            : "text-[var(--color-primary-600)]",
        )}
        initial={reduce ? false : { opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.25, ease: EASE }}
      >
        {hook}
      </motion.span>
      {post ? <>{" "}{post}</> : null}
    </motion.h2>
  )
}
