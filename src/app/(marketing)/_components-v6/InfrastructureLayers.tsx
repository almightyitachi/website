"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

import { SectionHeading } from "./SectionHeading"

const EASE = [0.16, 1, 0.3, 1] as const

// ─── Data ─────────────────────────────────────────────────────────────

export type LayerId = "intelligence" | "data" | "network"

interface InfraLayer {
  id: LayerId
  title: string
  description: string
  tags: string[]
}

// Tag chip on the dark band — a hairline gradient border (cobalt → white →
// cobalt) drawn via the dual-background border-box trick lifts the chips off
// the near-black surface without turning them loud. The padding-box layer is
// an OPAQUE dark fill (white 6% mixed into the band colour), so the gradient
// shows only on the 1px stroke, never as a tinted fill.
function LayerTag({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-sm border border-transparent px-2.5 py-1 text-[11px] text-white/75"
      style={{
        background:
          "linear-gradient(color-mix(in srgb, white 6%, var(--bg-brand)), color-mix(in srgb, white 6%, var(--bg-brand))) padding-box, " +
          "linear-gradient(120deg, color-mix(in srgb, var(--color-primary-300) 55%, transparent), rgba(255,255,255,0.16) 50%, color-mix(in srgb, var(--color-primary-500) 60%, transparent)) border-box",
      }}
    >
      {children}
    </span>
  )
}

const INFRA_LAYERS: InfraLayer[] = [
  {
    id: "intelligence",
    title: "Intelligence",
    description:
      "Every candidate scored before you see them. Our AI separates signal from noise, so your team evaluates instead of filtering.",
    tags: ["AI-Scoring", "Unified Framework", "48hr Shortlist"],
  },
  {
    id: "data",
    title: "Data",
    description:
      "2.4M+ candidates assessed. 540+ colleges. 28 states. Scored on one AI-calibrated scale because capability doesn't care about postal code.",
    tags: ["2.4M+ candidates", "540+ colleges", "28 states"],
  },
  {
    id: "network",
    title: "Network",
    description:
      "Corporate demand. Institutional supply. One coordinated layer: drives confirmed, candidates upskilled, placements closed, outcomes tracked in real time.",
    tags: ["Corporate pipelines", "Real-time outcomes", "540+ institutes"],
  },
]

// ─── Isometric layer cube ─────────────────────────────────────────────
// Default: a striped, open-top isometric box (venetian-blind side faces,
// hollow top rim). The active layer's face lifts away from the body, fills
// with cobalt, and rounds its corners — sharp + striped at rest, lifted +
// rounded + filled when highlighted.

const BODY_STROKE = "rgba(255,255,255,0.16)"

// Sharp body faces.
const TOP_SHARP = "M 280,116 L 420,194 L 280,272 L 140,194 Z"
const TOP_INNER = "M 280,146 L 367,194 L 280,242 L 193,194 Z"
const LEFT_SHARP = "M 140,194 L 280,272 L 280,422 L 140,344 Z"
const RIGHT_SHARP = "M 420,194 L 280,272 L 280,422 L 420,344 Z"

// Rounded versions used only for the lifted highlight.
const TOP_ROUND =
  "M 299.2,126.7 L 400.8,183.3 Q 420,194 400.8,204.7 L 299.2,261.3 " +
  "Q 280,272 260.8,261.3 L 159.2,204.7 Q 140,194 159.2,183.3 " +
  "L 260.8,126.7 Q 280,116 299.2,126.7 Z"
const LEFT_ROUND =
  "M 153.97,201.78 L 266.03,264.22 Q 280,272 280,288 L 280,406 " +
  "Q 280,422 266.03,414.22 L 153.97,351.78 Q 140,344 140,328 " +
  "L 140,210 Q 140,194 153.97,201.78 Z"
const RIGHT_ROUND =
  "M 406.03,201.78 L 293.97,264.22 Q 280,272 280,288 L 280,406 " +
  "Q 280,422 293.97,414.22 L 406.03,351.78 Q 420,344 420,328 " +
  "L 420,210 Q 420,194 406.03,201.78 Z"

const FACES: Record<LayerId, { round: string; offset: [number, number] }> = {
  intelligence: { round: TOP_ROUND, offset: [0, -36] },
  data: { round: RIGHT_ROUND, offset: [38, 18] },
  network: { round: LEFT_ROUND, offset: [-38, 18] },
}

