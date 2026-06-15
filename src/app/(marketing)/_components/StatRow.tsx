"use client"

import { useColorIteration } from "@/components/platform/ColorIterationSwitcher"
import { cn } from "@/lib/utils"

export interface Stat {
  value: string
  label: string
  hint?: string
}

interface StatRowProps {
  stats: Stat[]
  variant?: "inline" | "panel"
  theme?: "light" | "dark"
}

const MULTI_STAT_COLORS_LIGHT = [
  "var(--color-primary-600)",
  "var(--color-brand-navy)",
  "var(--color-brand-amber)",
  "var(--color-brand-orange)",
] as const

const MULTI_STAT_COLORS_DARK = [
  "var(--color-primary-300)",
  "var(--color-brand-amber)",
  "var(--color-brand-orange)",
  "var(--color-primary-300)",
] as const

// Two visual modes:
//   - "inline" — horizontal text strip for the hero hook line
//   - "panel"  — divided 4-column block for the proof section
// Theme controls colour treatment on dark vs light surfaces.
export function StatRow({
  stats,
  variant = "panel",
  theme = "light",
}: StatRowProps) {
  const colorIter = useColorIteration()

  if (variant === "inline") {
    return (
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex items-baseline gap-2 text-sm text-[var(--text-body)]"
          >
            <span className="text-base font-semibold tabular-nums text-[var(--text-primary)]">
              {s.value}
            </span>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    )
  }

  const isDark = theme === "dark"

  return (
    <div
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-md border lg:grid-cols-4",
        isDark
          ? "divide-x divide-y divide-white/[0.06] border-white/[0.08] lg:divide-y-0"
          : "divide-x divide-y divide-[var(--border-default)] border-[var(--border-default)] lg:divide-y-0"
      )}
    >
      {stats.map((s, i) => {
        const multiPalette = isDark ? MULTI_STAT_COLORS_DARK : MULTI_STAT_COLORS_LIGHT
        const valueColor =
          colorIter === "multi" ? multiPalette[i % multiPalette.length] : undefined
        return (
        <div key={s.label} className="flex flex-col gap-2 px-8 py-12">
          <p
            className={cn(
              "text-5xl font-bold leading-none tracking-tight tabular-nums lg:text-6xl",
              colorIter === "mono" &&
                (isDark ? "text-[var(--color-primary-300)]" : "text-[var(--text-brand)]")
            )}
            style={valueColor ? { color: valueColor } : undefined}
          >
            {s.value}
          </p>
          <p
            className={cn(
              "max-w-[160px] text-sm leading-snug",
              isDark ? "text-white/55" : "text-[var(--text-muted)]"
            )}
          >
            {s.label}
          </p>
          {s.hint && (
            <span
              className={cn(
                "w-fit rounded-sm px-2 py-0.5 text-[11px] font-medium",
                isDark
                  ? "bg-white/[0.06] text-white/40"
                  : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
              )}
            >
              {s.hint}
            </span>
          )}
        </div>
        )
      })}
    </div>
  )
}
