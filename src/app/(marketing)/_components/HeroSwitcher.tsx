"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { AnimatedHero } from "./AnimatedHero"
import { AnimatedHeroV2 } from "./AnimatedHeroV2"
import { AnimatedHeroV3 } from "./AnimatedHeroV3"

type Version = "v1" | "v2" | "v3"

const STORAGE_KEY = "pluginlive-hero-version"

const OPTIONS: { v: Version; label: string; hint: string }[] = [
  { v: "v1", label: "Editorial", hint: "Rotating word" },
  { v: "v2", label: "Spark",     hint: "Cover hover" },
  { v: "v3", label: "Faces",     hint: "Floating-avatar network" },
]

export function HeroSwitcher() {
  const [version, setVersion] = useState<Version>("v1")
  const [mounted, setMounted] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "v1" || saved === "v2" || saved === "v3") setVersion(saved)
    setMounted(true)
  }, [])

  // Fade the toggle out once the user scrolls past the hero — it's a
  // hero-specific preview control, no need to float over the rest of the page.
  useEffect(() => {
    const update = () => setHidden(window.scrollY > 600)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  function pick(v: Version) {
    setVersion(v)
    window.localStorage.setItem(STORAGE_KEY, v)
  }

  return (
    <>
      <div
        className={cn(
          "fixed left-1/2 top-[84px] z-40 -translate-x-1/2 transition-all duration-300",
          hidden
            ? "pointer-events-none translate-y-[-12px] opacity-0"
            : "opacity-100"
        )}
      >
        <div
          role="tablist"
          aria-label="Hero version"
          className="flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)]/90 p-1 shadow-sm backdrop-blur-md"
        >
          {OPTIONS.map((opt) => {
            const active = version === opt.v
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
                    ? "bg-[var(--bg-brand)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Render V1 by default until hydration completes — keeps SSR markup
          stable. After mount, the saved selection takes over. */}
      {!mounted || version === "v1" ? (
        <AnimatedHero />
      ) : version === "v2" ? (
        <AnimatedHeroV2 />
      ) : (
        <AnimatedHeroV3 />
      )}
    </>
  )
}
