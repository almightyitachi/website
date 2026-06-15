import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ParticleField } from "@/components/ui/particle-effect-for-hero"

/**
 * Global 404. Renders on the root layout (outside the (marketing) group), so
 * it sets `data-surface="website"` itself to opt into the website radius
 * scale, and stands up the dark brand band the marketing site uses for its
 * statement moments. The ParticleField supplies the interactive background;
 * content sits centred above it with the hook-word serif treatment.
 */
export default function NotFound() {
  return (
    <div
      data-surface="website"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-brand)] px-6 py-20 text-center"
    >
      {/* Interactive particle background (decorative, pointer-reactive) */}
      <ParticleField className="z-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        {/* Display number — inverse gradient, same device as the hero */}
        <p className="select-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-[clamp(96px,18vw,200px)] font-bold leading-none tracking-[-0.04em] text-transparent">
          404
        </p>

        {/* Headline with one cobalt-highlighted serif hook word */}
        <h1 className="mt-4 max-w-[20ch] text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
          This page drifted{" "}
          <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-300)]">
            off course
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
          The page you are looking for doesn&apos;t exist, may have moved, or
          the link that brought you here is out of date. Let&apos;s get you back
          to solid ground.
        </p>

        {/* Primary CTA */}
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
