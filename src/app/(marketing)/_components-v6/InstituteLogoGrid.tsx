"use client"

import { motion } from "framer-motion"

import { CornerPlus } from "@/components/marketing/CornerPlus"

// Section 6B — Institutes. A static, aligned logo gallery on the white canvas,
// framed by the hairline rail + corner crosses. No cards, no tilt: logos sit
// directly on the surface in a responsive grid and reveal with a short
// staggered fade-up as the section enters view.

const EASE = [0.16, 1, 0.3, 1] as const

interface Logo {
  name: string
  src: string
}

const LOGOS: Logo[] = [
  { name: "Naralkar Institute", src: "/institute-marquee/institute-marquee-logos01.png" },
  { name: "Delhi Technological University", src: "/institute-marquee/institute-marquee-logos02.png" },
  { name: "Swadha Foundation", src: "/institute-marquee/institute-marquee-logos03.png" },
  { name: "JBIMS", src: "/institute-marquee/institute-marquee-logos04.png" },
  { name: "Vishwakarma Institutes", src: "/institute-marquee/institute-marquee-logos05.png" },
  { name: "Thapar Institute", src: "/institute-marquee/institute-marquee-logos06.png" },
  { name: "Graphic Era University", src: "/institute-marquee/institute-marquee-logos07.png" },
  { name: "VIT", src: "/institute-marquee/institute-marquee-logos08.png" },
  { name: "REC", src: "/institute-marquee/institute-marquee-logos09.png" },
  { name: "SRM", src: "/institute-marquee/institute-marquee-logos10.png" },
]

export function InstituteLogoGrid() {
  return (
    <section
      data-section-bg="light"
      className="border-t border-[var(--border-default)] bg-[var(--bg-page)]"
    >
      <div className="mx-auto max-w-6xl border-x border-[var(--border-default)] px-6 py-20 lg:px-12 lg:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mx-auto max-w-2xl text-center text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--text-primary)]"
        >
          Universities and NGOs{" "}
          <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-600)]">
            growing
          </span>{" "}
          with PluginLive
        </motion.h2>

        {/* Framed gallery — hairline border + corner crosses. Centre-aligned
            wrap so every row (including the last) is balanced. */}
        <div className="relative mt-12 border border-[var(--border-default)] px-6 py-8 lg:px-8 lg:py-10">
          <CornerPlus />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-9 sm:gap-x-8">
            {LOGOS.map((logo, i) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.5, delay: 0.05 * (i % 6), ease: EASE }}
                className="flex basis-[40%] items-center justify-center p-3 sm:basis-[29%] md:basis-[22%] lg:basis-[16%] xl:basis-[14%]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-[80px] w-auto max-w-full object-contain lg:h-[104px]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
