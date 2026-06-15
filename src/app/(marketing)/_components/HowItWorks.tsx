"use client"

import { useEffect, useRef, useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

import type { StepKey } from "./IndiaTalentMap"
import { StepMockupRail } from "./StepMockupRail"

export type { StepKey }

// 4s per step. The progress separator above the active accordion fills
// over this interval via a pure CSS transition with ease-in-out timing,
// so the fill is visually continuous instead of stepped. When the
// timeout fires, the active item folds and the next one unfolds.
// Clicking any trigger switches to that item and restarts the timer.
const STEP_DURATION_MS = 4_000

type Variant = "default" | "filled"

export interface Step {
  id: StepKey
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Pan-Indian talent network",
    description:
      "40,000+ pre-vetted students across 540+ colleges, stitched into one network. Coast to coast.",
  },
  {
    id: 2,
    title: "Pre-vetted talent pool",
    description:
      "Every name carries a proctored score, signed at submission. No résumé padding, no Tier-1 filter doing the gatekeeping.",
  },
  {
    id: 3,
    title: "Tier-blind discovery",
    description:
      "Talent surfaces by performance, not pedigree. Half the network sits outside Metro Tier-1.",
  },
  {
    id: 4,
    title: "Audit-ready hiring trail",
    description:
      "Every score, flag, and shortlist decision: timestamped, signed, exportable. Legal signs off in twenty minutes.",
  },
]

// Single fill bar — keyed by `cycleKey` from the parent so each new
// active step gets a fresh mount + animation. Uses a CSS @keyframes
// animation (defined inline in the parent section) so the parent can
// freeze it mid-flight via `animationPlayState: 'paused'`.
function FillBar({
  duration,
  paused,
}: {
  duration: number
  paused: boolean
}) {
  return (
    <div
      className="h-full bg-[var(--color-primary-600)]"
      style={{
        width: "0%",
        animation: `howItWorksFill ${duration}ms ease-in-out forwards`,
        animationPlayState: paused ? "paused" : "running",
      }}
    />
  )
}

interface HowItWorksProps {
  /** Section anchor id — defaults to "how-it-works". Callers that
   *  repurpose this layout for a different topic (e.g. V3's tier
   *  accordion) can pass a section-specific id so deep links resolve. */
  id?: string
  /** Optional override for the heading. Defaults preserve the
   *  current marketing copy; the AI-narrative variant passes alternative
   *  strings + a custom STEPS array via these props. */
  heading?: string
  steps?: Step[]
  /** Optional override for the sticky right-rail graphic. Receives the
   *  currently-active step id so the variant can swap mockups in. Defaults
   *  to the IndiaTalentMap card. */
  rightRail?: (activeId: StepKey) => React.ReactNode
  /** Optional override for the inline mobile graphic rendered inside each
   *  open accordion content panel. Receives the step id. Defaults to the
   *  IndiaTalentMap card. */
  mobileGraphic?: (stepId: StepKey) => React.ReactNode
  /** When true, the right rail fills the grid row vertically (matching
   *  the accordion column height) instead of being sticky-pinned to the
   *  viewport. Callers whose right rail is its own self-sizing
   *  visualisation (e.g. V3's tier layer stack) should opt in. */
  stretchRightRail?: boolean
  /** When true, hide the default/filled segmented control in the
   *  section header. The accordion stays locked to the "default"
   *  variant. Used by surfaces that don't need the toggle (e.g. V3's
   *  tier section). */
  hideVariantToggle?: boolean
}

