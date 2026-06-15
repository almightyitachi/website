"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

import { Cross } from "@/components/marketing/CornerPlus"

// ─── Testimonial data ──────────────────────────────────────────────────

interface InstituteTestimonial {
  quote: string
  name: string
  role: string
  institute: string
  avatar: string
}

const TESTIMONIALS: InstituteTestimonial[] = [
  {
    quote:
      "Before PluginLive, we managed placements on spreadsheets and WhatsApp groups. Now every drive invitation, student response, and outcome is tracked in one dashboard. Our placement rate jumped 34% in the first season.",
    name: "Dr. Rajesh Menon",
    role: "Training & Placement Officer",
    institute: "NIT Trichy",
    avatar: "RM",
  },
  {
    quote:
      "Most corporates had never heard of us. PluginLive put our students on the same shortlist as metro institutions. Twelve companies visited for the first time last year.",
    name: "Prof. Sunita Deshmukh",
    role: "Placement Director",
    institute: "BVCE Pune",
    avatar: "SD",
  },
  {
    quote:
      "Outcome reporting took three weeks to compile. Now it generates in real time: placement rate, gender split, tier distribution, all EEO-compliant. The board gets the numbers the same week.",
    name: "Dr. Meera Iyer",
    role: "Dean of Placements",
    institute: "Christ University",
    avatar: "MI",
  },
]

// ─── Institute logo data ───────────────────────────────────────────────

interface InstituteLogo {
  name: string
  src?: string
}

const LOGO_ROW_1: InstituteLogo[] = [
  { name: "NIT Trichy" },
  { name: "VIT Vellore" },
]

const LOGO_ROW_2: InstituteLogo[] = [
  { name: "SRM University" },
  { name: "Christ University" },
  { name: "BITS Pilani" },
  { name: "PSG Tech" },
]

const LOGO_ROW_3: InstituteLogo[] = [
  { name: "LNMIIT Jaipur" },
  { name: "BVCE Pune" },
]

// ─── Stars ─────────────────────────────────────────────────────────────

function FiveStars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className="fill-[var(--color-brand-amber)] text-[var(--color-brand-amber)]"
        />
      ))}
    </div>
  )
}

// ─── Logo cell ─────────────────────────────────────────────────────────

function LogoCell({ logo }: { logo: InstituteLogo }) {
  return (
    <div className="flex h-14 w-[160px] items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
      {logo.src ? (
        <img
          src={logo.src}
          alt={logo.name}
          className="h-5 w-auto object-contain opacity-50 invert"
        />
      ) : (
        <span className="text-xs font-medium text-white/40">{logo.name}</span>
      )}
    </div>
  )
}

// ─── Component ─────────────────────────────────────────────────────────

export function InstituteVoicesDark() {
  return (
    <section
      data-section-bg="dark"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[var(--bg-brand)]"
    >
      {/* Dot grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Corner crosses — decorative accents, unified glyph (no rail to break) */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map(
        (pos) => (
          <Cross key={pos} tone="dark" masked={false} className={pos} />
        ),
      )}

      <div className="relative mx-auto max-w-6xl px-8 py-20 lg:px-12 lg:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-md border border-white/[0.12] bg-white/[0.06] px-3 py-1 text-xs font-medium text-[var(--color-primary-300)]">
            Institutes
          </span>
          <h2 className="mt-5 text-[clamp(30px,3.6vw,44px)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
            And on the Institutes side.
          </h2>
        </motion.div>

        {/* Testimonial cards — 3 across */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-5% 0px" }}
              className="flex flex-col rounded-md border border-white/[0.08] bg-white/[0.04] p-6"
            >
              <FiveStars />

              <p className="mt-4 flex-1 text-[14px] leading-[1.65] text-white/65">
                {t.quote}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-600)] text-[11px] font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/40">
                    {t.role}, {t.institute}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Institute logo grid — staggered rows */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center gap-3 lg:mt-20"
        >
          <div className="flex justify-center gap-3">
            {LOGO_ROW_1.map((l) => (
              <LogoCell key={l.name} logo={l} />
            ))}
          </div>
          <div className="flex justify-center gap-3">
            {LOGO_ROW_2.map((l) => (
              <LogoCell key={l.name} logo={l} />
            ))}
          </div>
          <div className="flex justify-center gap-3">
            {LOGO_ROW_3.map((l) => (
              <LogoCell key={l.name} logo={l} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
