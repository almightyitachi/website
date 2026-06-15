# Platform V1/V2 visual toggle — design

**Date:** 2026-05-14
**Scope:** `/dashboard`, `/roles` only. Marketing surfaces untouched.

## Motivation

User wants to A/B-test a more "branded" visual treatment of the platform's two highest-traffic surfaces against the current restrained dashboard. The reference for v2 is the `BorderBeam` + `TracingBeam` aesthetic (animated gradient borders + scroll-tracking left rail) — the actual `hero-195` source was not available, so v2 is built from those two signature pieces alone.

V1 is the existing dashboard / roles pages, unchanged. V2 adds a new hero band and a left-rail scroll thread.

## Non-goals

- Redesigning the existing 7 dashboard sections. They stay as-is in both versions.
- Touching marketing routes, the design page, or any other non-platform surface.
- Adding any new data fetching. The hero band reads the same mock data the dashboard already uses.

## Components to create

### 1. `src/components/ui/border-beam.tsx`

Verbatim copy of the dependency in the prompt. Defaults overridden:
- `colorFrom = "var(--color-primary-300)"`
- `colorTo = "var(--color-primary-700)"`

This collapses the orange→violet default onto the cobalt-violet ramp. The keyframe `@keyframes border-beam` gets added to `globals.css` if not already present.

### 2. `src/components/ui/tracing-beam.tsx`

Verbatim copy of the aceternity component. Gradient stops overridden inside the SVG `<linearGradient>`:
- `#18CCFC` → `var(--color-primary-300)`
- `#6344F5` → `var(--color-primary-600)`
- `#AE48FF` → `var(--color-primary-700)`

Head-dot active color stays emerald per source (it's a "you've started scrolling" affordance — not brand presence).

### 3. `src/components/platform/DriveSnapshotHero.tsx`

Shared hero band rendered above the existing content on both pages when v2 is active.

Visual:
- `bg-brand` (#0A0A0A) surface, `text-inverse` text.
- `rounded-md` (6px), `BorderBeam` traces the perimeter.
- Padding: `--space-8` (32px) all sides on `lg:`, `--space-6` on smaller.
- Three slots per consumer: eyebrow (mono, `text-xs`, muted), headline number (`text-2xl font-bold`, tabular-nums), supporting text + CTA row.

Props:
```ts
interface DriveSnapshotHeroProps {
  eyebrow: string
  headlineValue: string
  headlineLabel: string
  stats: { label: string; value: string }[]
  cta?: { label: string; href: string }
}
```

### 4. `src/components/platform/PlatformVersionSwitcher.tsx`

Floating segmented pill toggle, modelled on the existing `HeroSwitcher`:
- Position: `fixed top-[84px] left-1/2 -translate-x-1/2 z-40`.
- Two buttons: "Classic" (v1) | "Spotlight" (v2).
- Persisted in `localStorage` under key `pluginlive-platform-version`.
- Hydrates client-side; renders nothing until mount to keep SSR markup stable.
- Hidden when `usePathname()` is not in `['/dashboard', '/roles']`.
- Visibility class also fades it after `scrollY > 1200` (gives a glance, then gets out of the way).

Exports a `usePlatformVersion()` hook that returns `'v1' | 'v2'` and a setter — pages consume it.

## Files to edit

### `src/app/(platform)/(with-nav)/layout.tsx`

Mount `<PlatformVersionSwitcher />` near the top of the layout. Route gating happens inside the switcher.

### `src/app/(platform)/(with-nav)/dashboard/page.tsx`

- Read `usePlatformVersion()`.
- When `v2`: render `<DriveSnapshotHero ... />` above the existing `dashboardBody`, and wrap the section column in `<TracingBeam>` on `lg:` and up only (mobile gets the same layout without the rail — the rail breaks at narrow widths).
- When `v1`: zero changes — current rendering preserved verbatim.
- The empty-state takeover (`allEmpty` branch) is v1 behaviour and stays unchanged in both versions; the hero band sits above it in v2.

### `src/app/(platform)/(with-nav)/roles/page.tsx`

- Read `usePlatformVersion()`.
- When `v2`: render `<DriveSnapshotHero ... />` above the existing roles table.
- TracingBeam not used here — the roles page is shorter and the rail would feel arbitrary.

## NPM dependencies

Install: `framer-motion` (TracingBeam needs it).

Skip from the prompt's list:
- `@radix-ui/react-slot`, `class-variance-authority` — already in via shadcn.
- `@radix-ui/react-tabs`, `@radix-ui/react-label` — v2 design doesn't use them.

Verify presence first; only install if missing.

## Tailwind / globals.css

Tailwind 4 project. Add to `globals.css` if missing:
- `--animate-border-beam: border-beam 15s infinite linear;` inside `@theme inline`.
- `@keyframes border-beam { 100% { offset-distance: 100%; } }` outside.

Do not add the giant block of unrelated keyframes from the prompt's CSS — that's 21st.dev's universal install and 90% of it is unused here.

## Color overrides applied

| Source default | Project override |
|---|---|
| BorderBeam `#ffaa40` (colorFrom) | `var(--color-primary-300)` |
| BorderBeam `#9c40ff` (colorTo) | `var(--color-primary-700)` |
| TracingBeam `#18CCFC` | `var(--color-primary-300)` |
| TracingBeam `#6344F5` | `var(--color-primary-600)` |
| TracingBeam `#AE48FF` | `var(--color-primary-700)` |

## Acceptance

1. Toggle visible on `/dashboard` and `/roles`, not on `/`, `/design`, `/case-studies/*`, or any marketing route.
2. v1 looks pixel-identical to current dashboard / roles.
3. v2 renders hero band + (dashboard only) TracingBeam.
4. Selection persists across refresh and across the two routes.
5. No layout shift on hydration (renders v1 markup until mount, then swaps if v2 selected).
6. 1440 / 820 / 390 viewports all render cleanly. TracingBeam rail collapses below `lg:`.
7. `pnpm build` (or equivalent) passes.

## Out of scope / explicitly deferred

- Per-section BorderBeam treatment (rejected during brainstorm — too busy on a dense data surface).
- Hero-195's actual layout (source unavailable).
- Marketing surfaces.
