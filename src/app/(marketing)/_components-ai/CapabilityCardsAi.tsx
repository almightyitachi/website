"use client"

import { AiEyebrow } from "@/components/ui/ai-eyebrow"

import { CapabilityCards } from "../_components/CapabilityCards"

// AI narrative variant of Section 6. Same 4 audience cards, same 3D
// tilt, same routes. Each card hint is reworded so the AI verb leads.

export function CapabilityCardsAi() {
  return (
    <CapabilityCards
      eyebrow={<AiEyebrow>One platform, every audience</AiEyebrow>}
      heading={
        <>
          One platform.{" "}
          <span className="text-[var(--color-primary-600)]">Every audience.</span>
        </>
      }
      subhead="Corporates, institutes, executives, students. The same engine ranks and explains whichever lane closes their next move."
      hints={{
        corporates:
          "Filter the network. A pre-vetted pool, ranked and explained.",
        tpos: "Onboard the batch once. The climb tracked live.",
        "executive-search":
          "IB · PE/VC · Wealth · AMC. A second opinion on every mandate.",
        "career-centre":
          "Build the skill. Earn the certificate. Surfaced to recruiters who're hiring.",
      }}
    />
  )
}
