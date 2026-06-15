import { cn } from "@/lib/utils"

// Corner "+" markers for framed sections. Each cross is a small, uniform glyph
// that sits in a surface-coloured square which BREAKS the rail behind it — so
// the border is
// detached from the cross (a clear gap around it), and every cross reads at one
// weight no matter how many cell corners meet at that point (the masking square
// + single centred glyph mean overlaps never double up).
//
// `tone` picks the surface: light sections mask with the page bg and draw the
// cross in --border-strong; dark sections mask with --bg-brand and draw white.
// `masked` (default true) draws the rail-breaking square; turn it off for a
// purely decorative cross with no rail to break.

type Tone = "light" | "dark"

const MASK: Record<Tone, string> = {
  light: "bg-[var(--bg-page)]",
  dark: "bg-[var(--bg-brand)]",
}

const LINE: Record<Tone, string> = {
  light: "bg-[var(--border-strong)]",
  dark: "bg-white/25",
}

export function Cross({
  className,
  tone = "light",
  masked = true,
}: {
  className?: string
  tone?: Tone
  masked?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-20 flex h-4 w-4 items-center justify-center",
        masked && MASK[tone],
        className,
      )}
    >
      {/* 8px "+" floating in the centre of the 16px square — the ~4px clear ring
          around it is the gap that detaches the cross from the rails. */}
      <span className="relative h-2 w-2">
        <span
          className={cn(
            "absolute left-1/2 top-0 h-full w-px -translate-x-1/2",
            LINE[tone],
          )}
        />
        <span
          className={cn(
            "absolute left-0 top-1/2 h-px w-full -translate-y-1/2",
            LINE[tone],
          )}
        />
      </span>
    </span>
  )
}

const CORNERS = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
]

export function CornerPlus({
  tone = "light",
  masked = true,
}: {
  tone?: Tone
  masked?: boolean
} = {}) {
  return (
    <>
      {CORNERS.map((pos) => (
        <Cross key={pos} tone={tone} masked={masked} className={pos} />
      ))}
    </>
  )
}
