"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export type ColorIteration = "mono" | "multi"

const STORAGE_KEY = "pluginlive-color-iteration"
const ITERATION_CHANGE_EVENT = "pluginlive:color-iteration"

const OPTIONS: { v: ColorIteration; label: string; hint: string }[] = [
  { v: "mono",  label: "Existing color",     hint: "Cobalt-violet only" },
  { v: "multi", label: "Brand multi-color",  hint: "Adds navy / amber / orange accents" },
]

function readStoredIteration(): ColorIteration {
  if (typeof window === "undefined") return "mono"
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === "multi" ? "multi" : "mono"
  } catch {
    return "mono"
  }
}

export function useColorIteration(): ColorIteration {
  const [iteration, setIteration] = useState<ColorIteration>("mono")

  useEffect(() => {
    setIteration(readStoredIteration())
    const handle = (e: Event) => {
      const detail = (e as CustomEvent<ColorIteration>).detail
      if (detail === "mono" || detail === "multi") setIteration(detail)
    }
    window.addEventListener(ITERATION_CHANGE_EVENT, handle)
    return () => window.removeEventListener(ITERATION_CHANGE_EVENT, handle)
  }, [])

  return iteration
}

export function ColorIterationSwitcher({
  offset = "default",
}: {
  offset?: "default" | "below"
}) {
  const [iteration, setIteration] = useState<ColorIteration>("mono")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIteration(readStoredIteration())
    setMounted(true)
  }, [])

  if (!mounted) return null

  function pick(v: ColorIteration) {
    setIteration(v)
    try {
      window.localStorage.setItem(STORAGE_KEY, v)
    } catch {
      // localStorage may be blocked
    }
    window.dispatchEvent(new CustomEvent(ITERATION_CHANGE_EVENT, { detail: v }))
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[60] flex justify-center",
        offset === "below" ? "top-14 lg:top-16" : "top-[124px] lg:top-[124px]",
      )}
    >
      <div
        role="tablist"
        aria-label="Color iteration"
        className="pointer-events-auto flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)]/90 p-1 shadow-md backdrop-blur-md"
      >
        {OPTIONS.map((opt) => {
          const active = iteration === opt.v
          return (
            <button
              key={opt.v}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => pick(opt.v)}
              title={opt.hint}
              className={cn(
                "rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "bg-[var(--bg-brand)] text-[var(--text-inverse)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
