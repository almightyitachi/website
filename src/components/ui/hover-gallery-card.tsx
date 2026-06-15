"use client"

import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Hover gallery card — ported from the upstream `gallery-hover-carousel`
// pattern, but with the carousel chrome removed. The image fills the card
// by default; on hover it collapses to the top half and a title/summary
// panel slides in from the bottom.
//
// Designed to tile in a CSS grid so three (or more) cards stand on their
// own without any carousel infrastructure.

export interface HoverGalleryCardProps {
  title: string
  summary: string
  image: string
  href?: string
  alt?: string
  className?: string
}

export function HoverGalleryCard({
  title,
  summary,
  image,
  href = "#",
  alt,
  className,
}: HoverGalleryCardProps) {
  // Render the card as a link only when an href is provided. Anchor with
  // no href interferes with keyboard semantics, so fall back to a div.
  const Wrapper: React.ElementType = href ? "a" : "div"
  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        "group relative block h-[320px] w-full md:h-[360px]",
        className,
      )}
    >
      <Card className="relative h-full w-full overflow-hidden rounded-md border-[var(--border-default)] bg-[var(--bg-elevated)] py-0 shadow-sm transition-shadow duration-500 group-hover:shadow-md">
        {/* Image — fills the card initially, collapses to the top half on hover */}
        <div className="relative h-full w-full transition-all duration-500 group-hover:h-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt ?? title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
          {/* Top-to-bottom darkening as the image shrinks, so the panel
              has a soft edge to land on. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Text panel — hidden initially, fills the bottom half on hover */}
        <div className="absolute inset-x-0 bottom-0 flex h-0 flex-col justify-center bg-[var(--bg-elevated)]/95 px-4 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:h-1/2 group-hover:opacity-100">
          <h3 className="text-base font-semibold leading-tight text-[var(--text-primary)] md:text-lg">
            {title}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)]">
            {summary}
          </p>
          <Button
            variant="outline"
            size="icon"
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute bottom-3 right-3 rounded-full transition-transform duration-500 group-hover:-rotate-45"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    </Wrapper>
  )
}
