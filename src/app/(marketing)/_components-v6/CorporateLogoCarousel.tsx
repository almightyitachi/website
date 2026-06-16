"use client"

import { motion } from "framer-motion"

// Section 6A — Corporate. An auto-scrolling, tilted card carousel of recruiter
// logos on the dark brand band. Each square card uses the same dark glass
// surface as the small satellite tiles in the Intelligence graphic (Section 4)
// — translucent white fill, hairline border, an inset top highlight and a
// subtle blur. Cards sit at slight, balanced angles for a playful rhythm and
// straighten + lift on hover. The scroll is a CSS ticker (linear, off the main
// thread, pauses on hover, halts under reduced motion).

const EASE = [0.16, 1, 0.3, 1] as const

// Corner pins on each card — the same four dots that mark the Intelligence
// satellite tiles.
const PINS = ["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"]

// Marks that are dark on a transparent background, so they disappear on the
// dark glass card — render these as a white knockout. Indices into LOGOS.
const WHITEN = new Set([0, 8, 9, 12, 15, 16, 17, 18, 19])

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
      className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--bg-brand)] py-20 lg:py-28"
    >
      {/* Centred cobalt glow — the voltage from the pull-quote band that used
          to sit below this carousel, pooled behind the cards. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[460px] w-[820px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(73,79,223,0.16) 0%, transparent 65%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative z-10 mx-auto max-w-2xl px-6 text-center"
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
        className="relative z-10 mt-12 lg:mt-16"
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
            const white = WHITEN.has(i % LOGOS.length)
            return (
              <div
                key={`${logo.name}-${i}`}
                aria-hidden={isClone}
                style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
                className="relative size-[140px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.14] bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm [transform:rotate(var(--tilt))] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:[transform:rotate(0deg)_translateY(-6px)_scale(1.05)] motion-reduce:transition-none sm:size-[170px] lg:size-[200px]"
              >
                <div className="flex h-full w-full items-center justify-center p-[16%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={isClone ? "" : logo.name}
                    className={`max-h-full max-w-full object-contain${
                      white ? " brightness-0 invert" : ""
                    }`}
                  />
                </div>

                {/* Corner pins — matching the Intelligence satellite tiles */}
                {PINS.map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`absolute size-1 rounded-full bg-white/25 ${pos}`}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
