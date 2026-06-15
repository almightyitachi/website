"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import { CornerPlus } from "./CornerPlus"

// Mobile-only case-study carousel — one uniform card at a time inside a framed,
// cross-cornered cell (matching the desktop framed-rail treatment), with swipe +
// prev/next + dot navigation. Every card is the exact same size and uses the
// same type scale/weights so the set reads as one consistent deck. Both the
// corporate and institute case-study sections feed it a normalised list.

export interface MobileCaseCard {
  /** Short chip — domain (corporate) or institute (institutes). */
  tag: string
  statValue: string
  statLabel: string
  quote: string
  authorName: string
  authorRole: string
}

export function MobileCaseStudyCarousel({ items }: { items: MobileCaseCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== active) setActive(idx)
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const idx = Math.max(0, Math.min(items.length - 1, i))
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div>
      {/* Framed band with detached corner crosses — one card visible, floating
          inside with a margin. */}
      <div className="relative border border-[var(--border-default)]">
        <CornerPlus />
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <div key={i} className="w-full shrink-0 snap-center p-3">
              <article className="mx-auto flex h-[400px] w-full max-w-[520px] flex-col overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-sm">
                <span className="self-start rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] font-medium leading-[18px] text-[var(--text-muted)]">
                  {item.tag}
                </span>

                <p className="mt-5 text-[32px] font-bold tabular-nums leading-none tracking-[-0.04em] text-[var(--text-primary)]">
                  {item.statValue}
                </p>
                <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                  {item.statLabel}
                </p>

                <blockquote className="mt-5 line-clamp-6 flex-1 text-[15px] leading-[1.6] text-[var(--text-body)]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className="mt-5 flex items-center gap-3 border-t border-[var(--border-default)] pt-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-semibold text-[var(--color-primary-700)]">
                    {item.authorName.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {item.authorName}
                    </p>
                    <p className="truncate text-xs text-[var(--text-muted)]">
                      {item.authorRole}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation — prev / dots / next */}
      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous case study"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="flex size-9 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to case study ${i + 1}`}
              aria-current={active === i}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                active === i
                  ? "w-5 bg-[var(--color-primary-600)]"
                  : "w-1.5 bg-[var(--border-strong)]",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next case study"
          onClick={() => goTo(active + 1)}
          disabled={active === items.length - 1}
          className="flex size-9 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
