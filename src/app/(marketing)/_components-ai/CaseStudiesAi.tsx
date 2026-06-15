"use client"

import { CaseStudies } from "../_components/CaseStudies"

// AI narrative variant of the case-studies section. Same layout, same
// case-study cards — only the section heading + subhead change to
// foreground the AI-narrated framing.

export function CaseStudiesAi() {
  return (
    <CaseStudies
      heading="Hires explained. Teams approved."
      subhead="Three teams. Three hiring problems. One engine ranking and explaining every candidate."
    />
  )
}
