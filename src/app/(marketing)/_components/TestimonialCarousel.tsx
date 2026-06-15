"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import type { CorporateQuote } from "./QuoteCard"

interface TestimonialCarouselProps {
  quotes: CorporateQuote[]
}

// Horizontal scroll-snap carousel of corporate testimonials.
// CSS scroll-snap drives native momentum + snap; the prev/next buttons
// nudge the scroller by one card width. No JS animation library.
export function TestimonialCarousel({ quotes }: TestimonialCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>("[data-card]")
    const step = card ? card.offsetWidth + 16 : track.clientWidth
    track.scrollBy({ left: step * direction, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {quotes.map((q) => (
          <article
            key={q.name}
            data-card
            className="flex w-[88%] shrink-0 snap-start flex-col gap-5 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-7 shadow-sm md:w-[60%] lg:w-[40%]"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[var(--bg-brand-subtle)] text-base font-semibold text-[var(--color-primary-700)]">
                {q.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {q.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {q.title} · {q.company}
                </p>
              </div>
            </div>

            <blockquote className="flex-1 text-base font-medium leading-relaxed tracking-tight text-[var(--text-primary)]">
              &ldquo;{q.quote}&rdquo;
            </blockquote>

            <Link
              href={`/case-studies/${q.caseStudySlug}`}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-brand)] underline-offset-4 hover:underline"
            >
              Read case study
              <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--text-muted)]">
          Swipe or use arrows to read more
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous testimonial"
            className="flex size-10 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-body)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next testimonial"
            className="flex size-10 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-body)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
