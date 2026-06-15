"use client"

import { useEffect, useState, type MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Wordmark } from "./Wordmark"

// Top-of-page audience nav. Self-contained — owns its own scroll-driven
// dark/light state by reading every section's `data-section-bg` on the
// current page, so the same component drops onto L1 and every L2 page
// without configuration. Sections with `data-section-bg="dark"` flip
// the nav to white-on-black; default `light` reads as black-on-white.
//
// Scroll behaviour: at the top of the page the nav is a wide, transparent,
// borderless bar (logo left, links centred, actions right). Once scrolled
// past 50px the outer container condenses its max-width and the bar fills
// in as the liquid-glass pill (border + blur + lifted shadow).
//
// One-pager nav: links are in-page anchors into the production landing
// sections (see docs/landing-sections.md), not L2 route redirects. Each
// href is `/#<section-id>` so the link works from any page — on `/` it
// smooth-scrolls to the section (handled in onClick); on an L2 page it
// navigates home and lands on the anchor. The active underline is driven by a
// scroll-spy that tracks which section sits under the nav.

const NAV_LINKS: { label: string; id: string }[] = [
  { label: "Hire",         id: "v3-altitudes" },
  { label: "Why Us",       id: "v6-ecosystem-layers" },
  { label: "Platform",     id: "capabilities" },
  { label: "Case Studies", id: "case-studies" },
]

// Controlled, eased page scroll. Native `scrollIntoView({behavior:"smooth"})`
// stutters here: the page stacks a sticky hero, a 300vh pinned track, and
// several scroll-driven sections, so over a long distance the browser's smooth
// scroll snaps when the main thread is busy. A fixed rAF tween on an ease-out
// curve is distance-independent and visually continuous. It bails immediately
// if the user scrolls (wheel / touch / keys), so it never fights manual input,
// and collapses to an instant jump under reduced motion.
function smoothScrollToY(targetY: number, reduce: boolean) {
  const maxY = document.documentElement.scrollHeight - window.innerHeight
  const destY = Math.max(0, Math.min(targetY, maxY))
  if (reduce) {
    window.scrollTo(0, destY)
    return
  }
  const startY = window.scrollY
  const diff = destY - startY
  if (Math.abs(diff) < 2) return
  // Scale duration to distance so short hops feel snappy and long jumps stay
  // calm, clamped to a band that holds up for the far sections (the 300vh
  // pinned "Why Us" track and the tall "Offerings" stack sit a long way down).
  const duration = Math.min(1300, Math.max(500, Math.abs(diff) * 0.5))
  // ease-in-OUT cubic. An ease-OUT curve front-loads the motion (covering ~30%
  // of the distance in the first 5% of the time), which on a long-distance jump
  // reads as an instant teleport then a crawl, the "snap" between far sections.
  // ease-in-out accelerates and decelerates symmetrically, so the whole journey
  // is one continuous glide with no leap at either end.
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  let cancelled = false
  let startTs: number | null = null
  const onUserScroll = () => {
    cancelled = true
  }
  const cleanup = () => {
    window.removeEventListener("wheel", onUserScroll)
    window.removeEventListener("touchstart", onUserScroll)
    window.removeEventListener("keydown", onUserScroll)
  }
  window.addEventListener("wheel", onUserScroll, { passive: true })
  window.addEventListener("touchstart", onUserScroll, { passive: true })
  window.addEventListener("keydown", onUserScroll)

  const step = (ts: number) => {
    if (cancelled) {
      cleanup()
      return
    }
    if (startTs === null) startTs = ts
    const t = Math.min(1, (ts - startTs) / duration)
    window.scrollTo(0, startY + diff * ease(t))
    if (t < 1) requestAnimationFrame(step)
    else cleanup()
  }
  requestAnimationFrame(step)
}

