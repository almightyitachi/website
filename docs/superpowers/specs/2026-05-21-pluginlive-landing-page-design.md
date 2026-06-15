# PluginLive V3 Landing Page — Design Spec
**Date:** 2026-05-21 (last updated: 2026-05-22)
**Status:** Live — iterating
**Route:** `/?narrative=v3` (NarrativeContext variant `"v3"`)
**File:** `src/app/(marketing)/_components-v3/V3LandingPage.tsx`

---

## Overview

The V3 landing page is PluginLive's primary marketing surface — a Next.js 16 App Router component that replaces the earlier static prototype. It narrates the full platform story across nine sections: Hero → Altitudes → Marketplace → AI Layer → Trust & Stats → Capability Bands → Case Studies → Candidate Voices → Walkthrough CTA.

**Audience duality:** Fortune 500 HR head on Monday morning (dense, credible, data-forward) AND final-year student on placement Friday (warm, clear, aspirational). The hero carries both faces; downstream sections resolve to each audience's specific use case through the capability bands.

**Tech stack:** Next.js 16 · React 19 · Tailwind CSS v4 · framer-motion · lucide-react · shadcn/ui (New York style)

---

## Design System

Tokens live in `globals.css` and are documented in `docs/design-system.md`. All component code uses semantic tokens (`var(--text-primary)`, `var(--bg-brand)`, etc.) — no hardcoded hex values.

