"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type Version = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7"

const VERSIONS: { id: Version; label: string; sub: string }[] = [
  { id: "v1", label: "V1", sub: "Warm sand · Plus Jakarta Sans" },
  { id: "v2", label: "V2", sub: "Ink monochrome · Satoshi" },
  { id: "v3", label: "V3", sub: "Saturated blue + editorial dark · Inter" },
  { id: "v4", label: "V4", sub: "Near-black CTA + display sans · Inter" },
  { id: "v5", label: "V5", sub: "Monochrome · Single indigo-violet · Satoshi" },
  { id: "v6", label: "V6", sub: "Purple + navy + charcoal · Inter" },
  { id: "v7", label: "V7", sub: "PluginLive · Cobalt-violet · Satoshi" },
]

export function ThemeToggle() {
  const [version, setVersion] = useState<Version>("v1")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Version) || "v1"
    setVersion(current)
    setMounted(true)
  }, [])

  function change(v: Version) {
    setVersion(v)
    document.documentElement.setAttribute("data-theme", v)
    try {
      localStorage.setItem("theme-version", v)
    } catch {
      // localStorage may be blocked; theme still applies for this session
    }
  }

  if (!mounted) return null

  const active = VERSIONS.find((v) => v.id === version) ?? VERSIONS[0]

  return (
    <div className="fixed top-3 left-1/2 z-[100] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] p-1 shadow-md">
        <span className="px-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Theme
        </span>
        {VERSIONS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => change(v.id)}
            title={v.sub}
            aria-pressed={version === v.id}
            className={cn(
              "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
              version === v.id
                ? "bg-[var(--interactive-primary)] text-[var(--text-inverse)]"
                : "text-[var(--text-body)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-[var(--text-muted)]">
        {active.sub}
      </p>
    </div>
  )
}
