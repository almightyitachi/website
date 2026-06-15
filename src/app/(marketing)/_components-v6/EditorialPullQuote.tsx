"use client"

import { motion, useReducedMotion } from "framer-motion"

// Editorial pull-quote — a single strong customer line on the dark brand band,
// promoted from the case-studies set. It breaks the run of two card-grid
// testimonial sections with one quiet, confident beat. Per the design system,
// the serif italic is reserved for the emphasised value phrase only (the
// SectionHeading hook treatment); the rest of the quote stays Satoshi.

const EASE = [0.16, 1, 0.3, 1] as const

export function EditorialPullQuote() {
  const reduce = useReducedMotion()

  return (
    <section
      data-section-bg="dark"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(73,79,223,0.16) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-8 py-24 text-center lg:px-12 lg:py-32">
        <motion.blockquote
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[clamp(26px,4vw,46px)] font-semibold leading-[1.2] tracking-[-0.025em] text-white"
        >
          &ldquo;Three weeks of shortlisting became{" "}
          <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-300)]">
            two days
          </span>
          . The audit trail alone saved us from two escalations.&rdquo;
        </motion.blockquote>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-semibold text-white">
            R
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Rhea Kapoor</p>
            <p className="text-xs text-white/55">
              Head of Campus Hiring, Infosys
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
