"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

import {
  useNarrativeVariant,
  type NarrativeVariant,
} from "./NarrativeContext"

// 2-segment toggle pill that lives in the marketing nav. Lets the user
// flip between the AI-narrated variant and the V3 alternate landing
// page. Reads dark/light from the parent nav via the `isDark` prop so
// the toggle blends with whichever band the user is currently scrolled
// to.

interface NarrativeToggleProps {
  isDark?: boolean
  className?: string
}

const OPTIONS: { value: NarrativeVariant; label: string; short: string }[] = [
  { value: "ai-light", label: "V1", short: "V1" },
  { value: "ai-dark",  label: "V2", short: "V2" },
  { value: "v3-light", label: "V3", short: "V3" },
  { value: "v3-dark",  label: "V4", short: "V4" },
  { value: "v3-image", label: "V5", short: "V5" },
  { value: "v3-gradient",    label: "V6", short: "V6" },
]

export function NarrativeToggle({ isDark = false, className }: NarrativeToggleProps) {
  const { variant, setVariant } = useNarrativeVariant()
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])

  const handleKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const direction = event.key === "ArrowRight" ? 1 : -1
    const next = (index + direction + OPTIONS.length) % OPTIONS.length
    const target = buttonsRef.current[next]
    target?.focus()
    setVariant(OPTIONS[next].value)
  }

  return (
    <div
      role="tablist"
      aria-label="Marketing narrative variant"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border p-0.5 transition-colors duration-300",
        isDark
          ? "border-white/[0.10] bg-white/[0.04]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)]",
        className,
      )}
    >
      {OPTIONS.map((o, i) => {
        const active = variant === o.value
        return (
          <button
            key={o.value}
            ref={(el) => {
              buttonsRef.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setVariant(o.value)}
            onKeyDown={(e) => handleKey(e, i)}
            className={cn(
              "whitespace-nowrap rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200",
              active
                ? isDark
                  ? "bg-white/[0.12] text-white"
                  : "bg-[var(--bg-brand-subtle)] text-[var(--text-brand)]"
                : isDark
                  ? "text-white/55 hover:text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            <span className="sm:hidden">{o.short}</span>
            <span className="hidden sm:inline">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
