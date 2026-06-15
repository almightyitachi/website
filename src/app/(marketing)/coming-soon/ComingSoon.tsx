"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MarketingFooter } from "@/components/marketing/MarketingFooter"
import { MarketingNav } from "@/components/marketing/MarketingNav"

import { EarlyAccessForm } from "./EarlyAccessForm"

// Shared "Coming soon" surface for every route that isn't the landing page.
// Rendered with full site chrome (nav + footer) so the page reads as part of
// the site, not a dead end. `title` is the friendly name of the requested
// page (e.g. "The Team"), shown as the eyebrow. The same border-softening and
// page background as the landing keep the surface consistent.
export function ComingSoon({ title }: { title: string }) {
  return (
    <div
      className="flex min-h-screen flex-col bg-[var(--bg-page)] font-sans"
      style={{ "--border-default": "rgba(226,226,231,0.6)" } as React.CSSProperties}
    >
      <MarketingNav
        onScheduleClick={() => {
          window.location.href = "/#book"
        }}
      />

      <main className="flex flex-1 items-center justify-center px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto w-full max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {title}
          </p>

          <h1 className="mt-5 text-[clamp(40px,7vw,72px)] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--text-primary)]">
            Coming{" "}
            <span className="font-serif font-normal italic tracking-[-0.04em] text-[var(--color-primary-600)]">
              soon
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.6] text-[var(--text-muted)]">
            This page is on its way. We&rsquo;re putting the finishing touches on
            it — in the meantime, the full story lives on the home page.
          </p>

          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/">
                <ArrowLeft size={16} className="mr-1" />
                Back to home
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-12 max-w-md border-t border-[var(--border-default)] pt-8">
            <EarlyAccessForm />
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
