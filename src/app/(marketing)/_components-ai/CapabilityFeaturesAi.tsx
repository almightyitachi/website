"use client"

import { CapabilityFeatures } from "../_components/CapabilityFeatures"

// AI narrative variant of Section 5. Same three alternating audience
// bands, same mockups, same alternating dark/light theming — only the
// title + description per band are reframed around the AI engine.

export function CapabilityFeaturesAi({ heroIsDark }: { heroIsDark: boolean }) {
  return (
    <CapabilityFeatures
      heroIsDark={heroIsDark}
      copyOverrides={{
        "executive-search": {
          title: "Founder-led, with a second opinion.",
          description:
            "Four practice areas across IB, PE/VC, Wealth, and AMC. Every search runs through a co-founder, with a second opinion on acumen, alignment, and fit.",
        },
        corporates: {
          title: "Cohorts ranked and explained, before Friday.",
          description:
            "Set the filters. Every candidate from the network is scored and explained. Your dashboard ships with the rationale, EEO-compliant by default.",
        },
        tpos: {
          title: "See who's ready.",
          description:
            "Onboard your batch once. Every drive attempt is ranked and the students worth pushing forward are flagged. Tier-blind, and built for accredited institutions.",
        },
      }}
    />
  )
}
