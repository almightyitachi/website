"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Cover } from "@/components/ui/cover"
import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"

import { HeroProductMockup } from "./HeroProductMockup"

const HERO_ANCHORS = [
  { value: "40,000+", label: "Pre-vetted students" },
  { value: "540+",    label: "Partner colleges" },
  { value: "48 hr",   label: "JD to ranked shortlist" },
  { value: "EEO",     label: "Compliant by default" },
] as const

export function AnimatedHeroV2() {
  return (
    <section
      data-section-bg="light"
      className="relative overflow-hidden pt-32 lg:pt-40"
    >
      {/* Same grid as V1 — design-system grey, fades around the mockup mid */}
      <GridPattern
        width={48}
        height={48}
        squares={[
          [3, 4],
          [7, 2],
          [11, 6],
          [4, 9],
          [9, 11],
          [14, 4],
          [17, 10],
          [21, 7],
          [25, 3],
          [28, 9],
        ]}
        className="inset-0 h-full stroke-[var(--color-neutral-200)] fill-[var(--color-neutral-200)] [mask-image:linear-gradient(to_bottom,black_0%,black_42%,rgba(0,0,0,0.45)_62%,transparent_88%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Text container */}
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="fade-up text-[clamp(38px,5vw,64px)] font-bold leading-[1.04] tracking-[-0.025em] text-[var(--text-primary)]"
            style={{ animationDelay: "0ms" }}
          >
            <span className="block">Hire campus talent</span>
            <span className="block">that&apos;s already been</span>
            <span className="block">
              <Cover>audited</Cover>
              <span className="inline-block">.</span>
            </span>
          </h1>

          <p
            className="fade-up mx-auto mt-8 max-w-2xl text-lg leading-[1.55] text-[var(--text-body)] lg:text-[19px]"
            style={{ animationDelay: "100ms" }}
          >
            PluginLive runs proctored assessments at 540+ Indian colleges,
            then opens that pool to corporates as a ranked, audit-ready
            shortlist. Hover the word above to see what audit-grade looks
            like in motion.
          </p>

          <div
            className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "200ms" }}
          >
            <Button asChild size="lg">
              <Link href="#book">Book a walkthrough</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#audit">
                See the audit trail
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Image container */}
        <div
          className="fade-up mx-auto mt-16 max-w-5xl lg:mt-20"
          style={{ animationDelay: "300ms" }}
        >
          <HeroProductMockup />
        </div>

        {/* Stats anchor strip */}
        <div
          className="fade-up mt-20 lg:mt-28"
          style={{ animationDelay: "400ms" }}
        >
          <div className="grid grid-cols-2 border-y border-[var(--border-default)] lg:grid-cols-4">
            {HERO_ANCHORS.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "px-4 py-6 lg:px-6 lg:py-8",
                  i % 2 === 1 && "border-l border-[var(--border-default)]",
                  "lg:border-l lg:border-[var(--border-default)]",
                  i === 0 && "lg:border-l-0",
                  i >= 2 && "border-t border-[var(--border-default)] lg:border-t-0"
                )}
              >
                <p className="text-[clamp(22px,6vw,40px)] font-bold leading-[1] tracking-[-0.02em] tabular-nums text-[var(--text-primary)]">
                  {s.value}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)] lg:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
