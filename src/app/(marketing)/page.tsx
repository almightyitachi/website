"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

import { MarketingFooter } from "@/components/marketing/MarketingFooter"
import { MarketingNav } from "@/components/marketing/MarketingNav"

import { BookMeetingForm } from "./_components/BookMeetingForm"
import { MarketingLanding } from "./_landing/MarketingLanding"

// Homepage — the production marketing landing (MarketingLanding with the
// gradient-bar hero). This is the single production landing surface; the
// earlier narrative explorations live only at /other-variations-landing-page.
// The walkthrough modal is hoisted here so the hero CTA inside
// MarketingLanding can open it.
//
// Canonical section order (see docs/landing-sections.md):
//   0 Navigation bar      — MarketingNav (retracts before Section 8)
//   1 Hero                — GradientBarHero (italic + bell)
//   2 Problem → Solution  — ScrollFillStatement
//   3 Hiring Stack        — HireStageCards (Explore), nav label "Stack"
//   4 Infrastructure      — InfrastructureLayers
//   5 Platform            — HirePlaceTrainCards (Hire / Place / Train)
//   6 Corporate case studies   — CaseStudiesShowcase
//   7 Institutes case studies  — CandidateVoices
//   8 Closing note        — WalkthroughCta
//   9 Footer              — MarketingFooter

export default function MarketingPage() {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false)

  // Lock body scroll + close on Escape while the walkthrough modal is open.
  useEffect(() => {
    if (!walkthroughOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWalkthroughOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [walkthroughOpen])

  return (
    <div
      className="bg-[var(--bg-page)] font-sans"
      // Softened hairlines for the landing surface only: every rail, divider,
      // and card outline reads var(--border-default), so one override calms
      // them all (60% of neutral-200). Dark bands use white/[0.0x] borders
      // and are unaffected; the platform app keeps the full-strength token.
      style={{ "--border-default": "rgba(226,226,231,0.6)" } as React.CSSProperties}
    >
      <MarketingNav onScheduleClick={() => setWalkthroughOpen(true)} />
      <MarketingLanding
        onScheduleClick={() => setWalkthroughOpen(true)}
        heroVariant="gradient"
      />
      <MarketingFooter />

      <AnimatePresence>
        {walkthroughOpen && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="walkthrough-title"
          >
            <motion.button
              type="button"
              aria-label="Close walkthrough form"
              onClick={() => setWalkthroughOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md rounded-xl border border-white/[0.10] bg-[var(--bg-brand)] p-6 shadow-lg lg:p-8"
            >
              <div className="mb-5 flex items-baseline justify-between">
                <div>
                  <p
                    id="walkthrough-title"
                    className="text-base font-semibold text-white"
                  >
                    Schedule a walkthrough
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Reply within 24 hours · We sign your NDA
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWalkthroughOpen(false)}
                  aria-label="Close"
                  className="-mr-2 -mt-2 inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <BookMeetingForm />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
