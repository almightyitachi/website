# Production landing — section map

Canonical section order and names for the production marketing landing page
(`/`), which renders [`MarketingLanding`](../src/app/(marketing)/_landing/MarketingLanding.tsx)
with the **gradient** hero. Sections alternate dark/light to create the
long-scroll reading rhythm. This is the source-of-truth ordering; in-file
comments reference these numbers.

| # | Section | Component · File | Surface |
|---|---------|------------------|---------|
| **0** | **Navigation bar** | `MarketingNav` · [`MarketingNav.tsx`](../src/components/marketing/MarketingNav.tsx) | adaptive — retracts before Section 8, stays gone through the footer |
| **1** | **Hero** | `GradientBarHero` · [`MarketingLanding.tsx`](../src/app/(marketing)/_landing/MarketingLanding.tsx) | dark |
| **2** | **Problem → Solution** | `ScrollFillStatement` · [`ScrollFillStatement.tsx`](../src/app/(marketing)/_components-v6/ScrollFillStatement.tsx) | light |
| **3** | **Hiring Stack** (Sourcing / Evaluation / Upskilling) — nav label "Stack" | `HireStageCards` · [`HireStageCards.tsx`](../src/app/(marketing)/_components-v6/HireStageCards.tsx) | light |
| **4** | **Infrastructure** (Intelligence / Data / Network) | `InfrastructureLayers` · [`InfrastructureLayers.tsx`](../src/app/(marketing)/_components-v6/InfrastructureLayers.tsx) | dark |
| **5** | **Platform** (Hire / Place / Train) | `HirePlaceTrainCards` · [`HirePlaceTrainCards.tsx`](../src/app/(marketing)/_components-ai/HirePlaceTrainCards.tsx) | light |
| **6** | **Corporate case studies** | `CaseStudiesShowcase` · [`CaseStudiesShowcase.tsx`](../src/app/(marketing)/_components-v6/CaseStudiesShowcase.tsx) | light |
| **7** | **Institutes case studies** | `CandidateVoices` · [`CandidateVoices.tsx`](../src/app/(marketing)/_components/CandidateVoices.tsx) | light |
| **8** | **Closing note** ("Hire, place, or train…") | `WalkthroughCta` · [`MarketingLanding.tsx`](../src/app/(marketing)/_landing/MarketingLanding.tsx) | dark |
| **9** | **Footer** | `MarketingFooter` · [`MarketingFooter.tsx`](../src/components/marketing/MarketingFooter.tsx) | dark |

## Proof bands (Sections 6–7)

Both case-study sections open with a horizontal **logo marquee** (Section 6
"Trusted by recruiters at"; Section 7 "Trusted by placement teams at") and frame
their cases with hairline rails + corner "+" crosses (`CornerPlus`). On desktop
the cases lay out as one connected framed block (Section 6: featured card + four
grid cards; Section 7: a 4×2 bento). **Below `lg` both collapse to a swipeable
carousel** (`MobileCaseStudyCarousel`): one uniform fixed-height card at a time
inside a cross-framed cell, with swipe + prev/dot/next controls.

## Finalized variations

Sections 3 and 4 each had alternate layouts during exploration. Production is
locked to a single finalized layout; the dropped variants remain reachable on
`/other-variations-landing-page` (which renders `MarketingLanding` with
`showSectionVariants`).

- **Section 1 (Hero)** — locked to **italic** headline + **bell**-curve bars.
  (Dropped: regular weight, ascending bars.)
- **Section 3 (Hiring Stack)** — locked to the **Explore** cards.
  (Dropped: Levels, Stages list+stats.)
- **Section 4 (Infrastructure)** — locked to the **Infrastructure** layer-cube.
  (Dropped: Ecosystem.)

## Nav visibility

The nav (Section 0) stays visible through Section 7 (Institutes case studies),
then retracts as Section 8 (Closing note) rises into the upper viewport and
stays retracted through Section 9 (Footer) — those links and the primary CTA
are already repeated in the closing note and footer. Implemented via the
`data-nav-hidden` attribute on the closing section, read by `MarketingNav`.
