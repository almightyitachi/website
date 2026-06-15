"use client"

// Animated SVG path background — used as a decorative layer behind the
// content of dark marketing surfaces (hero + dark CTA band). Stroke
// inherits via `currentColor`, so the parent controls visibility against
// its background. Drop the pre-composed `BackgroundPaths` wrapper into
// any dark section that should pick up the motion, or use `FloatingPaths`
// directly if you want a single sweep direction.

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface FloatingPathsProps {
  /** Direction of the path flow — 1 sweeps right, -1 sweeps left. */
  position: number
  className?: string
}

export function FloatingPaths({ position, className }: FloatingPathsProps) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * Pre-composed background — two FloatingPaths in opposite directions for
 * a crossing-sweep effect. Place inside a `relative` parent that has the
 * desired text colour (the paths render in `currentColor`).
 */
export function BackgroundPaths({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  )
}
