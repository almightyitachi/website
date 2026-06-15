import Link from "next/link"

import { DottedWordmark } from "./DottedWordmark"

// Marketing footer — minimal. Opens with a large dotted-stipple brand wordmark
// (just after the closing note), then a single nav band (primary links · company
// links) over a hairline, then a copyright + socials row. Used on the L1
// marketing page and every L2 audience page. The dotted wordmark is the only
// brand mark here (the centred logo is hidden for now); everything else is
// quiet, white-on-near-black.

// Mirror the top nav exactly — same labels, same in-page section targets
// (NAV_LINKS in MarketingNav). `/#<id>` works from any route: on `/` it jumps
// to the section, elsewhere it navigates home and lands on the anchor.
const PRIMARY_LINKS: { label: string; href: string }[] = [
  { label: "Hire", href: "/#v3-altitudes" },
  { label: "Why Us", href: "/#v6-ecosystem-layers" },
  { label: "Platform", href: "/#capabilities" },
  { label: "Case Studies", href: "/#case-studies" },
]

const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: "The Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#book" },
]

// Social glyphs — inline so we don't depend on a brand-icon set. Monochrome,
// inherit currentColor, sized to 18px inside a 44px touch target.
function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M24 12a12 12 0 1 0-13.875 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.79-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385A12 12 0 0 0 24 12Z" />
    </svg>
  )
}

const SOCIALS: { label: string; href: string; Icon: () => React.ReactElement }[] =
  [
    { label: "PluginLive on X", href: "https://x.com/pluginlive", Icon: IconX },
    {
      label: "PluginLive on Instagram",
      href: "https://instagram.com/pluginlive",
      Icon: IconInstagram,
    },
    {
      label: "PluginLive on LinkedIn",
      href: "https://www.linkedin.com/company/pluginlive",
      Icon: IconLinkedIn,
    },
    {
      label: "PluginLive on Facebook",
      href: "https://facebook.com/pluginlive",
      Icon: IconFacebook,
    },
  ]

export function MarketingFooter() {
  return (
    <footer
      data-section-bg="dark"
      // flow-root establishes a block formatting context so the wordmark's
      // top margin stays inside the footer (dark) instead of collapsing
      // through the top edge and revealing the page background.
      className="relative flow-root overflow-x-clip bg-[var(--bg-brand)]"
    >
      {/* Oversized dotted-stipple wordmark — decorative brand mark at the top
          of the footer, pulled up to sit close to the closing note. Shown in
          full (descenders included, no clip). The P's dots fill with the
          logo's colour placement on scroll-in (see DottedWordmark). The
          cobalt glow lives at the bottom of the footer, not behind the dots. */}
      <DottedWordmark />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Nav band — primary links · company links. The centred wordmark is
            hidden for now; the dotted-stipple wordmark above carries the
            brand close. */}
        <div className="flex flex-col items-center gap-6 pb-8 pt-0 lg:flex-row lg:justify-between lg:gap-8 lg:pb-7 lg:pt-0">
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 lg:justify-start">
            {PRIMARY_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/55 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 lg:justify-end">
            {COMPANY_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/55 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="h-px w-full bg-white/[0.08]" />

        {/* Copyright · socials */}
        <div className="flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between lg:pb-7">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-white/45">
            <span>© PluginLive 2026</span>
            <Link href="/privacy" className="transition-colors hover:text-white/75">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/75">
              Terms
            </Link>
          </div>

          <div className="-mr-2 flex items-center">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-sm text-white/55 transition-colors hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Soft cobalt glow pooling along the bottom edge of the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-48 w-[78%]"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 100%, rgba(73,79,223,0.2), transparent 72%)",
          filter: "blur(30px)",
        }}
      />
    </footer>
  )
}
