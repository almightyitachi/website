"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"

import { MARK_PATH } from "./PluginLiveMark"
import { SectionHeading } from "./SectionHeading"

// Data security & privacy — the trust beat before the closing CTA. The platform
// runs on candidate and recruiter data, so this section answers the buyer's
// legal/compliance question in our own voice, in plain language any reader can
// parse. Centered stack: a front-view 3D shield standing on a glowing pedestal
// (cobalt theme — the design language of a rendered 3D icon kept flat-on, not
// isometric; the shield reads safe, secure, trusted), the promise as heading,
// one supporting line, then four guarantees as check pointers. Every claim is
// one we stand behind (see PRODUCT.md); no certification logos are asserted.

const EASE = [0.16, 1, 0.3, 1] as const

const GUARANTEES: { title: string; gloss: string }[] = [
  {
    title: "Private by default",
    gloss: "Your data is never sold, shared, or used to train public models.",
  },
  {
    title: "Auditable end to end",
    gloss: "Every decision carries a trail: who saw what, and when.",
  },
  {
    title: "Fair by design",
    gloss: "Equal-opportunity screening, with a rationale your team can defend.",
  },
  {
    title: "Secure at scale",
    gloss: "AI-proctored assessments run supervised, 10,000+ candidates at a time.",
  },
]

// Curved-crest shield silhouette, centred on x=70 in the 140×150 viewBox.
const SHIELD_PATH =
  "M70 30 C70 30 50 38 33 40 C33 40 30 92 70 116 C110 92 107 40 107 40 C90 38 70 30 70 30 Z"

// Front-view 3D shield on a glowing pedestal. The "3D" read comes entirely from
// layered gradients and stacked silhouettes (a depth lip under the face, a
// luminous ring under the base, a top gloss) — the view stays flat-on, never
// isometric. Cobalt throughout; the PluginLive mark is embossed on the face.
function SecurityShield({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className={className}
      // Slow idle float — calm conceptual loop, never bouncy.
      animate={reduce ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{
        filter:
          "drop-shadow(0 22px 30px color-mix(in srgb, var(--color-primary-600) 24%, transparent))",
      }}
    >
      <svg
        viewBox="0 0 140 150"
        className="h-full w-full overflow-visible"
        role="presentation"
      >
        <defs>
          {/* Shield face — deep cobalt-to-near-black, so the centre shine
              reads as the light source */}
          <linearGradient id="ds-shield-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-700)" />
            <stop offset="52%" stopColor="var(--color-primary-800)" />
            <stop offset="100%" stopColor="var(--color-primary-900)" />
          </linearGradient>
          {/* Centre shine — a soft luminous core behind the embossed mark */}
          <radialGradient id="ds-shield-shine" cx="50%" cy="48%" r="42%">
            <stop offset="0%" stopColor="white" stopOpacity="0.34" />
            <stop offset="45%" stopColor="var(--color-primary-400)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
          </radialGradient>
          {/* Top gloss so the face reads as a rounded solid */}
          <linearGradient id="ds-shield-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="42%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Glow blur for the rings */}
          <filter id="ds-glow" x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          {/* Radial glow the rings emit — brightest at the ring band, fading
              out, so the pedestal reads as the light source. */}
          <radialGradient id="ds-ring-emit" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary-400)" stopOpacity="0.24" />
            <stop offset="62%" stopColor="var(--color-primary-500)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow emitted by the rings — sits behind them so they read as luminous */}
        <ellipse cx="70" cy="131" rx="60" ry="21" fill="url(#ds-ring-emit)" />

        {/* ── Stand (concentric stroke-only rings; the shield floats above) ── */}
        {/* Outer ring */}
        <ellipse
          cx="70"
          cy="131"
          rx="46"
          ry="10"
          fill="none"
          stroke="var(--color-primary-300)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        {/* Glowing mid ring — blurred halo then crisp stroke */}
        <ellipse
          cx="70"
          cy="131"
          rx="34"
          ry="7.4"
          fill="none"
          stroke="var(--color-primary-400)"
          strokeWidth="3"
          filter="url(#ds-glow)"
        />
        <ellipse
          cx="70"
          cy="131"
          rx="34"
          ry="7.4"
          fill="none"
          stroke="var(--color-primary-300)"
          strokeWidth="1.75"
        />
        {/* Inner ring */}
        <ellipse
          cx="70"
          cy="131"
          rx="22"
          ry="4.8"
          fill="none"
          stroke="var(--color-primary-400)"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />

        {/* ── Shield ── */}
        {/* Depth lip — darker silhouette below the face = extrusion */}
        <path
          d={SHIELD_PATH}
          transform="translate(0 4)"
          fill="var(--color-primary-900)"
        />
        {/* Front face + centre shine + gloss */}
        <path d={SHIELD_PATH} fill="url(#ds-shield-face)" />
        <path d={SHIELD_PATH} fill="url(#ds-shield-shine)" />
        <path d={SHIELD_PATH} fill="url(#ds-shield-gloss)" />
        {/* Inset edge outline */}
        <g style={{ transformOrigin: "70px 73px" }} transform="scale(0.87)">
          <path
            d={SHIELD_PATH}
            fill="none"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="1.75"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Embossed PluginLive mark — cast shadow then white face */}
        <path
          fillRule="evenodd"
          d={MARK_PATH}
          transform="translate(56.5 58.5) scale(0.29)"
          fill="var(--color-primary-900)"
          opacity="0.3"
        />
        <path
          fillRule="evenodd"
          d={MARK_PATH}
          transform="translate(56.5 57) scale(0.29)"
          fill="white"
        />
      </svg>
    </motion.div>
  )
}

export function DataSecuritySection({ id = "security" }: { id?: string } = {}) {
  const reduce = useReducedMotion()

  return (
    <section
      id={id}
      data-section-bg="light"
      className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-8 lg:px-12">

        <div className="py-20 lg:py-24">
          {/* Icon + heading + description — centered stack */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto flex max-w-2xl flex-col items-center text-center"
          >
            <SecurityShield className="mb-10 aspect-[140/150] w-28 opacity-90 lg:w-36" />
            <SectionHeading
              pre="Your data stays"
              hook="yours"
              className="mx-auto text-center"
            />
            <p className="mt-5 max-w-xl text-[15px] leading-[1.6] text-[var(--text-muted)] lg:text-[16px]">
              PluginLive runs on candidate and recruiter data, so we treat it as
              infrastructure: enterprise-grade, auditable, and private by
              default.
            </p>
          </motion.div>

          {/* Pointers — four guarantees, check + claim + plain-language gloss */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-x-12 gap-y-8 text-left sm:grid-cols-2 lg:mt-16">
            {GUARANTEES.map((g, i) => (
              <motion.div
                key={g.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.07 * i, ease: EASE }}
                className="flex min-w-0 items-start gap-3.5"
              >
                <Check
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden
                  className="mt-1 shrink-0 text-[var(--color-primary-600)]"
                />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug text-[var(--text-primary)] lg:text-base">
                    {g.title}
                  </p>
                  <p className="mt-1 text-sm leading-[1.55] text-[var(--text-muted)]">
                    {g.gloss}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
