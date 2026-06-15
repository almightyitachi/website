"use client"

import { useEffect, useRef } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"

const EASE = [0.16, 1, 0.3, 1] as const

// Splits a display value like "2.4M+", "1,200+", "62%" into the numeric
// target, the trailing non-numeric suffix ("M+", "+", "%"), and how many
// decimal places to preserve while counting (so "2.4M+" tweens 0.0 → 2.4).
function parseStat(value: string): {
  target: number
  suffix: string
  decimals: number
} {
  const match = value.match(/^([\d,.]+)(.*)$/)
  if (!match) return { target: 0, suffix: value, decimals: 0 }
  const numStr = match[1].replace(/,/g, "")
  const target = Number.parseFloat(numStr)
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0
  return { target: Number.isFinite(target) ? target : 0, suffix: match[2], decimals }
}

function formatNumber(n: number, decimals: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

interface CountUpStatProps {
  /** Display value, e.g. "2.4M+", "1,200+", "62%". */
  value: string
  className?: string
  /** Tween duration in seconds. */
  duration?: number
  /** Stagger delay in seconds before the count begins. */
  delay?: number
}

// Counts the numeric portion of a stat up from zero the first time it
// scrolls into view (and on load/refresh once the row is visible). Honours
// prefers-reduced-motion by snapping straight to the final value.
export function CountUpStat({
  value,
  className,
  duration = 1.6,
  delay = 0,
}: CountUpStatProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const { target, suffix, decimals } = parseStat(value)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reduce) {
      node.textContent = formatNumber(target, decimals) + suffix
      return
    }
    if (!inView) {
      node.textContent = formatNumber(0, decimals) + suffix
      return
    }

    const controls = animate(0, target, {
      duration,
      delay,
      ease: EASE,
      onUpdate(latest) {
        node.textContent = formatNumber(latest, decimals) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduce, target, decimals, suffix, duration, delay])

  // SSR / pre-animation frame renders the zero state so there is no
  // hydration mismatch; the effect takes over on the client.
  return (
    <span ref={ref} className={className}>
      {formatNumber(0, decimals)}
      {suffix}
    </span>
  )
}
