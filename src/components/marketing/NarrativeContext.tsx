"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

// Marketing-site narrative variant — encodes both the page type (ai / v3)
// and the hero sub-variant in a single discriminated string so one context
// value drives both the page branch and the hero appearance.
//
// V1 = AI Narrative + Light hero
// V2 = AI Narrative + Dark hero
// V3 = V3 landing   + Light hero
// V4 = V3 landing   + Dark hero
// V5 = V3 landing   + Image hero
// V6 = V3 landing   + V4 hero

export type NarrativeVariant =
  | "ai-light"
  | "ai-dark"
  | "v3-light"
  | "v3-dark"
  | "v3-image"
  | "v3-gradient"

const STORAGE_KEY = "pluginlive.narrative"
// V6 (the V3 landing with the "gradient" hero) is the production default. The
// V1–V5 variations remain reachable only on /other-variations-landing-page.
const DEFAULT_VARIANT: NarrativeVariant = "v3-gradient"

interface NarrativeContextValue {
  variant: NarrativeVariant
  setVariant: (next: NarrativeVariant) => void
}

const NarrativeContext = React.createContext<NarrativeContextValue | undefined>(
  undefined,
)

function isVariant(value: string | null | undefined): value is NarrativeVariant {
  return (
    value === "ai-light" ||
    value === "ai-dark" ||
    value === "v3-light" ||
    value === "v3-dark" ||
    value === "v3-image" ||
    value === "v3-gradient"
  )
}

function readStoredVariant(): NarrativeVariant {
  if (typeof window === "undefined") return DEFAULT_VARIANT
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isVariant(stored) ? stored : DEFAULT_VARIANT
}

/** Returns which top-level page the variant belongs to. */
export function getNarrativePage(v: NarrativeVariant): "ai" | "v3" {
  return v.startsWith("ai") ? "ai" : "v3"
}

/** Returns the hero sub-variant suffix. */
export function getNarrativeHeroVariant(
  v: NarrativeVariant,
): "light" | "dark" | "image" | "gradient" {
  return v.slice(v.indexOf("-") + 1) as "light" | "dark" | "image" | "gradient"
}

export function NarrativeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const urlVariant = searchParams.get("narrative")

  const [storedVariant, setStoredVariant] = React.useState<NarrativeVariant>(
    DEFAULT_VARIANT,
  )

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredVariant(readStoredVariant())
  }, [])

  const variant: NarrativeVariant = isVariant(urlVariant)
    ? urlVariant
    : storedVariant

  const setVariant = (next: NarrativeVariant) => {
    setStoredVariant(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }

  const value = { variant, setVariant }

  return (
    <NarrativeContext.Provider value={value}>
      {children}
    </NarrativeContext.Provider>
  )
}

export function useNarrativeVariant() {
  const ctx = React.useContext(NarrativeContext)
  if (!ctx) {
    throw new Error(
      "useNarrativeVariant must be used inside <NarrativeProvider>",
    )
  }
  return ctx
}
