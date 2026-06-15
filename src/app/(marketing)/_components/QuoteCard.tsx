"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useColorIteration } from "@/components/platform/ColorIterationSwitcher"

export interface CorporateQuote {
  initials: string
  quote: string
  name: string
  title: string
  company: string
  caseStudySlug: string
}

const MULTI_AVATAR_PALETTE = [
  { bg: "var(--bg-brand-subtle)",            fg: "var(--color-primary-700)" },
  { bg: "var(--color-brand-navy-subtle)",    fg: "var(--color-brand-navy)" },
  { bg: "var(--color-brand-amber-subtle)",   fg: "var(--color-brand-navy)" },
  { bg: "var(--color-brand-orange-subtle)",  fg: "var(--color-brand-navy)" },
] as const

function paletteSlot(initials: string) {
  let h = 0
  for (let i = 0; i < initials.length; i++) h = (h * 31 + initials.charCodeAt(i)) | 0
  return Math.abs(h) % MULTI_AVATAR_PALETTE.length
}

export function QuoteCard({ quote }: { quote: CorporateQuote }) {
  const colorIter = useColorIteration()
  const slot = MULTI_AVATAR_PALETTE[paletteSlot(quote.initials)]
  const avatarStyle =
    colorIter === "multi"
      ? slot
      : { bg: "var(--bg-brand-subtle)", fg: "var(--color-primary-700)" }
  return (
    <article className="flex flex-col gap-5 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-md text-base font-semibold"
          style={{ background: avatarStyle.bg, color: avatarStyle.fg }}
        >
          {quote.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {quote.name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {quote.title} · {quote.company}
          </p>
        </div>
      </div>

      <blockquote className="flex-1 text-base font-medium leading-relaxed tracking-tight text-[var(--text-primary)]">
        &ldquo;{quote.quote}&rdquo;
      </blockquote>

      <Link
        href={`/case-studies/${quote.caseStudySlug}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--text-brand)] underline-offset-4 hover:underline"
      >
        Read Case Study
        <ArrowRight size={14} />
      </Link>
    </article>
  )
}