const N_STRIPES = 13
const BODY_H = 150
// Vertical blind-lines across each side face.
const LEFT_STRIPES = Array.from({ length: N_STRIPES }, (_, i) => {
  const t = (i + 0.5) / N_STRIPES
  const x = 140 + 140 * t
  const y0 = 194 + 78 * t
  return { x, y0, y1: y0 + BODY_H }
})
const RIGHT_STRIPES = Array.from({ length: N_STRIPES }, (_, i) => {
  const t = (i + 0.5) / N_STRIPES
  const x = 420 - 140 * t
  const y0 = 194 + 78 * t
  return { x, y0, y1: y0 + BODY_H }
})

export function IsometricLayerCube({ activeId }: { activeId: LayerId }) {
  const reduce = useReducedMotion()
  const face = FACES[activeId]
  const dim = (active: boolean) => ({
    transition: "opacity 0.4s ease",
    opacity: active ? 0.12 : 1,
  })

  return (
    <svg viewBox="0 0 560 480" className="h-full w-full" aria-hidden="true" role="presentation">
      <defs>
        <radialGradient id="infra-aura" cx="50%" cy="42%" r="50%">
          <stop offset="0%" style={{ stopColor: "var(--color-primary-500)", stopOpacity: 0.18 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-primary-500)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="infra-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-primary-400)", stopOpacity: 0.92 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-primary-600)", stopOpacity: 0.85 }} />
        </linearGradient>
      </defs>

      <rect x="50" y="30" width="460" height="420" fill="url(#infra-aura)" />

      {/* Left face — outline + vertical blinds */}
      <g style={dim(activeId === "network")}>
        <path d={LEFT_SHARP} fill="rgba(255,255,255,0.015)" stroke={BODY_STROKE} strokeWidth={1.5} />
        {LEFT_STRIPES.map((s, i) => (
          <line key={`l${i}`} x1={s.x} y1={s.y0} x2={s.x} y2={s.y1} stroke="rgba(255,255,255,0.22)" strokeWidth={1.25} />
        ))}
      </g>

      {/* Right face — outline + vertical blinds */}
      <g style={dim(activeId === "data")}>
        <path d={RIGHT_SHARP} fill="rgba(255,255,255,0.015)" stroke={BODY_STROKE} strokeWidth={1.5} />
        {RIGHT_STRIPES.map((s, i) => (
          <line key={`r${i}`} x1={s.x} y1={s.y0} x2={s.x} y2={s.y1} stroke="rgba(255,255,255,0.13)" strokeWidth={1.25} />
        ))}
      </g>

      {/* Open top — hollow rim (outer + inner rhombus) */}
      <g style={dim(activeId === "intelligence")}>
        <path d={TOP_SHARP} style={{ fill: "var(--bg-brand)", fillOpacity: 0.6 }} stroke="rgba(255,255,255,0.32)" strokeWidth={1.5} />
        <path d={TOP_INNER} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.25} />
      </g>

      {/* Lifted highlight — rounded, filled, separated from the body */}
      <motion.path
        key={activeId}
        d={face.round}
        fill="url(#infra-face)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={reduce ? false : { x: 0, y: 0, opacity: 0 }}
        animate={{ x: face.offset[0], y: face.offset[1], opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{
          stroke: "var(--color-primary-500)",
          filter:
            "drop-shadow(0 6px 16px color-mix(in srgb, var(--color-primary-600) 50%, transparent))",
        }}
      />
    </svg>
  )
}

// ─── Public export ─────────────────────────────────────────────────────

