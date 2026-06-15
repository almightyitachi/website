"use client"

import { HowItWorks, type Step } from "../_components/HowItWorks"
import { StepMockupRail } from "../_components/StepMockupRail"

// AI narrative variant of Section 2. Same accordion + auto-advance
// behaviour as the default; both variants now share the same animated
// step-mockup rail. Only the eyebrow, heading, and per-step copy change
// between variants.

const AI_STEPS: Step[] = [
  {
    id: 1,
    title: "Pan-India talent network",
    description:
      "40,000+ candidates across 540+ colleges, stitched into one network. Coast to coast, not just Tier-1 metros.",
  },
  {
    id: 2,
    title: "Pre-vetted pool, filter to the role",
    description:
      "Every name carries a proctored score, signed at submission. Filter against the JD and the best candidates surface, instantly.",
  },
  {
    id: 3,
    title: "Ranked, with the rationale",
    description:
      "Every candidate is scored against the JD and ranked. Alongside the rank, a one-paragraph rationale your team can defend.",
  },
  {
    id: 4,
    title: "Audit-ready hiring ledger",
    description:
      "Every score, flag, and shortlist decision: timestamped, signed, exportable. Legal signs off in twenty minutes.",
  },
]

export function HowItWorksAi() {
  return (
    <HowItWorks
      heading="Four moments. One ledger."
      steps={AI_STEPS}
      rightRail={(id) => <StepMockupRail step={id} />}
      mobileGraphic={(id) => <StepMockupRail step={id} compact />}
    />
  )
}