export function MarketingNav({
  onScheduleClick,
}: {
  /** Opens the walkthrough form modal (hoisted in page.tsx). When absent
   *  (L2 pages without the modal), the CTA falls back to the /#book anchor. */
  onScheduleClick?: () => void
} = {}) {
  const [navBg, setNavBg] = useState<"dark" | "light">("light")
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // Scroll-spy: id of the nav section currently sitting under the nav.
  // Null when above the first tracked section (e.g. in the hero).
  const [activeId, setActiveId] = useState<string | null>(null)
  const pathname = usePathname()
  const onLanding = pathname === "/"
  const reduce = useReducedMotion()

  // A link is active when its section is the one currently in view. The
  // underline only lights on the landing page, where the anchors resolve.
  const isActive = (id: string) => onLanding && activeId === id

  // Smooth-scroll to a section when already on the landing page; otherwise
  // let the Link navigate home to `/#id` and land on the anchor natively.
  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (!onLanding) return
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    const targetY = window.scrollY + target.getBoundingClientRect().top
    smoothScrollToY(targetY, !!reduce)
    history.replaceState(null, "", `#${id}`)
  }

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [mobileOpen])

  // Read the section visually sitting under the nav and flip the nav's
  // dark/light state to match. We probe on every tick because sections may
  // mount/unmount (variant toggles) and, more importantly, the V6 hero is
  // STICKY — it stays pinned behind later sections as they scroll over it.
  // A rect-only scan in DOM order would keep matching that pinned dark hero
  // even when a white section is layered on top of it. elementsFromPoint
  // returns the hit-test stack top-first, so we skip the nav (which has no
  // data-section-bg) and take the first real section behind it — respecting
  // sticky / z-index stacking the way the eye actually sees it.
  useEffect(() => {
    // Probe near the nav's vertical centre; the nav band itself is skipped
    // because it carries no data-section-bg.
    const NAV_PROBE_Y = 48

    // rAF-coalesced: scroll, resize, and DOM-mutation signals all funnel
    // through `schedule`, which runs the (layout-reading) probe at most once
    // per frame. Without this, `elementsFromPoint` ran synchronously on every
    // scroll event and every subtree mutation, flooding the main thread and
    // making programmatic smooth-scrolls visibly stutter.
    let raf = 0

    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 50)

      const stack = document.elementsFromPoint(
        window.innerWidth / 2,
        NAV_PROBE_Y,
      )
      let current: HTMLElement | null = null
      for (const el of stack) {
        const section = (el as HTMLElement).closest<HTMLElement>(
          "[data-section-bg]",
        )
        if (section) {
          current = section
          break
        }
      }

      const next = (current?.getAttribute("data-section-bg") ?? "light") as
        | "dark"
        | "light"
      setNavBg((prev) => (prev === next ? prev : next))

      // A section may opt the nav out entirely (e.g. the closing CTA band,
      // which already repeats every link + the primary action). Retract the
      // bar as soon as that section *rises into* the upper viewport — well
      // before it reaches the nav line — and keep it retracted through
      // everything beneath it (the footer included). Driving the threshold
      // off the section's own offset, rather than a single hit-test line,
      // means the boolean flips with a comfortable lead so the 500ms slide
      // plays out as a deliberate retract instead of a late snap.
      const optOut = document.querySelector<HTMLElement>("[data-nav-hidden]")
      const nextHidden = optOut
        ? optOut.getBoundingClientRect().top < window.innerHeight * 0.55
        : false
      setHidden((prev) => (prev === nextHidden ? prev : nextHidden))

      // Scroll-spy — light the link whose section currently crosses the
      // upper viewport. Walk the tracked sections in order and keep the last
      // one whose top has passed the spy line, so the underline advances as each
      // section rises under the nav.
      const SPY_LINE = window.innerHeight * 0.3
      let nextActive: string | null = null
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id)
        if (el && el.getBoundingClientRect().top <= SPY_LINE) {
          nextActive = link.id
        }
      }
      setActiveId((prev) => (prev === nextActive ? prev : nextActive))
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    // Re-probe when the DOM tree changes (variant toggles add/remove
    // sections, which would otherwise leave the nav stuck on the prior
    // band's variant until the next scroll event).
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const isDark = navBg === "dark"

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full px-2 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hidden && "pointer-events-none -translate-y-[140%] opacity-0",
        )}
      >
        {/* Outer container animates its max-width: a wide bar at the top of
            the page that condenses toward the centre once scrolled. */}
        <div
          className={cn(
            "mx-auto mt-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            // On scroll the pill condenses to ~60% of the full width
            // (1280px → 768px, a 40% reduction).
            scrolled ? "max-w-3xl" : "max-w-7xl",
          )}
        >
          <nav
            aria-label="Primary"
            className={cn(
              "relative flex items-center gap-3 overflow-hidden rounded-xl px-3 transition-all duration-300",
              // At the top: a transparent, borderless bar. Once scrolled:
              // the liquid-glass pill (border + blur + lifted shadow).
              scrolled
                ? cn(
                    "h-[68px] border backdrop-blur-2xl backdrop-saturate-[180%]",
                    isDark
                      ? "border-white/[0.10] bg-[color-mix(in_srgb,var(--bg-brand)_62%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_4px_24px_rgba(0,0,0,0.32)]"
                      : "border-black/[0.08] bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),_0_2px_20px_rgba(15,15,15,0.10)]",
                  )
                : "h-[76px] border border-transparent bg-transparent",
            )}
          >
            {/* Glass rim highlight + liquid shimmer — only once condensed */}
            {scrolled && (
              <>
                {/* Specular top-edge highlight — light catching the glass rim */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background: isDark
                      ? "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.14) 50%, transparent 95%)"
                      : "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.95) 50%, transparent 95%)",
                  }}
                />
                {/* Liquid shimmer — 200%-wide gradient drifts back and forth */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0"
                  style={{
                    width: "200%",
                    left: "-50%",
                    background: isDark
                      ? "linear-gradient(108deg, transparent 30%, color-mix(in srgb, var(--color-primary-600) 5.5%, transparent) 50%, transparent 70%)"
                      : "linear-gradient(108deg, transparent 18%, rgba(255,255,255,0.58) 50%, transparent 82%)",
                    animation: "navLiquidShift 8s ease-in-out infinite alternate",
                  }}
                />
              </>
            )}

            {/* Left — wordmark. The three groups (logo / links / actions)
                each take an equal third via `flex-1 basis-0`, so the bar is
                split into matching containers and the links stay centred. */}
            <div className="relative z-10 flex flex-1 basis-0 items-center">
              <Link href="/" className="inline-flex items-center px-1">
                <Wordmark inverted={isDark} className="h-16 w-auto" />
              </Link>
            </div>

            {/* Centre — primary links, centred within their equal third.
                Active state is brand-tinted text plus a short rounded
                underline bar beneath the label; a shared `layoutId` glides
                the bar between links as the active section changes. Hover is
                a quiet text-colour shift only, so the underline stays the
                single indicator. */}
            <LayoutGroup id="nav-active">
              <div className="relative z-10 hidden flex-1 basis-0 items-center justify-center gap-1 lg:flex">
                {NAV_LINKS.map((l) => {
                  const active = isActive(l.id)
                  return (
                    <Link
                      key={l.label}
                      href={`/#${l.id}`}
                      onClick={(e) => handleNavClick(e, l.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200",
                        active
                          ? isDark
                            ? "text-white"
                            : "text-[var(--text-brand)]"
                          : isDark
                            ? "text-white/65 hover:text-white"
                            : "text-[var(--color-neutral-600)] hover:text-[var(--text-primary)]",
                      )}
                    >
                      {l.label}
                      {active && (
                        <motion.span
                          layoutId="nav-active-underline"
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute inset-x-0 bottom-0.5 mx-auto h-[2px] w-4 rounded-full",
                            isDark
                              ? "bg-[var(--color-primary-300)]"
                              : "bg-[var(--color-primary-600)]",
                          )}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </LayoutGroup>

            {/* Right — actions, pinned to the end of their equal third */}
            <div className="relative z-10 flex flex-1 basis-0 items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-200 lg:hidden",
                  isDark
                    ? "text-white/65 hover:bg-white/10 hover:text-white"
                    : "text-[var(--color-neutral-700)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]",
                )}
              >
                <Menu size={18} />
              </button>

              {onScheduleClick ? (
                <Button type="button" className="ml-1" onClick={onScheduleClick}>
                  <span className="sm:hidden">Walkthrough</span>
                  <span className="hidden sm:inline">Schedule a Walkthrough</span>
                </Button>
              ) : (
                <Button asChild className="ml-1">
                  <Link href="/#book">
                    <span className="sm:hidden">Walkthrough</span>
                    <span className="hidden sm:inline">Schedule a Walkthrough</span>
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              exit={{ y: "120%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-4 bottom-4 flex h-[60vh] flex-col overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-lg"
            >
              <div className="flex items-center justify-end px-5 pb-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                >
                  <X size={18} />
                </button>
              </div>

              <nav
                aria-label="Mobile primary"
                className="flex-1 overflow-y-auto px-3 pb-2"
              >
                <ul className="space-y-1">
                  {/* Home — jumps back to the hero (top of the landing). On
                      an L2 page the Link navigates home; on the landing it
                      smooth-scrolls to the top. */}
                  <li>
                    <Link
                      href="/"
                      onClick={(e) => {
                        if (onLanding) {
                          e.preventDefault()
                          smoothScrollToY(0, !!reduce)
                          history.replaceState(null, "", "/")
                        }
                        setMobileOpen(false)
                      }}
                      className="block rounded-md px-4 py-4 text-base font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
                    >
                      Home
                    </Link>
                  </li>
                  {NAV_LINKS.map((l) => {
                    const active = isActive(l.id)
                    return (
                      <li key={l.label}>
                        <Link
                          href={`/#${l.id}`}
                          onClick={(e) => {
                            handleNavClick(e, l.id)
                            setMobileOpen(false)
                          }}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-md px-4 py-4 text-base transition-colors",
                            active
                              ? "bg-[var(--bg-brand-subtle)] font-semibold text-[var(--text-brand)]"
                              : "font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
                          )}
                        >
                          {l.label}
                          {/* Current-section indicator — replaces the chevron;
                              a brand dot reads as "you are here", not "go". */}
                          {active && (
                            <span
                              aria-hidden
                              className="size-1.5 rounded-full bg-[var(--color-primary-600)]"
                            />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="flex flex-col gap-3 border-t border-[var(--border-default)] p-4">
                {onScheduleClick ? (
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setMobileOpen(false)
                      onScheduleClick()
                    }}
                  >
                    Schedule a Walkthrough
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full">
                    <Link href="/#book" onClick={() => setMobileOpen(false)}>
                      Schedule a Walkthrough
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