export function InfrastructureLayers({
  id = "v6-ecosystem-layers",
  renderGraphic,
}: {
  id?: string
  // When provided, replaces the isometric cube in the right panel with a
  // per-layer graphic (crossfaded on layer change). Lets landing Section 4
  // swap the ecosystem visuals into the infrastructure layout.
  renderGraphic?: (activeId: LayerId) => ReactNode
} = {}) {
  const reduce = useReducedMotion()
  // The tall outer container is the scroll track; the inner content pins
  // to the viewport while the active layer advances with scroll progress.
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // Scroll-driven state: no timer. Progress through the pinned track maps
  // to the active layer — scrolling down advances, scrolling up reverses.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      if (total <= 0) {
        setActiveIdx(0)
        return
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      const p = scrolled / total
      const idx = Math.min(
        INFRA_LAYERS.length - 1,
        Math.floor(p * INFRA_LAYERS.length + 0.0001),
      )
      setActiveIdx(idx)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Click-to-unfold: scroll the track to a layer's segment so the pinned
  // state lands on it (and the scroll handler keeps it in sync).
  const goToLayer = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) {
      setActiveIdx(i)
      return
    }
    const target = top + total * ((i + 0.5) / INFRA_LAYERS.length)
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" })
  }

  const activeId = INFRA_LAYERS[activeIdx].id

  return (
    <section
      id={id}
      data-section-bg="dark"
      className="relative border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      {/* ── Mobile (<lg): normal-flow stack. Heading, description, then each
          layer reads top to bottom as pointer, its graphic, its description.
          No pin and no scroll-hijack, so short phones never clip a pinned
          viewport. ── */}
      <div className="px-8 py-20 lg:hidden">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            pre="The"
            hook="infrastructure"
            post="behind every outcome"
            tone="dark"
            className="max-w-[20ch]"
          />
          <p className="mt-5 max-w-sm text-[15px] leading-[1.55] text-white/50">
            Built in layers, so every assessment makes the next outcome faster.
          </p>

          <div className="mt-14 flex flex-col gap-14">
            {INFRA_LAYERS.map((layer) => (
              <div key={layer.id}>
                {/* Pointer */}
                <h3 className="text-[clamp(24px,7vw,30px)] font-semibold leading-tight tracking-[-0.02em] text-white">
                  {layer.title}
                </h3>
                {/* Graphic related to the pointer */}
                <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="aspect-[587/477] w-full">
                    <div className="flex h-full w-full items-center justify-center p-4">
                      {renderGraphic ? (
                        renderGraphic(layer.id)
                      ) : (
                        <IsometricLayerCube activeId={layer.id} />
                      )}
                    </div>
                  </div>
                </div>
                {/* Pointer description */}
                <p className="mt-5 text-[15px] leading-[1.6] text-white/55">
                  {layer.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {layer.tags.map((tag) => (
                    <LayerTag key={tag}>{tag}</LayerTag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop (lg+): pinned scroll-driven layer cube ── */}
      <div ref={trackRef} className="relative hidden h-[300vh] lg:block">
        {/* Pinned viewport */}
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-8 lg:px-12">
          {/* Title row — heading left (hook highlighted), supporting line right */}
          <div className="mb-16 flex flex-col gap-5 lg:mb-20 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <SectionHeading
              pre="The"
              hook="infrastructure"
              post="behind every outcome"
              tone="dark"
              className="max-w-[20ch]"
            />
            <p className="max-w-sm text-[15px] leading-[1.55] text-white/50 lg:pt-3 lg:text-right lg:text-[17px]">
              Built in layers, so every assessment makes the next outcome faster.
            </p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left — scroll- and click-driven accordion */}
            <div className="flex flex-col">
              {INFRA_LAYERS.map((layer, i) => {
                const isActive = activeIdx === i
                return (
                  <div key={layer.id} className="py-3">
                    <button
                      type="button"
                      onClick={() => goToLayer(i)}
                      aria-expanded={isActive}
                      className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)]/60"
                    >
                      <span
                        className={cn(
                          "block text-[clamp(22px,2.4vw,28px)] leading-tight tracking-[-0.02em] transition-colors duration-300",
                          isActive
                            ? "font-semibold text-white"
                            : "font-normal text-white/30 hover:text-white/55",
                        )}
                      >
                        {layer.title}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="mt-3 max-w-md text-[15px] leading-[1.6] text-white/55">
                            {layer.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {layer.tags.map((tag) => (
                              <LayerTag key={tag}>{tag}</LayerTag>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Right — isometric layer cube. Desktop showcase; hidden on
                mobile so the pinned accordion fits one viewport cleanly. */}
            <div className="relative hidden overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] lg:block">
              <div className="aspect-[587/477] w-full">
                {renderGraphic ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeId}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="flex h-full w-full items-center justify-center p-8"
                    >
                      {renderGraphic(activeId)}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <IsometricLayerCube activeId={activeId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
