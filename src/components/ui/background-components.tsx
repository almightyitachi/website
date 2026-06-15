// Subtle radial glow used as an ambient backdrop behind cards on the
// landing page. Mirrors the upstream "background-components" pattern but
// swaps the warm yellow tint for PluginLive design-system colours so the
// brand-multi storytelling carries through behind the chrome. Glow sits
// 48px beyond the wrapped element's bounding box, so the halo reads past
// the card edges into the surrounding section.

import * as React from "react"

import { cn } from "@/lib/utils"

type GlowTint = "primary" | "navy" | "amber" | "orange"

// Subtle-variant hex values mirror docs/design-system.md exactly so the
// glow lines up with the rest of the brand-multi palette.
const GLOW_TINT: Record<GlowTint, string> = {
  primary: "#EDEDFB", // --bg-accent-subtle (primary-50)
  navy:    "#E5E5F4", // --color-brand-navy-subtle
  amber:   "#FFF3D1", // --color-brand-amber-subtle
  orange:  "#FFE3D1", // --color-brand-orange-subtle
}

interface CardGlowProps {
  tint?: GlowTint
  /** 0..1 multiplier on the glow opacity. 0.7 reads as a soft pastel halo. */
  intensity?: number
  className?: string
  children?: React.ReactNode
}

/**
 * Wraps any card / product mockup with a soft radial glow seated behind it.
 * The halo extends past the wrapper's bounding box (~48px) so it bleeds
 * into the surrounding section rather than ending sharply at the card edge.
 */
export function CardGlow({
  tint = "primary",
  intensity = 0.7,
  className,
  children,
}: CardGlowProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-12 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${GLOW_TINT[tint]} 0%, transparent 70%)`,
          opacity: intensity,
          mixBlendMode: "multiply",
        }}
      />
      {children}
    </div>
  )
}

// ─── Reference full-page demo ────────────────────────────────────────
// Kept around for parity with the upstream snippet so anyone grepping the
// component name from the docs lands on a working example. Not wired into
// the landing page.

export function Component() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg-page)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #EDEDFB 0%, transparent 70%)",
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  )
}
