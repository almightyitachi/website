"use client"

import { AiEyebrow } from "@/components/ui/ai-eyebrow"

import {
  AnimatedHeroV3,
  type HeroVariant,
} from "../_components/AnimatedHeroV3"

// AI narrative variant of the L1 hero. Same scaffolding (floating
// avatars, scroll progress, fade-up sequence, dark/light variant
// toggle) — only the eyebrow, H1, and subhead change. The accent
// phrase in the H1 renders with a cobalt gradient: this is the only
// place on the L1 page that uses the gradient treatment, so it stays
// a signature element.

interface AnimatedHeroV3AiProps {
  variant?: HeroVariant
}

export function AnimatedHeroV3Ai({
  variant,
}: AnimatedHeroV3AiProps = {}) {
  return (
    <AnimatedHeroV3
      variant={variant}
      eyebrow={<AiEyebrow>Every candidate, explained</AiEyebrow>}
      headline={
        <>
          Every candidate,{" "}
          <span className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
            explained.
          </span>
        </>
      }
      subhead="Scored, ranked, and narrated across 540+ colleges, so every shortlist ships with the rationale your team can defend."
    />
  )
}
