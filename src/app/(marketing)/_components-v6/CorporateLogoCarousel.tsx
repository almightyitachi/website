"use client"

import { motion } from "framer-motion"

// Section 6A — Corporate. An auto-scrolling, tilted card carousel of recruiter
// logos on the dark brand band. Each square card carries the same cobalt orb
// gradient as the Intelligence graphic (Section 4); cards sit at slight,
// balanced angles for a playful rhythm and straighten + lift on hover. The
// scroll is a CSS ticker (linear, off the main thread, pauses on hover, halts
// under reduced motion).

const EASE = [0.16, 1, 0.3, 1] as const

// Card surface — the Intelligence graphic's cobalt orb gradient.
const CARD_BG =
  "radial-gradient(120% 120% at 32% 24%, var(--color-primary-400) 0%, var(--color-primary-600) 52%, var(--color-primary-900) 100%)"

interface Logo {
  name: string
  src: string
}

const LOGOS: Logo[] = [
  { name: "Lloyds Technology Centre", src: "/corporate-marquee/corporate-marquee-logos01.png" },
  { name: "360 ONE", src: "/corporate-marquee/corporate-marquee-logos02.png" },
  { name: "ANAND", src: "/corporate-marquee/corporate-marquee-logos03.png" },
  { name: "IDFC First Bank", src: "/corporate-marquee/corporate-marquee-logos04.png" },
  { name: "Google", src: "/corporate-marquee/corporate-marquee-logos05.png" },
  { name: "Goldman Sachs", src: "/corporate-marquee/corporate-marquee-logos06.png" },
  { name: "LIC", src: "/corporate-marquee/corporate-marquee-logos07.png" },
  { name: "IndusInd Bank", src: "/corporate-marquee/corporate-marquee-logos08.png" },
  { name: "KPMG", src: "/corporate-marquee/corporate-marquee-logos09.png" },
  { name: "HDFC Bank", src: "/corporate-marquee/corporate-marquee-logos10.png" },
  { name: "Unity Small Finance Bank", src: "/corporate-marquee/corporate-marquee-logos11.png" },
  { name: "Lighthouse Canton", src: "/corporate-marquee/corporate-marquee-logos12.png" },
  { name: "Delhivery", src: "/corporate-marquee/corporate-marquee-logos13.png" },
  { name: "Meesho", src: "/corporate-marquee/corporate-marquee-logos14.png" },
  { name: "Mahindra Finance", src: "/corporate-marquee/corporate-marquee-logos15.png" },
  { name: "Tata Consultancy Services", src: "/corporate-marquee/corporate-marquee-logos16.png" },
  { name: "NSE", src: "/corporate-marquee/corporate-marquee-logos17.png" },
  { name: "Equirus", src: "/corporate-marquee/corporate-marquee-logos18.png" },
  { name: "DLF", src: "/corporate-marquee/corporate-marquee-logos19.png" },
  { name: "JM Financial", src: "/corporate-marquee/corporate-marquee-logos20.png" },
]

// Balanced pseudo-random tilt per card, kept within -3deg..+3deg so the row
// reads playful, never chaotic.
const TILTS = [
  -2, 1.5, -3, 2, -1, 2.5, -2.5, 1, -1.5, 3,
  -2, 0.5, -3, 1.5, -1, 2, -2.5, 1, -1.5, 2.5,
]

export function CorporateLogoCarousel() {
  // Render the set twice so the -50% ticker loops seamlessly.
  const row = [...LOGOS, ...LOGOS]

  return (
    <section
      data-section-bg="dark"
      className="overflow-hidden border-t border-white/[0.06] bg-[var(--bg-brand)] py-20 lg:py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.55, ease: EASE }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        <h2 className="text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
          Companies{" "}
          <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-300)]">
            growing
          </span>{" "}
          with PluginLive
        </h2>
      </motion.div>

      {/* Carousel — edge-masked, auto-scrolling row of tilted cards. */}
      <div
        className="relative mt-12 lg:mt-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          className="ticker-track flex w-max items-center gap-3 px-5 py-6 motion-reduce:animate-none"
          style={{ animationDuration: "60s" }}
        >
          {row.map((logo, i) => {
            const tilt = TILTS[i % TILTS.length]
            const isClone = i >= LOGOS.length
            return (
              <div
                key={`${logo.name}-${i}`}
                aria-hidden={isClone}
                style={
                  {
                    "--tilt": `${tilt}deg`,
                    background: CARD_BG,
                  } as React.CSSProperties
                }
                className="size-[140px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.12] shadow-lg [transform:rotate(var(--tilt))] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotate(0deg)_translateY(-6px)_scale(1.05)] motion-reduce:transition-none sm:size-[170px] lg:size-[200px]"
              >
                <div className="flex h-full w-full items-center justify-center p-[16%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={isClone ? "" : logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
