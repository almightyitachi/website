"use client"

import { useRef, type CSSProperties } from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from "framer-motion"

// Shared dot geometry — every overlay's mask uses the exact same radius/
// spacing as the base layer's dot pattern so its dots land on the same grid.
const DOT_RADIUS = "1.3px"
const DOT_EDGE = "1.9px"
const DOT_GRID = "7px 7px"

const BASE_DOTS: CSSProperties = {
  backgroundImage: `radial-gradient(rgba(255,255,255,0.32) ${DOT_RADIUS}, transparent ${DOT_EDGE})`,
  backgroundSize: DOT_GRID,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
}

// Dot mask shared by every animated fill overlay — punches the dot grid out
// of whatever fill the overlay paints (logo colours for the P, white for the
// rest), so the reveal lands on the same dots as the dim base.
const DOT_MASK: CSSProperties = {
  WebkitMaskImage: `radial-gradient(black ${DOT_RADIUS}, transparent ${DOT_EDGE})`,
  maskImage: `radial-gradient(black ${DOT_RADIUS}, transparent ${DOT_EDGE})`,
  WebkitMaskSize: DOT_GRID,
  maskSize: DOT_GRID,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
}

// Brand-logo colour field, laid out to approximate the P mark's geometry
// (see resources/letter-logo.png): navy → magenta → crimson across the top,
// royal blue stem with the amber bar and orange bowl through the middle,
// lighter blue down the base of the stem. These hex values are sampled from
// the logo asset itself — a decorative brand-mark exception to the no-raw-hex
// rule (they are the logo's colours, not UI tokens).
const LOGO_FIELD: CSSProperties = {
  ...DOT_MASK,
  backgroundImage: [
    "linear-gradient(to right, #2A2380 0%, #2A2380 34%, #8E2566 34%, #8E2566 64%, #CE0F3F 64%, #CE0F3F 100%)",
    "linear-gradient(to right, #1D55DB 0%, #1D55DB 34%, #FDB813 34%, #FDB813 66%, #F4651C 66%, #F4651C 100%)",
    "linear-gradient(to right, #2169DD 0%, #2169DD 100%)",
  ].join(", "),
  backgroundSize: "100% 34%, 100% 33%, 100% 33%",
  backgroundPosition: "0 0, 0 50.5%, 0 100%",
  backgroundRepeat: "no-repeat",
}

// Bright-white fill for the rest of the wordmark — same dot mask, solid white.
const WHITE_FIELD: CSSProperties = {
  ...DOT_MASK,
  backgroundImage: "linear-gradient(#fff, #fff)",
}

// fill up → hold → drain → rest, on a loop. Shared so the P (colour) and the
// rest (white) reveal in lockstep.
const FILL_KEYFRAMES = {
  clipPath: [
    "inset(100% 0 0 0)",
    "inset(0% 0 0 0)",
    "inset(0% 0 0 0)",
    "inset(100% 0 0 0)",
  ],
}
const FILL_TRANSITION: Transition = {
  duration: 3.2,
  times: [0, 0.3, 0.72, 1],
  ease: [0.16, 1, 0.3, 1],
  repeat: Infinity,
  repeatDelay: 0.3,
}

// One letter group: a dim white-dot base with an animated fill overlay that
// reveals bottom-to-top on the shared loop. `field` decides the fill colour.
function FilledChars({
  children,
  field,
  reduce,
  inView,
}: {
  children: string
  field: CSSProperties
  reduce: boolean
  inView: boolean
}) {
  return (
    <span className="relative inline-block">
      {/* pb extends the background-clip:text paint area below the baseline so
          descenders (the "g" in luginLive) aren't cut. The overlay is
          absolute inset-0, so it grows to match and the dot grids stay
          aligned (no top padding → same tiling origin). */}
      <span className="inline-block pb-[0.26em] text-transparent" style={BASE_DOTS}>
        {children}
      </span>
      <motion.span
        className="absolute inset-0 inline-block text-transparent"
        style={field}
        initial={
          reduce
            ? { clipPath: "inset(0% 0 0 0)" }
            : { clipPath: "inset(100% 0 0 0)" }
        }
        animate={reduce || !inView ? undefined : FILL_KEYFRAMES}
        transition={FILL_TRANSITION}
      >
        {children}
      </motion.span>
    </span>
  )
}

// Oversized dotted-stipple brand wordmark at the top of the footer. Every
// letter carries an animated dot layer that loops while the footer is in
// view: the dots fill in (bottom → top), hold, drain, and fill again — the P
// in the logo's colour placement, the rest in bright white, all in lockstep.
// Decorative only: aria-hidden, pointer-events-none; reduced motion shows the
// filled state statically.
export function DottedWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  // Only fill once the wordmark is actually reached: the negative bottom
  // margin holds the trigger until it sits ~22% up from the viewport bottom,
  // not the instant its first dots peek in.
  const inView = useInView(ref, { margin: "0px 0px -22% 0px" })
  const reduce = !!useReducedMotion()

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none relative z-10 mt-12 select-none px-6 pb-0 pt-0 text-center lg:-mt-6 lg:px-12"
      style={{ fontSize: "clamp(64px, 16vw, 232px)" }}
    >
      <span className="relative inline-block whitespace-nowrap pb-[0.2em] font-sans font-bold leading-[1.05] tracking-[-0.045em]">
        <FilledChars field={LOGO_FIELD} reduce={reduce} inView={inView}>
          P
        </FilledChars>
        <FilledChars field={WHITE_FIELD} reduce={reduce} inView={inView}>
          luginLive
        </FilledChars>
      </span>
    </div>
  )
}