export function HowItWorks({
  id = "how-it-works",
  heading = "One platform. Every level of hire.",
  steps = STEPS,
  rightRail,
  mobileGraphic,
  stretchRightRail = false,
  hideVariantToggle = false,
}: HowItWorksProps = {}) {
  const [activeId, setActiveId] = useState<StepKey>(steps[0].id)
  // Visual variant — toggled by the segmented control at the top of the
  // section. "default" leaves the active row flat in the column; "filled"
  // wraps the active row's title + description in a shared
  // var(--bg-accent-subtle) container so the open element reads as one.
  const [variant, setVariant] = useState<Variant>("default")
  // Pause autoplay when the section isn't visible — no point scheduling
  // advances for content the user can't see.
  const [inView, setInView] = useState(false)
  // `cycleKey` increments every time the active step changes or we come
  // back into view. It's used as the key on the fill bar so React
  // remounts it — the remount restarts the CSS animation from 0%.
  const [cycleKey, setCycleKey] = useState(0)
  // Pause-on-hover: when the user's cursor enters the active accordion
  // item, freeze the auto-advance timer AND the fill bar; resume from
  // the same point when they move away.
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  // Cycle-elapsed bookkeeping. `cycleStartRef` is updated on every
  // resume; `elapsedRef` accumulates ms across pause segments.
  const cycleStartRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)

  // IntersectionObserver — kick off (or pause) the timer based on whether
  // the section is on screen.
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const el = sectionRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting)
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reset elapsed + cycle start whenever the active step changes (full
  // fresh cycle) or the section re-enters view. The cycleKey bump
  // remounts the FillBar so its CSS animation also restarts from 0.
  useEffect(() => {
    elapsedRef.current = 0
    cycleStartRef.current = Date.now()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCycleKey((k) => k + 1)
  }, [activeId, inView])

  // Translate pause toggles into elapsed-time bookkeeping. Pausing
  // captures the time spent in the current run since cycleStartRef;
  // resuming restamps cycleStartRef so the next elapsed reading starts
  // from now.
  useEffect(() => {
    if (paused) {
      elapsedRef.current += Date.now() - cycleStartRef.current
    } else {
      cycleStartRef.current = Date.now()
    }
  }, [paused])

  // Auto-advance — schedules a single timeout per (resumed) run. When
  // paused, we deliberately skip scheduling. When activeId changes or
  // we re-enter view, the cleanup clears the existing timeout and a
  // fresh one is scheduled with the remaining duration.
  useEffect(() => {
    if (!inView || paused) return
    const remaining = STEP_DURATION_MS - elapsedRef.current
    const timeout = window.setTimeout(() => {
      setActiveId((current) => {
        const idx = steps.findIndex((s) => s.id === current)
        return steps[(idx + 1) % steps.length].id
      })
    }, Math.max(0, remaining))
    return () => window.clearTimeout(timeout)
  }, [activeId, inView, paused, steps])

  const isFilled = variant === "filled"

  return (
    <section
      ref={sectionRef}
      id={id}
      data-section-bg="light"
      className="border-t border-[var(--border-default)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 py-20 lg:px-12 lg:py-24">
        {/* Section header + variant toggle on one row.
            Toggle is a small segmented control sitting top-right on lg+,
            below the title on mobile. */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(32px,4.2vw,48px)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)]">
              {heading}
            </h2>
          </div>

          {/* Variant toggle — segmented control. The two pills share a
              padded track and a single moving thumb-of-selection. Hidden
              when the caller doesn't need the variant switch. */}
          {!hideVariantToggle && (
            <div
              role="tablist"
              aria-label="Accordion style"
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-1"
            >
              {(["default", "filled"] as const).map((v) => {
                const selected = variant === v
                return (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setVariant(v)}
                    className={cn(
                      "rounded-sm px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                      selected
                        ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div
          className={cn(
            "grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16",
            !stretchRightRail && "items-start",
          )}
        >
          {/* Left — accordion. Controlled so autoplay can swap items. */}
          <Accordion
            type="single"
            value={`item-${activeId}`}
            onValueChange={(v) => {
              if (!v) return
              const id = Number(v.replace("item-", ""))
              if (!Number.isNaN(id) && id >= 1 && id <= 4) {
                setActiveId(id as StepKey)
              }
            }}
            className="w-full [&_[data-state]>svg]:hidden"
          >
            {steps.map((step) => {
              const isActive = step.id === activeId
              return (
                <AccordionItem
                  key={step.id}
                  value={`item-${step.id}`}
                  // border-b removed — the progress rail above each row
                  // doubles as the divider. mb-2 gives the filled active
                  // card a touch of air against the next row's divider.
                  className={cn(
                    "relative !border-b-0",
                    isFilled && isActive && "mb-2",
                  )}
                  // Pause-on-hover lives ONLY on the active item — non-
                  // active items don't have a running timer to pause.
                  onMouseEnter={isActive ? () => setPaused(true) : undefined}
                  onMouseLeave={isActive ? () => setPaused(false) : undefined}
                >
                  {/* Progress separator — sits ABOVE the title and IS the
                      divider between rows. For the active row, the inner
                      bar animates from 0% → 100% via CSS transition with
                      ease-in-out over STEP_DURATION_MS, so it eases in
                      and out instead of snapping. */}
                  <div
                    aria-hidden="true"
                    className="relative h-px w-full overflow-hidden bg-[var(--border-default)]"
                  >
                    {isActive ? (
                      <FillBar
                        key={cycleKey}
                        duration={STEP_DURATION_MS}
                        paused={paused}
                      />
                    ) : (
                      <div className="h-full w-0 bg-[var(--color-primary-600)]" />
                    )}
                  </div>

                  {/*
                    Trigger. In "filled" variant, the active row's trigger
                    picks up var(--bg-accent-subtle) and rounds its top
                    corners so it visually fuses with the content panel
                    below. data-[state=open] keys off Radix so the swap
                    happens at exactly the same moment the content opens.
                  */}
                  <AccordionTrigger
                    className={cn(
                      "cursor-pointer py-4 hover:no-underline",
                      isFilled &&
                        "px-4 transition-colors data-[state=open]:rounded-t-md data-[state=open]:bg-[var(--bg-accent-subtle)]",
                    )}
                  >
                    <h3
                      className={cn(
                        "text-left text-[20px] font-semibold leading-[1.3] tracking-[-0.025em] transition-colors lg:text-[24px]",
                        isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-muted)]",
                      )}
                    >
                      {step.title}
                    </h3>
                  </AccordionTrigger>

                  {/*
                    Content. In "filled" variant the inner div carries the
                    same bg-accent-subtle, rounded-b-md, and matching px-4
                    so trigger + content read as a single card.
                  */}
                  <AccordionContent
                    className={cn(
                      "!pt-0",
                      isFilled &&
                        "rounded-b-md bg-[var(--bg-accent-subtle)] px-4 !pb-4",
                    )}
                  >
                    <p className="text-[15px] leading-[1.55] text-[var(--text-muted)]">
                      {step.description}
                    </p>
                    {/* Mobile-only graphic — desktop uses the sticky right
                        rail. Variant can swap the graphic via the
                        mobileGraphic slot; default is the shared step
                        mockup rail in its compact form. */}
                    <div className="mt-5 lg:hidden">
                      {mobileGraphic ? (
                        mobileGraphic(step.id)
                      ) : (
                        <StepMockupRail step={step.id} compact />
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {/* Right — graphic column. Default behaviour: sticky-pinned at
              the viewport top so it follows the user as they scroll the
              accordion on long screens. When `stretchRightRail` is set,
              the column fills the grid row instead so its height tracks
              the accordion column exactly (used by callers whose graphic
              is its own self-sizing visualisation). */}
          <div
            className={cn(
              "hidden lg:block",
              stretchRightRail ? "lg:h-full" : "sticky top-28",
            )}
          >
            {rightRail ? rightRail(activeId) : <StepMockupRail step={activeId} />}
          </div>
        </div>
      </div>

      {/* Keyframe used by FillBar. Defined inline so the section is fully
          self-contained — no globals.css change needed. */}
      <style>{`@keyframes howItWorksFill { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}
