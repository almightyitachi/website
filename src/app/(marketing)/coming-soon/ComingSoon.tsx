"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ParticleField } from "@/components/ui/particle-effect-for-hero"

import { EarlyAccessForm } from "./EarlyAccessForm"

/**
 * Shared "Coming soon" surface for every route that isn't the landing page.
 * Same design as the global 404 (`src/app/not-found.tsx`) — the dark brand
 * band, the interactive ParticleField, and the gradient + serif hook-word
 * headline — only the content changes. `title` (the requested page, e.g.
 * "The Team") shows as the eyebrow so visitors know which page is on its way.
 */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div
      data-surface="website"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-brand)] px-6 py-20 text-center"
    >
      {/* Interactive particle background (decorative, pointer-reactive) */}
      <ParticleField className="z-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        {/* Eyebrow — the page that's on its way */}
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">
          {title}
        </p>

        {/* Display headline — inverse gradient + one cobalt serif hook word,
            the same device as the 404 and the hero */}
        <h1 className="mt-5 max-w-[16ch] text-[clamp(48px,9vw,116px)] font-bold leading-[1.0] tracking-[-0.04em]">
          <span className="bg-gradient-to-b from-white to-white/45 bg-clip-text text-transparent">
            Coming
          </span>{" "}
          <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-300)]">
            soon
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
          This page is on its way. We&apos;re putting the finishing touches on
          it — leave your email and we&apos;ll let you know the moment it goes
          live.
        </p>

        {/* Early-access capture */}
        <div className="mt-9 w-full max-w-md">
          <EarlyAccessForm />
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to home
        </Link>
      </div>
    </div>
  )
}