Key constraints for V3:
- Border radius max 6px — no pill shapes except literal avatars
- Shadows: `shadow-sm` on cards · `shadow-md` on popovers · `shadow-lg` on modals
- Primary CTA: `--color-primary-600` (#494FDF) only — brand-navy/amber/orange never as button fill
- Font: `'Satoshi', system-ui, sans-serif` at all sizes

---

## Motion Grammar

Module-level constants in `V3LandingPage.tsx` define the shared animation vocabulary:

```ts
const EASE = [0.16, 1, 0.3, 1]  // ease-out-expo

const V3_STAGGER_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const V3_FADE_UP = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}
```

- `whileInView` with `once: true` and `margin: "-15% 0px"` on all section containers
- `useReducedMotion()` gates all animations — reduced-motion users see instant final state
- Entrance durations: 350–550 ms · Feedback: 150–300 ms · No bounce/elastic easing

---

## Section 1 — Hero (3 variants)

A 3-way theme toggle (LIGHT / DARK / IMAGE) sits top-right of the hero. Variant state is lifted to `V3LandingPage` so the downstream Capability Bands section (`CapabilityFeaturesAi`) tracks the same surface colour.

### Variant A — Light editorial (default)

**Layout:** Centred stack, full-viewport height, white background, dot-grid pattern fading to transparent.

**Entrance choreography:**
| Element | Delay | Animation |
|---|---|---|
| Live-dot + eyebrow | 0 ms | opacity + y fade-up |
| "Hire at every" | 150 ms | opacity + y:24→0 |
| "Altitude." | 360 ms | clip-path `inset(0 100% 0 0)` → `inset(0 0% 0 0)` + opacity |
| Hairline underline | 1060 ms | scaleX 0→1, then opacity dissolves |
| Subhead | 540 ms | opacity + y:16→0 |
| CTAs | 700 ms | opacity + y:12→0 |
| "Learn more" chevron | 900 ms | opacity, then infinite bob |

**Eyebrow:** `Globe` icon · "India · AI hiring" — cobalt-600 on light

**H1:** "Hire at every **Altitude.**" — `clamp(40px,6.6vw,84px)`, weight 700, tracking -0.025em. "Altitude." in `--color-primary-600`.

**Subhead:** "Four tiers, one ranked platform. Campus to C-suite — proctored, scored, and shortlisted in 48 hours. No spreadsheets."

**CTAs:** "Schedule a Walkthrough" (primary) · "For Institutes & NGOs →" (outline ghost, links to `#v3-institutions`)

**"Learn more":** Anchors to `#v3-altitudes`, infinite bob animation.

---

### Variant B — Dark editorial

Same layout and choreography as Light. Surface switches to `--bg-brand` (#0A0A0A).

**Aurora:** Cobalt radial glow at hero top-centre, breathing 12s loop (opacity 0.55→0.9→0.55, scale 1→1.04→1). Signals "the network is live" without motion overload.

**Colour adjustments on dark:**
- H1 base: `text-white`
- "Altitude.": `--color-primary-300`
- Hairline: `--color-primary-300`
- Subhead: `text-white/70`
- Eyebrow: `--color-primary-300`
- "Learn more": `text-white/55 hover:text-white`, chevron hover → cobalt-300

---

### Variant C — Image (mountain depth)

**Layout:** Full-bleed stock photo (Swiss Alps, Unsplash `photo-1506905925346-21bda4d32df4`). "Hire at every / ALTITUDE." centred at 28% from top. Description + CTAs pinned to the bottom. Glass proof card bottom-right.

**Three-speed parallax — creates physical depth on scroll:**
| Layer | z-index | Scroll rate (0→18%) |
|---|---|---|
| Mountain photo (Ken-Burns) | z-0 | 18% — recedes fastest |
| "ALTITUDE." heading | z-5 | 8% — floats in midground |
| SVG mountain silhouette | z-15 | 3% — barely moves, feels heavy |
| Description + CTAs | z-20 | 0% — static |

**ALTITUDE. entrance:** `y: 72px → 0` + `opacity: 0→1` + `scale: 0.96→1`, 1.2s, delay 300ms. The word rises upward into view from behind the mountain peaks — the foreground silhouette stays fixed and masks the lower portion throughout. No clip-path needed; the depth illusion is purely from z-ordering + the rise.

**SVG mountain silhouette:**
- Two ranges: back range (taller peaks, `#080812`, semi-transparent tips `opacity: 0→0.55→0.90→1` gradient) + front range (lower, `#0A0A0A`, `opacity: 0.45→0.88→1` gradient)
- `viewBox="0 0 1440 500"`, `preserveAspectRatio="none"`, `height: 60vh`, bottom-aligned
- Solid `<rect>` base at y=472 ensures clean merge with page background
- Peak of back range sits at ~47% from viewport top, crossing ALTITUDE.'s lower third

**"Hiring for every" label:** `font-mono text-[11px] uppercase tracking-[0.22em] text-white/55`, fades in 500ms at delay 120ms — floats above the mountain peaks.

**Ken-Burns:** `scale: 1.25 → 1.28 → 1.25`, 32s loop. Scroll parallax `y: 0%→18%` layers on top via `useTransform`.

**Subhead:** "Campus fresher to founder-led executive search, on one platform. Every candidate proctored, scored, and ranked before the first call."

**Proof card (desktop only):** Glass surface `bg-white/[0.08] border-white/20 backdrop-blur-md`. Staggered avatar initials (SR/AK/MV in cobalt/navy/amber tints) + amber Star icon pulse + "540+ institutions trust PluginLive".

---

## Section 2 — Altitudes

**ID:** `#v3-altitudes`  
**Eyebrow:** `Layers` icon · "Coverage"  
**H2:** "Every **tier.**" — "tier." in cobalt-600  
**Lede:** "One engine ranks every tier. From 10,000-candidate campus drives to founder-led mandates — scored the same way, start to finish."

**4-column tier grid (lg:grid-cols-4):**

| Icon | Title | Description |
|---|---|---|
| `Sparkles` | Executive search | Founder-led search across IB, PE/VC, Wealth, and AMC. Every mandate runs through a co-founder. |
| `ShieldCheck` | Senior mandates | Specialist IC and leadership, ranked in 48 hours by capability scores from proctored assessments. |
| `TrendingUp` | Mid-career, vetted | Capability signal, not pedigree. Same scoring applies to every candidate, regardless of background. |
| `GraduationCap` | Campus freshers | 540+ colleges, proctored at 10,000+ concurrent candidates. Country-wide signal at the broadest tier. |

Columns stagger in `whileInView` left-to-right. Vertical dividers between columns on `lg+`. `sm:grid-cols-2` below lg.

---

## Section 3 — Marketplace

**ID:** `#v3-marketplace`  
**Eyebrow:** `Network` icon · "The network"  
**H2:** "Talent. **At scale.**"  
**Lede:** "AI matches, scores, and routes every candidate before the first interview. Corporates get a ranked shortlist. Institutions get placement outcomes. No middlemen."

**Bridge diagram:**
Three node-cards on a half-ellipse SVG arc (`M120,220 A240,140 0 0 1 600,220`):
- Left: `Building2` icon · "Corporates" · sub "Recruit · screen · hire" — light surface
- Centre: `Sparkles` icon · "PluginLive" · sub "The intelligent layer" — dark surface (`--bg-brand`), white text
- Right: `GraduationCap` icon · "Institutions + Students" · sub "540+ colleges · 2M+ students" — light surface

**Sonar rings (PluginLive node):** 5 rings, `size-[80px]`, `border-[var(--color-primary-300)]`, `scale: 0.4→3.2` + `opacity: 0.22→0`, 4s duration, 0.8s stagger, infinite. Triggered `inView`. Signals PluginLive as the live intelligent hub.

**Animated dots on arc:** 2 navy dots Corporates→PluginLive + 2 orange dots Institutions→PluginLive, `keyPoints="0;0.5"` and `keyPoints="1;0.5"`, 2.6s loop, 1.3s offset between pairs.

**PluginLive node also** has a box-shadow `animate` pulse (cobalt glow expanding outward), 3s loop.

---

## Section 4 — AI Layer

**Background:** `--bg-brand` (#0A0A0A)  
**Eyebrow:** `Sparkles` icon · "Intelligence layer" (cobalt-300)  
**H2:** "Cut the **noise.**"  
**Lede:** "Capability signals, not keyword overlap. The right candidates surface before you open a single inbox."

**Left column: 3 proof points list**

| Icon | Title | Body |
|---|---|---|
| `Crosshair` | Smart matching | Capability-matched, not keyword-matched. Ranked in minutes, not days. |
| `Filter` | Automated screening | 10,000+ concurrent. Proctored, scored, flagged before the inbox opens. |
| `TrendingUp` | Predictive readiness | Scored before they apply. Gaps in, signals out. |

Each point: `size-7` icon square `bg-white/[0.06]`, icon in cobalt-300, title `text-[14px] font-semibold text-white`.

**Right column: SignalFilter mockup**  
40 dots in a 10×4 grid. On `inView`:
- 34 dim from `rgba(255,255,255,0.18)` to `rgba(255,255,255,0.10)`, scale → 0.85
- 6 highlighted (`HIGHLIGHTS = {6,14,19,22,28,33}`) snap to `--color-primary-600`, scale → 1.4, staggered by `i * 0.015s`  

Footer: `"Resume noise filtered. Capability signals surface."`

**Pan-India strip** (full-width card below the 3-proof grid):

A dark card `border-white/[0.10] bg-white/[0.03]` with `lg:grid-cols-[5fr_7fr]` split.

Left:
- Eyebrow: `MapPin` icon · "Pan-India network" (cobalt-300)
- H3: "Every state."
- Body: "Signal spans metros and tier-3 cities equally. The AI ranks capability, not geography — your shortlist is limited by skill, not where candidates happened to study."

Right:
- Stat row (3 cols, border-bottom): `540+` Colleges (cobalt-300) · `28` States (brand-amber) · `2M+` Candidates (brand-orange)
- Animated city-pill cloud: 12 pills (Mumbai · Delhi · Bangalore · Chennai · Pune · Hyderabad · Kolkata · Ahmedabad · Patna · Jaipur · Lucknow · +529 more), each with leading `MapPin` icon in cobalt-300
- Pills stagger in: `opacity: 0→1, y: 6→0`, 60ms per pill, ease-out-expo
- `prefers-reduced-motion`: all pills snap to final state instantly

---

## Section 5 — Trust & Stats

Combined section: logo marquee above, stats grid below.

**Logo marquee:** `TrustLogoMarquee` shared component — infinite horizontal scroll of recruiter brand logos.

**Stats grid (`V3StatsGrid`):**  
`lg:grid-cols-[2fr_1fr]` — featured dark card left, 3 stacked white cards right.

**Featured card** (dark, `--bg-brand`, cobalt grid pattern overlay):
- Large stat: `40,000+` in `--color-primary-400`, `clamp(48px,7vw,96px)`, RAF count-up from 0
- Label: "Candidates assessed" in `text-white/70`
- Leading `Users` icon in cobalt-300

**Right column — 3 horizontal cards** (icon-left + label, number right):
| Icon | Label | Value |
|---|---|---|
| `GraduationCap` | Institutions onboarded | 500+ |
| `Building2` | Corporates hiring | 1,000+ |
| `Clock` | Time to shortlist | 48 hr |

Numbers in `--text-primary`, `clamp(28px,3vw,40px)`, tabular-nums. Icons in `--text-muted`. All fade-up staggered on `inView`.

---

## Section 6 — Capability Bands

Rendered by the shared `CapabilityFeaturesAi` component (`src/app/(marketing)/_components-ai/`). Three alternating audience bands: Executive Search → Corporates → Institutes & NGOs.

**Theme tracking:** `heroIsDark` prop passed from V3LandingPage's hero variant state. The first band inverts when the hero is dark, maintaining surface continuity.

**Accent colours per band:**
- Executive Search: `--color-brand-navy` / `--color-primary-300` (dark surface)
- Corporates: `--color-primary-600` / `--color-primary-300`
- Institutes & NGOs: `--color-brand-orange` / `--color-primary-300`

**Learn more hrefs:** `/executive-search` · `/corporates` · `/institutes`

---

## Section 7 — Case Studies

Shared `CaseStudies` component. Stat numbers use `--text-primary` (not `--color-primary-600`).

---

## Section 8 — Candidate Voices

Shared `CandidateVoices` component. Unchanged.

---

## Section 9 — Walkthrough CTA

**Background:** `--bg-brand` (#0A0A0A)  
**Eyebrow:** `PlayCircle` icon · "The walkthrough" (cobalt-300)  
**H2:** "See it **live.**" — "live." in cobalt-300, `clamp(36px,5vw,64px)`

**Subhead:** "20-minute call. Open a live drive, walk the proctor console, see every score explained. No pitch deck."

**Trust bullets:**
- "Reply within 24 hours"
- "No card on file. 30-day pilot included."
- "We sign your NDA, not the other way around."

Each: `ShieldCheck` icon (cobalt-300, size 14) + text `text-white/75`.

**CTA:** "Schedule a Walkthrough" (primary button, opens modal or anchors to `#book`).

**Parallax:** `useScroll` scroll-driven parallax on the cobalt radial orb (`y: -80→80`) and grid pattern (`y: -40→120`). Both converge toward section centre as user scrolls through.

**Footer text:** "Drives shipped at Infosys · TCS · Wipro · Deloitte · KPMG · Accenture · Capgemini · HCL · EY · Cognizant" — `text-white/55`, centered, below a `border-white/[0.06]` divider.

---

## Responsive Behaviour

| Breakpoint | Key changes |
|---|---|
| `lg` (1024px+) | All multi-column layouts active |
| Below `lg` | Tier grid → 2 cols (sm) then 1; bridge diagram stacks; AI section heading+cards above SignalFilter |
| Mobile | Mountain image hero: ALTITUDE. still centred, description stacks above proof card (proof card hidden below lg) |
| Touch targets | Min 44×44px on all interactive elements (buttons, toggle tabs, pipeline step buttons) |

---

## Accessibility

- `prefers-reduced-motion` respected — all framer-motion animations gated by `useReducedMotion()`
- `aria-hidden` on all decorative SVGs (bridge arcs, mountain silhouette, grid pattern, sonar rings)
- H1 always present in each hero variant (ALTITUDE. in image variant is inside a real `<h1>`)
- Pipeline tab list: `role="tablist"` on pipeline container, `role="tab"` on each step, `aria-selected`, `aria-controls`
- Pipeline mockup: `role="tabpanel"` + `aria-live="polite"`
- Focus-visible rings: `focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2` on all interactive elements
- WCAG AA contrast: all text meets 4.5:1 minimum (white/60 on dark verified; muted text on white verified)

---

## Quality Checklist

- [x] No hardcoded hex values in component code
- [x] Border radius max 6px (no pill shapes except avatars)
- [x] `prefers-reduced-motion` respected throughout
- [x] All interactive elements have focus-visible rings
- [x] H1 present in all three hero variants
- [x] ARIA labels on all decorative SVGs
- [x] TypeScript strict — `npx tsc --noEmit` clean
- [x] ESLint clean
- [x] Touch targets 44×44px minimum
