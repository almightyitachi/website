# PluginLive Design System

Source of truth for all design tokens, foundations, and component specs.
This is the printable summary of the running design system; when in doubt,
the live foundations and component library are canonical. The design is
**finalised** — this document governs every build, on both surfaces.

**One system, two surfaces.** The same tokens and components drive the
**🌐 website** (the public marketing site) and the **🖥 platform** (the web
app serving corporates/recruiters, institutes & NGOs, and students). Where a
spec applies to one surface only it carries that surface's tag; everything
untagged is shared.

### Surface routing — pick the right design language

| Building on… | Use | Never use |
|---|---|---|
| **🌐 Website** | Tokens + atoms/molecules · *Marketing surfaces* section · serif accent · decorative atoms · full type scale (up to `--text-3xl` and clamp beyond) · website radius scale (cards up to 16px) | Platform-only chrome (app shell, tables, density modes) |
| **🖥 Platform** | Tokens + atoms/molecules · *Tables* · *Organisms & app patterns* · *Density modes* · type capped at `--text-lg` · radius capped at 6px | Serif accent · decorative marketing atoms · glassmorphism · dark bento treatments · radius above 6px |

The platform serves three audiences from the same tokens: recruiter views
lean dense and data-forward, institute views lean administrative and
status-forward, student views lean warm and accessible.

---

## How to read this document

The library is organised by atomic granularity. Build up, never sideways.

| Layer | What it is | Examples |
|---|---|---|
| **Tokens** | Raw, named decisions. The only place a literal value is allowed. | `--color-primary-600`, `--space-6`, `--radius-md` |
| **Atoms** | One element, one job. Composed only from tokens. | Button, Badge, Avatar, Input, Tooltip |
| **Molecules** | A few atoms wired into one reusable unit. | Tabs, Select, Form field, Dialog, Stepper |
| **Organisms** | Molecules + atoms forming a section of a screen. | App shell, Page header, Pipeline strip, Chart |
| **Patterns** | Cross-cutting rules every layer obeys. | States, a11y, responsive, writing, data format |

Every component entry below follows the same shape: **purpose · anatomy
(atoms it composes) · variants · sizes · states · tokens · a11y · when to
use**. Read it and you can rebuild the component from tokens alone.

**Tags.** Three inline tags scope every spec:
- **`🌐 Website`** — applies to the marketing site only.
- **`🖥 Platform`** — applies to the web app only.
- **`🔭 forward-looking`** — intended guidance not yet implemented in code
  (a primitive not yet extracted, or a planned token).

**Untagged = shared** (applies to both surfaces). Everything not tagged `🔭`
ships today.

**Implementation base.** Web surfaces are built on **shadcn/ui (New York
style)** over **Radix UI** primitives, **Tailwind CSS v4** (tokens live in
`@theme` inline in `globals.css`, no `tailwind.config`), **lucide-react**
icons, and **Framer Motion**. Never hardcode a hex, px, or raw colour in a
component; reference a token.

---

## Who we design for

PluginLive runs proctored hiring assessments for 10,000+ candidates
simultaneously. One design system serves three audiences across one network:
two buyers (corporates and institutes) and the candidates they meet through
it.

### Audience model

| | Corporate HR · Recruiter | Institute · TPO | Student · Fresher |
|---|---|---|---|
| Needs | Trust, speed, data density, efficiency | Cohort visibility, batch onboarding, placement reporting | Clarity, warmth, transparency, mobile simplicity |
| Motivation | Quality and speed of hire | Placement rate and outcomes for the institution | Opportunity |
| Intolerant of | Confusion, system errors, wasted clicks | Manual tracking, opaque pipelines, reporting busywork | Intimidation, jargon, opacity |
| Design expression | Dense, data-forward, professional | Administrative, status-forward, roster-oriented | Warm, encouraging, accessible |

The mood-board filter: "Does this feel credible to a Fortune 500 HR head on
Monday morning — and exciting to a final-year student on placement Friday?"

---

## Brand personality — four traits, every screen

Each trait carries a visual signal. When a design decision is hard, the
trait pulls it back into line.

### Reliable
- **Is**: Dependable · Consistent · Grounding · Solid
- **Is not**: Bureaucratic · Cold · Rigid · Heavy
- **Signal**: Deep colour anchors, predictable UI patterns, consistent
  spacing rhythm, no surprise interactions. Users never wonder what a
  button will do.

### Modern
- **Is**: Forward-facing · Clean · Data-forward · Calm
- **Is not**: Trendy · Gamified · Over-animated · Dated
- **Signal**: Generous whitespace, editorial typography, high-contrast
  hierarchy, minimal decoration. Complexity is expressed through
  information architecture, not visual noise.

### Approachable
- **Is**: Warm · Human · Inviting · Accessible
- **Is not**: Intimidating · Clinical · Jargon-heavy · Sterile
- **Signal**: Warm neutral palette, rounded corners, plain language,
  friendly illustration in empty and error states — never in confirmation
  dialogs.

### Purposeful
- **Is**: Efficient · Task-driven · Intentional · Clear
- **Is not**: Verbose · Decorative · Attention-seeking · Loud
- **Signal**: One primary action per screen. Progressive disclosure. Every
  element earns its place. If removing something doesn't break the page,
  remove it.

---

## Why the system holds together

| # | Principle | What it buys |
|---|---|---|
| 01 | Audience resolution | One token set serves two opposite audiences. Recruiter surfaces lean dense and professional; student surfaces lean warm and accessible — both pulled from the same tokens. |
| 02 | Token-driven change | A palette refresh repaints the whole product by editing one token layer, not a thousand class searches. |
| 03 | Build velocity | Radii, shadows, and spacing are never negotiated per screen. Every new surface inherits the rhythm, with zero visual entropy. |

---

# Foundations

## Typeface

```
Font family (sans):  'Satoshi', system-ui, -apple-system, sans-serif
Font family (mono):  'JetBrains Mono', 'Fira Code', ui-monospace, monospace
Font family (serif): 'Instrument Serif', Georgia, serif   ← website only
```

Satoshi is a modern geometric grotesk with strong opticals across the full
weight range. Reads premium at display sizes and stays legible at 14px in
dense tables. Mono is reserved for eyebrows, code, keyboard keys, and any
`tabular-nums` data where character alignment matters.

**Serif accent — `Instrument Serif` (`--font-serif`) 🌐 Website only.**
A single-weight (400) editorial display serif, used **exclusively in
its italic** to highlight the emphasised "value" word inside a marketing
heading (e.g. the hook word in *Hire at every Altitude*) — the editorial
counterpoint to Satoshi's grotesk. Rules:
- **🌐 Website only.** Never used on the platform — it stays entirely on
  Satoshi.
- **Italic, weight 400 only.** The family ships a single weight; never
  faux-bold or synthesize other weights.
- **Tighten the tracking.** The italic sets a touch loose at display sizes,
  so the highlighted word pulls in to `tracking-[-0.04em]` (tighter than the
  `-0.025em` on the surrounding Satoshi heading).
- **Highlight values, not whole headings.** Only the emphasised word/phrase
  takes the serif; the rest of the heading stays Satoshi. Never set body
  copy, labels, eyebrows, or UI text in it.

## Type scale

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--text-xs` | 13px | 18px | 400 | Labels, badges, helper text |
| `--text-sm` | 14px | 20px | 400 | Table data, metadata |
| `--text-base` | 16px | 24px | 400 | Body copy, inputs |
| `--text-md` | 20px | 28px | 500 | Card titles |
| `--text-lg` | 24px | 32px | 600 | Section headers |
| `--text-xl` | 32px | 40px | 600 | Page titles |
| `--text-2xl` | 48px | 56px | 700 | Dashboard KPIs |
| `--text-3xl` | 64px | 68px | 700 | Hero headings |

> **🖥 Platform** UI is capped at `--text-lg` (24px). **🌐 Website** surfaces
> use the full scale up to `--text-3xl`, and editorial hero headlines may
> scale beyond it via responsive `clamp()` sizing for display impact.

## Type weights in use

| Weight | Name | Use |
|---|---|---|
| 400 | Regular | Body, metadata, descriptions |
| 500 | Medium | Form labels, nav items, table headers |
| 600 | SemiBold | Card titles, section headings, CTAs |
| 700 | Bold | Page titles, KPI numbers, hero metrics |

## Letter spacing

| Token | Value | Use |
|---|---|---|
| `--tracking-tight` | -0.025em | Headings 24px+ |
| `--tracking-normal` | 0em | Body text |
| `--tracking-wide` | 0.04em | Labels, ALL CAPS overlines |

## Typography in context

Supporting cases beyond the scale:

- **Overline** — 11px, `font-semibold`, `uppercase`, `tracking-[0.08em]`,
  `--text-muted`. Labels context above a section heading.
- **Inline link** — `--text-brand`, underline with `underline-offset-2`,
  hover deepens to `--interactive-primary-hover`.
- **Inline code** — `--font-mono` 12px on `--bg-surface` with a
  `--border-default` outline, `--radius-sm`.
- **Tabular numbers** — `tabular-nums` on every numeric column for vertical
  alignment (124 / 1,247 / 10,000+).
- **Inline emphasis** — `<strong>` with `font-semibold` and `--text-primary`.
  Never switches typeface.

---

## Colour ramps

### Primary — Cobalt-violet

The single chromatic brand voltage. Used for primary CTAs, focus rings,
active nav states, and any place that needs brand presence. The accent ramp
is collapsed onto this ramp — there is **no separate accent hue**.

| Token | Hex | Role |
|---|---|---|
| `--color-primary-50` | `#EDEDFB` | Hover tint |
| `--color-primary-100` | `#D6D7F6` | Active fill |
| `--color-primary-200` | `#ADAFED` | Disabled |
| `--color-primary-300` | `#8487E4` | Icon |
| `--color-primary-400` | `#6166DD` | Icon 2 |
| `--color-primary-500` | `#4F55F1` | Mid |
| `--color-primary-600` | `#494FDF` | **Brand anchor** |
| `--color-primary-700` | `#3A40C4` | Pressed |
| `--color-primary-800` | `#2E339C` | Dark headers |
| `--color-primary-900` | `#1F2374` | Near-black |

### Accent — collapsed onto Primary

All `--color-accent-*` tokens point to the corresponding primary step so a
single colour does the brand work across every surface.

```
--color-accent-50  → --color-primary-50
--color-accent-100 → --color-primary-100
--color-accent-200 → --color-primary-200
--color-accent-300 → --color-primary-300
--color-accent-400 → --color-primary-400
--color-accent-500 → --color-primary-600    ← brand anchor
--color-accent-600 → --color-primary-700
--color-accent-700 → --color-primary-800
--color-accent-800 → --color-primary-900
--color-accent-900 → --color-primary-900
```

### Neutral — Cool ink

Cool-toned grey ramp anchored on `#191C1F`. Pure white is the page
background; warmth comes from typography, not from the surface.

| Token | Hex | Role |
|---|---|---|
| `--color-neutral-50` | `#FAFAFA` | Soft surface |
| `--color-neutral-100` | `#F4F4F4` | **Surface bg** |
| `--color-neutral-200` | `#E2E2E7` | **Border** |
| `--color-neutral-300` | `#C9C9CD` | Disabled border |
| `--color-neutral-400` | `#8D969E` | Placeholder |
| `--color-neutral-500` | `#5C5E60` | Secondary icon |
| `--color-neutral-600` | `#505A63` | **Text muted** |
| `--color-neutral-700` | `#3A3D40` | Charcoal |
| `--color-neutral-800` | `#1F2226` | **Text body** |
| `--color-neutral-900` | `#191C1F` | **Text primary** |

### Semantic colours

| Name | Token | Hex | Bg token | Bg hex |
|---|---|---|---|---|
| Success | `--color-success` | `#00A87E` | `--color-success-bg` | `#E0F4EE` |
| Warning | `--color-warning` | `#EC7E00` | `--color-warning-bg` | `#FDF0E0` |
| Error | `--color-error` | `#E23B4A` | `--color-error-bg` | `#FCE3E6` |
| Info | `--color-info` | `#376CD5` | `--color-info-bg` | `#E5EDFB` |

### Dark-surface tokens

The dark band / sidebar / hero surface is near-black, decoupled from the
primary ramp. On dark surfaces, "elevated" comes from translucent white
fills, not a lighter grey.

| Token | Hex / value | Use |
|---|---|---|
| `--bg-brand` | `#0A0A0A` | Sidebar, dark hero band, dark sections |
| `--surface-elevated` | `#16181A` | Raised card on a dark surface (opt-in raw token) |
| White fills | `rgba(255,255,255,0.03 → 0.16)` | Cards / hover on dark: `white/[0.03]` rest, `white/[0.06]` panel, `white/[0.08]` border, `white/[0.16]` hover border |

> **Internal plumbing tokens** — the production theme block in `globals.css`
> also defines `--surface-deep`, `--accent-pink`, `--accent-teal`,
> `--accent-light-blue`, `--accent-green`, `--accent-warning`, and
> `--accent-link`. These are theme-internal raw values: not exposed via
> `@theme`, never referenced in components, and candidates for deletion in
> the legacy cleanup (see *Token activation & legacy cleanup*).

### Colour rules

- Cobalt-violet `#494FDF` is the single brand voltage — used for CTAs,
  active nav, focus rings, and accent moments. There is no separate accent
  hue.
- Sidebar / nav surface uses near-black `#0A0A0A` — intentionally decoupled
  from the primary ramp so cobalt-violet CTAs read clearly against it.
- Error red only for destructive actions and validation errors. Never
  decorative emphasis.
- Warning amber only for at-risk / pending indicators. Never decorative.
- Border radius is surface-split: 🖥 platform capped at 6px, 🌐 website
  containers up to 16px (see *Border radius*). No pill shapes anywhere
  except literal avatars.

---

## Category & data-accent palette

Three supporting hues that orbit the cobalt anchor. Used **sparingly** for
chart polychromy, statistic emphasis, and category rotation. Never as a CTA
fill. These are opt-in via direct `var(--…)` reference (not exposed as
Tailwind utilities), so they can never leak into general component styling.

| Name | Token | Hex | Subtle token | Subtle hex |
|---|---|---|---|---|
| Navy | `--color-brand-navy` | `#1A1981` | `--color-brand-navy-subtle` | `#E5E5F4` |
| Amber | `--color-brand-amber` | `#FDBA00` | `--color-brand-amber-subtle` | `#FFF3D1` |
| Orange | `--color-brand-orange` | `#FD5B02` | `--color-brand-orange-subtle` | `#FFE3D1` |

### Role per colour

- **Navy** — Calm secondary, closest in hue to primary. Use for the
  deepest segment in a multi-tone graph, KPI accent rules, anchor
  statistics, and the calmest of a rotating set.
- **Amber** — Highlight, warm, mid-energy. Use for the second tone in
  dual-tone bar charts (paired with cobalt-light), milestone dots, donut
  middle wedge, KPI value colouring, and rating glyphs (stars).
- **Orange** — Loudest, vivid, scarce-use. Reserved for the punch
  statistic (last in a row), a single milestone dot, conversion metrics,
  and the peak moment in a rotating set.

### How the category palette is applied

Apply by surface intent, not by colour for its own sake.

| Surface intent | Treatment |
|---|---|
| Multi-tier value cards | One accent per tier — calmest tier → navy, mid tier → amber, loudest/last tier → orange. The supporting graphic (fill bars, dots) rotates the same three. |
| Stakeholder / category cards | Each category owns one accent on its icon badge and emphasis rule (e.g. primary → navy → orange across three). |
| Data visualisation | Segment tones cycle primary → navy → amber → orange; dual-tone bars pair cobalt-light with amber. |
| KPI / stat strips | Selected cards get a 2px accent rule + a tinted icon square (navy / amber / orange); the rest stay primary. |
| Donut / distribution charts | Largest wedge → navy, second → primary, third → amber. |
| Rating & testimonial glyphs | Stars render in amber, including on dark bands. |

---

## Breakpoints — responsive scale

Mobile-first. Tailwind v4 defaults; no custom breakpoint tokens. The
product's structural switch (single-column ↔ multi-column, drawer ↔ sidebar)
happens at **`lg` (1024px)**.

| Token | Min width | Typical role |
|---|---|---|
| (base) | 0 | Mobile portrait — single column, drawer nav |
| `sm` | 640px | Large phone / small tablet |
| `md` | 768px | Tablet — two-column data, side-by-side cards |
| `lg` | 1024px | **App-shell switch** — persistent sidebar, multi-column dashboard |
| `xl` | 1280px | Desktop — full marketing max-width |
| `2xl` | 1536px | Wide desktop |

Rules:
- Design the mobile layout first, then enhance upward. Never the reverse.
- The platform app collapses its sidebar to a slide-in drawer below `lg`
  (`@media (max-width: 1023px)`).
- Marketing bento grids stack to a single column below `lg`.

## Layout — grid, containers, page padding

| Container | Max width | Use |
|---|---|---|
| `max-w-2xl` | 672px | Centred prose, single-column forms, narrow heading blocks |
| `max-w-6xl` | 1152px | Dense app content, dark marketing bands |
| `max-w-7xl` | 1280px | Default marketing section width, wide dashboards |

- **Page gutters**: `px-6` (24px) mobile → `px-8`/`px-12` (32–48px) desktop.
  Always pair a `max-w-*` container with `mx-auto` + responsive `px-*`.
- **Column grids**: prefer `grid` with an explicit base `grid-cols-1` then
  `lg:grid-cols-*`. Always add `min-w-0` to grid/flex children that hold
  text or wide content, so a wide child can't force horizontal overflow.
  (See *Responsive & adaptive behavior*.)
- **Breakpoint-free card grids**: `grid-template-columns: repeat(auto-fit,
  minmax(280px, 1fr))` when card count is variable.
- **Marketing column rails**: light bands constrain to a `max-w-7xl`
  container with hairline `--border-default` vertical guides
  (`aria-hidden`, `pointer-events-none`); dark bands stay unframed.

---

## Spacing — 4px grid

| Token | Value |
|---|---|
| `--space-0` | 0px |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-7` | 28px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |

### Common patterns
- Input padding: `--space-3` vertical / `--space-4` horizontal
- Button padding (default): `--space-5` horizontal / ~`--space-2`–`3` vertical, min-height 40px (see Buttons)
- Card padding: `--space-6` all sides
- Table cell: `--space-3` vertical / `--space-4` horizontal
- Form field gap: `--space-6`
- Section gap: `--space-10` to `--space-12`
- Marketing section block padding: `--space-20` mobile → `--space-24` desktop

---

## Border radius — surface-split

Radius is the one token scale that differs per surface. **🖥 Platform is
capped at 6px** (crisp, data-forward). **🌐 Website containers go up to
16px** (softer, consumer-facing) while its buttons, inputs, and chips keep
the shared 4/6px. No pill / fully-round shapes on either surface except
literal avatars and the Switch track.

| Token | 🖥 Platform | 🌐 Website | Use |
|---|---|---|---|
| `--radius-sm` | 4px | 4px | Inputs, chips, badges, table cells, small tags |
| `--radius-md` | 6px | 6px | Buttons, inputs, dropdowns, tooltips, small inner elements; 🖥 all cards and modals |
| `--radius-lg` | 6px (aliased to md) | **12px** | 🌐 medium / inner cards, mockup cards, list-row cards |
| `--radius-xl` | 6px (aliased to md) | **16px** | 🌐 large cards, panels, modals, graphic frames |
| `--radius-2xl` | 6px (aliased to md) | 16px (= xl) | Guard alias — never target directly |

**Mechanism.** The base theme keeps `lg`/`xl`/`2xl` collapsed onto `md`
(conservative default — this is what the platform renders). The website
raises them via a token scope: the `(marketing)` layout wraps its children
in `<div data-surface="website">`, and `globals.css` scopes
`--radius-lg: 12px; --radius-xl: 16px` to `[data-surface="website"]`. The
`rounded-*` utilities resolve through `var(--radius-*)`, so the same
component class renders 6px on the platform and 12/16px on the website.
**Fix radius at the token layer — never edit `src/components/ui/` files**
(shadcn `Card` ships `rounded-xl`; the bridge gives it 6px on the platform
and 16px on website surfaces automatically).

**Nesting rule.** An inner card sits one step below its parent (parent `xl`
→ child `lg` or `md`) so concentric corners read parallel.

> **Override note:** some shadcn primitives ship `rounded-full` defaults
> (e.g. `Badge`, `Switch` track). Pills are only allowed on literal avatars
> and the Switch track. Badges, chips, and tags **must** be overridden to
> `--radius-sm` (the `StatusBadge` already does this).

---

## Shadows — 3 levels only

| Token | CSS value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgba(26,25,23,0.06), 0 1px 4px 0 rgba(26,25,23,0.04)` | Cards on page, input focus lift, inactive dropdowns |
| `--shadow-md` | `0 4px 8px -2px rgba(26,25,23,0.08), 0 2px 6px -2px rgba(26,25,23,0.06)` | Floating bars, popovers, active cards, date pickers |
| `--shadow-lg` | `0 12px 24px -4px rgba(26,25,23,0.10), 0 4px 10px -4px rgba(26,25,23,0.08)` | Modal dialogs, command palettes, overlays |

Never apply shadow to coloured-background elements (buttons).

---

## Elevation & z-index layering

Stacking is a system, not an inline guess. Use the named layers; never
invent a raw `z-[999]`.

| Layer | Suggested `z` | Members |
|---|---|---|
| Base | `0` | Normal flow, sticky hero (`z-0`) |
| Docked | `10` | In-flow overlapping sections, parallax overlap |
| Sticky nav | `40` | Fixed/condensed top nav, sticky table header |
| Overlay | `50` | Dropdown, Select, Popover, Tooltip, Dialog overlay+content, Drawer |
| Toast | `60` | Sonner toasts (above modals) |

> Today the Radix primitives mostly render at `z-50`; treat the table above
> as the **target scale to adopt** — `🔭` introduce `--z-*` tokens
> (`--z-sticky:40; --z-overlay:50; --z-toast:60`) and migrate inline values
> to them. Tooltips may sit at the top of the overlay band so they read over
> their trigger.

## Opacity scale

| Value | Use |
|---|---|
| `1` | Default |
| `0.9` | Solid-fill hover (`bg-primary/90`, `bg-destructive/90`) |
| `0.5` | Disabled (`opacity-50` + `pointer-events-none`) |
| `0.45`–`0.5` | Modal / drawer scrim (`bg-black/45`–`/50`) |
| `0.03 / 0.06 / 0.08 / 0.16` | Decorative white fills on dark surfaces (rest fill / panel / border / hover border) |

## Blur scale

| Value | Use |
|---|---|
| `backdrop-blur-sm` (~4px) | Dialog / drawer overlay |
| `backdrop-blur-md` (~12px) | Condensed liquid-glass nav pill |

Glassmorphism is rare and purposeful (nav pill, overlay scrim) — never a
default surface treatment.

## Iconography

- **Library**: `lucide-react`. One icon set across all surfaces; never mix
  icon families.
- **Sizes**: `size-4` (16px) inline with text and inside buttons (default);
  `size-3` (12px) in `xs` controls and eyebrow glyphs; 20px standalone;
  the touch target around an interactive icon is always **44×44**.
- **Stroke**: default lucide weight; `strokeWidth={2.25}` for small accent
  glyphs (e.g. AiEyebrow sparkle).
- **Colour**: icons inherit `currentColor` — never give an icon its own hex.
  They take the text colour of their context.
- Decorative icons are `aria-hidden`; meaningful icon-only controls carry an
  `aria-label`.

---

## Motion

Motion is calm and editorial — entrance reveals, slow drifts, conceptual
loops — never bouncy or gamified.

### Duration & easing

| Token (target) | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Hover/press colour shifts, small state flips |
| `--duration-base` | 200ms | Accordion/collapsible, tab pill slide, toggles |
| `--duration-slow` | 300ms | Tab content crossfade, panel transitions |
| `--duration-slower` | 600ms | Entrance fade-up reveals |

| Easing | Curve | Use |
|---|---|---|
| ease-out-expo | `cubic-bezier(0.16, 1, 0.3, 1)` | **Shared default** for entrance + scroll transforms |
| ease-standard | `cubic-bezier(0.22, 1, 0.36, 1)` | Marketing fade-up keyframe |
| ease-out | native | Accordion / collapsible (200ms) |

> Durations/easings are currently inline in components and keyframes;
> `🔭` promote to `--duration-*` / `--ease-*` tokens.

### Keyframe catalog (defined in `globals.css`)

| Animation | Class / token | Spec |
|---|---|---|
| Border beam | `--animate-border-beam` | `border-beam 15s infinite linear` — beam travels an emphasised card border |
| Logo ticker | `.ticker-track` | `ticker 28s linear infinite`, `translateX 0 → -50%`, pauses on hover |
| Vertical scroll | `.scroll-y-track` | `scroll-y linear infinite`, `translateY 0 → -50%`, reduced-motion gated, pauses on hover |
| Fade-up reveal | `.fade-up` | `fade-up 600ms cubic-bezier(0.22,1,0.36,1)`, ~80ms per-element stagger, reduced-motion gated |
| Bar pulse | `pulseBar` | `scaleY 1 ↔ 1.09` — hero gradient-bar breathing |
| Shine sweep | `shineSweep` | diagonal `translate(80%,80%) → (-80%,-80%)` drift across hero bars |
| Liquid shift | `navLiquidShift` | `translateX(-25% → 25%)` glass shimmer on condensed nav |
| Grain overlay | `.noise-overlay` | film-grain SVG turbulence on dark hero surfaces |
| Crafters scroll | `crafters-scroll` | team-page portrait carousel, `translateY` loop |
| Spinner | `animate-spin` | loading indicators (e.g. toast loading icon) — via `tw-animate-css` |
| Pulse | `animate-pulse` | skeleton loading blocks — via `tw-animate-css` |
| Ping | `animate-ping` | live-status dot halo — via `tw-animate-css` |
| Accordion | `accordion-down/up` | 200ms expand/collapse — ships via `tw-animate-css`, not `globals.css` |

**Auto-advance carousels:** ~5s cycle with a linear dot-progress bar.
**Reduced motion:** scroll, idle, and loop animations collapse to a static
state under `prefers-reduced-motion`; decorative layers are `aria-hidden`
and non-interactive. Never animate layout properties (`width`, `height`,
`top`) — animate `transform`/`opacity`, or `grid-template-rows` for
expand/collapse.

---

## Semantic tokens — use these in components, never raw hex

### Text

| Token | Resolves to | Use |
|---|---|---|
| `--text-primary` | `#191C1F` | Body headings, KPI numbers, primary copy |
| `--text-body` | `#1F2226` | Default paragraph copy, table cell text |
| `--text-muted` | `#505A63` | Metadata, helper text, hint copy |
| `--text-disabled` | `#8D969E` | Disabled inputs, inactive labels |
| `--text-inverse` | `#FFFFFF` | Text on dark / brand surfaces |
| `--text-brand` | `#494FDF` | Brand-tinted text, link hover, active nav |
| `--text-accent` | `#494FDF` | Positive KPI values, success copy (= brand) |
| `--text-danger` | `#E23B4A` | Validation errors, destructive labels |
| `--text-warning` | `#EC7E00` | At-risk indicators, warning copy |

### Backgrounds

`--bg-brand` is intentionally decoupled from the primary ramp. The brand
surface for sidebar / nav / dark-hero bands is near-black, so the
cobalt-violet CTA reads against it.

| Token | Resolves to | Use |
|---|---|---|
| `--bg-page` | `#FFFFFF` | Document background (pure canvas) |
| `--bg-surface` | `#F4F4F4` | Secondary surface, alternating rows |
| `--bg-elevated` | `#FFFFFF` | Cards on a coloured surface |
| `--bg-brand` | `#0A0A0A` | Sidebar, dark hero — decoupled from primary |
| `--bg-brand-subtle` | `#EDEDFB` | Active nav item, info chips |
| `--bg-accent-subtle` | `#EDEDFB` | Positive callouts (= brand subtle) |
| `--bg-warning-subtle` | `#FDF0E0` | Warning callouts |
| `--bg-danger-subtle` | `#FCE3E6` | Destructive confirmation surfaces |
| `--bg-success-subtle` | `#E0F4EE` | Success callouts |

### Borders

| Token | Resolves to | Use |
|---|---|---|
| `--border-default` | `#E2E2E7` | Default dividers, card outlines |
| `--border-strong` | `#C9C9CD` | Hovered card outlines, emphasised dividers |
| `--border-brand` | `#494FDF` | Active tab indicators, selection outlines |
| `--border-danger` | `#E23B4A` | Inputs in error state |
| `--border-focus` | `#494FDF` | Focus rings (outline-based) |

### Interactive states

The accent set is unified with the primary set — every CTA, primary or
"accent", uses cobalt-violet.

| Token | Resolves to |
|---|---|
| `--interactive-primary` | `#494FDF` |
| `--interactive-primary-hover` | `#3A40C4` |
| `--interactive-primary-pressed` | `#2E339C` |
| `--interactive-primary-subtle` | `#EDEDFB` |
| `--interactive-accent` | `#494FDF` |
| `--interactive-accent-hover` | `#3A40C4` |
| `--interactive-accent-pressed` | `#2E339C` |
| `--interactive-danger` | `#E23B4A` |
| `--interactive-danger-hover` | `#C12B39` |
| `--interactive-danger-subtle` | `#FCE3E6` |

### shadcn token bridge

shadcn components read generic names; these alias onto PluginLive tokens so
the whole component library inherits the system. Do not restyle shadcn files
— change the bridge or extend with `cva()` in a separate file.

| shadcn | → PluginLive |
|---|---|
| `--background` / `--foreground` | `--bg-page` / `--text-primary` |
| `--card` / `--popover` | `--bg-surface` / `--bg-elevated` |
| `--primary` | `--color-primary-600` |
| `--secondary` | `--bg-brand-subtle` |
| `--muted` / `--muted-foreground` | `--bg-surface` / `--text-muted` |
| `--accent` | `--color-accent-500` (= primary-600) |
| `--destructive` | `--color-error` |
| `--border` / `--input` / `--ring` | `--border-default` / `--border-default` / `--color-primary-600` |
| `--radius` | `--radius-md` |

---

## Token activation & legacy cleanup

The design is finalised — there is **one** design language, documented in
this file. How it activates in code, and what legacy remains:

- **Activation.** The production tokens are applied through a `data-theme`
  attribute set on `<html>` in `src/app/layout.tsx`. Every surface must
  render under that root layout so it inherits the production tokens.
- **⚠️ Legacy hazard 1 — `:root` is not the production token set.** The bare
  `:root` block in `globals.css` still holds an obsolete design-exploration
  palette (indigo primary, warm neutrals, 8/12px radii, a smaller type
  scale). Never reference or rely on `:root` values; never create a render
  tree outside the root layout.
- **⚠️ Legacy hazard 2 — the localStorage override.** A pre-hydration script
  in `layout.tsx` applies `localStorage.theme-version` globally, and
  `ThemeToggle.tsx` writes it. This exists only for the internal `/design`
  comparison lab. **Never ship `ThemeToggle` outside `/design`**; a stale
  localStorage value re-skins production.
- `🔭` **Cleanup**: promote the production values into `:root`, delete the
  exploration token blocks, and remove the localStorage script +
  `ThemeToggle` once the `/design` lab no longer needs them.
- Component code references only semantic tokens, never a theme directly, so
  a future re-skin is a token edit, not a component rewrite.
- **Dark surfaces today** are handled per-surface via `--bg-brand` /
  `--surface-elevated` + translucent white fills, not a global dark theme.
- `🔭` A systematic light/dark pair (`prefers-color-scheme` mapping of every
  semantic token) is the intended next step for platform dark mode.

---

## Interaction states — the universal matrix

Every interactive element must define this full spectrum. If a state is
visually identical to another, say so explicitly; never leave one undefined.

| State | Standard treatment |
|---|---|
| Default | Resting tokens |
| Hover | Solid fills → `/90` opacity or `*-hover` token; quiet controls surface a `--bg-surface` / `--bg-brand-subtle` background |
| Active / pressed | `*-pressed` token; optional 1–2px translate-down |
| Focus-visible | `ring-[3px] ring-[var(--border-focus)]/50` + `border-ring`; never remove the outline |
| Disabled | `opacity-50` + `pointer-events-none` (+ `cursor-not-allowed`) |
| Loading | Spinner or skeleton; control stays sized, action is blocked |
| Selected / active-nav | `--bg-brand-subtle` bg + `--text-brand`; nav adds an indicator dot |
| Error / invalid | `--border-danger` + `ring-2 ring-[var(--border-danger)]/30`; `aria-invalid` set |

**Focus standard.** Focus is a 3px ring at 50% of `--border-focus`, plus a
solid ring-coloured border. It is keyboard-visible (`focus-visible`), never
suppressed for aesthetics.

## Density modes 🖥

| Mode | Use | Deltas vs default |
|---|---|---|
| Default | Most surfaces | Standard padding, `text-sm`/`text-base` |
| Compact | Data-heavy dashboards, long tables | Header height 32px, row padding `py-1.5`, `text-xs` cells, tighter control sizes (`sm`) |

Pick one density per surface; never mix within a single table or list.
Compact is currently a **per-surface styling convention** (the dashboard is
the reference implementation), not a component variant — `🔭` formal
`compact` variants on Table/Button/Input.

---

# Card anatomy — atoms → molecule

The role card is the most-used unit in the product. Eight atoms — radius,
shadow, three backgrounds, three type sizes, two text colours — assemble
into it.

| Part | Tokens |
|---|---|
| Container | `--bg-elevated` · `--border-default` · `--radius-md` 🖥 / `--radius-xl` 🌐 · `--shadow-sm` · `--space-6` |
| Title | `--text-md` · `--font-semibold` · `--text-primary` · `--tracking-tight` |
| Metadata row | `--text-sm` · `--text-muted` |
| Status badge | `--bg-accent-subtle` · `--text-accent` · `--radius-sm` · `--text-xs` |
| KPI number | `--text-2xl` · `--font-bold` · `--text-primary` · `tabular-nums` |
| Pipeline bar | `--color-neutral-300` · `--color-primary-300` · `--color-warning` · `--color-accent-500` · `--color-primary-700` |
| Primary CTA | `--interactive-primary` · `--text-inverse` · `--radius-md` · `--space-3` · `--space-6` |

### Build-up sequence

| Step | Layer | Tokens added |
|---|---|---|
| 01 | Surface | `bg-elevated` · `border` · `radius-md` |
| 02 | Shadow + padding | `shadow-sm` · `space-6` padding |
| 03 | Typography | `text-md` title · `text-sm` meta |
| 04 | Status + CTA | `bg-accent-subtle` · `interactive-primary` |

> This atoms → molecule build-up is the template for every component entry
> below: start from the container surface, add structure, add type, add
> interactive accents last.

---

# Atoms

Built on shadcn/ui (New York style) primitives. Each atom composes only from
tokens and must cover the full *Interaction states* matrix.

### Buttons

Six variants, each with the full state set (Default · Hover · Pressed ·
Focus · Disabled · Loading). `data-slot="button"`.

| Variant | Use | Notes |
|---|---|---|
| `default` (Primary) | Dominant action on a screen | Cobalt-violet fill (`bg-primary`), `hover:bg-primary/90`. One per surface. |
| `outline` (Secondary) | Pairs alongside a primary CTA (Cancel / Discard / Edit) | Outlined, neutral surface, `shadow-xs`. Quieter than primary, louder than ghost. |
| `ghost` | Toolbars, table row actions, dropdown items | No border/fill until hover surfaces `--bg-surface`. |
| `link` (Tertiary) | Navigational moves, quaternary actions | Link-styled, `underline-offset-4`. |
| `secondary` | Low-emphasis fill | `--bg-brand-subtle` fill + `--text-brand`. |
| `destructive` | Irreversible action confirmation | Solid red fill — reserve for the confirm step inside a destructive dialog, not inline. |

**Sizes**: `xs` (h-6, text-xs, icon 12px) · `sm` (h-8) · `default` (h-9
base; **production min-height 40px, padding 20×10px**) · `lg` (h-10) ·
`icon` (36×36) · `icon-xs` (24×24) · `icon-sm` (32×32) · `icon-lg` (40×40).
Any standalone icon control still needs a 44×44 touch target on mobile.

**Icon handling**: leading/trailing icons supported; icons auto-size to
`size-4` (`size-3` in `xs`). `<Button><CheckCircle2 />Confirm role</Button>`.

**Destructive secondary**: prefer the `outline` variant with
`--border-danger`, `--text-danger`, `--bg-danger-subtle` on hover over a
solid red fill.

### Inputs

Form primitives with full state coverage. Date / time / range pickers are
mocked at the visual layer — wire with `react-day-picker` / `react-aria` in
production `🔭`.

| Component | States covered |
|---|---|
| Text input (`input.tsx`) | Default · Focus · Filled · Disabled · Error · With prefix icon |
| Search field | Inline leading icon + trailing dismiss |
| Textarea (`textarea.tsx`) | Multi-line, `field-sizing-content`, min-h-16 |
| Select / dropdown (`select.tsx`) | Trigger sizes `sm` / `default`; see *Select* molecule |
| Date picker | Mock — leading calendar icon + trailing chevron `🔭` |
| Time picker | Mock — leading clock icon + trailing chevron `🔭` |
| Date range | Two fields with `→` separator `🔭` |
| File upload | Dashed drop-target on `--bg-surface`, hover lifts to `--bg-elevated` |
| Checkbox (`checkbox.tsx`) | Default · Checked · Disabled — 16px, Check glyph |
| Switch (`switch.tsx`) | Default · On · Disabled; sizes `sm` (h-3.5 w-6) / `default` (h-[1.15rem] w-8); `rounded-full` track, checked `bg-primary` |
| Radio (native) | Single-choice group, `accent-[var(--interactive-primary)]` |
| Multi-select chips | Removable tags on `--bg-brand-subtle` |

Error inputs use `--border-danger` + `ring-2 ring-[var(--border-danger)]/30`
and surface a `text-xs text-[var(--text-danger)]` message under the field.

### Badge

Small metadata. `data-slot="badge"`. Ships shadcn `rounded-full` by
default — **override to `rounded-sm`** for product use (the radius cap).

| Variant | Treatment |
|---|---|
| `default` | `bg-primary` + `--text-inverse` |
| `secondary` | `--bg-brand-subtle` + `--text-brand` |
| `outline` | `--border-default` + `--text-primary` |
| `destructive` | solid red + white (errors only) |
| `ghost` | text-only until hover |
| `link` | link-styled badge |

**Sizes**: xs (`px-1.5 py-0 text-[10px]`) · sm (`px-2 py-0.5 text-xs`) · md
(`px-2.5 py-1 text-sm`). Never use a red badge for non-error emphasis.

### StatusBadge 🖥

In-product role status. Outline badge + `rounded-sm` + semantic tokens —
no raw palette values.

| Status | Tokens |
|---|---|
| `open` (default) | `--color-accent-50` bg · `--color-accent-700` text · `--color-accent-200` border |
| `draft` | `--bg-warning-subtle` bg · `--text-warning` text · `--color-warning`/30 border |
| `closed` | `--bg-surface` · `--color-neutral-600` · `--border-strong` |
| `cancelled` | `--bg-danger-subtle` · `--text-danger` · `--color-error`/30 border |
| `paused` | `--color-info-bg` bg · `--color-info` text · `--color-info`/30 border |

### Semantic & specialised chips

- **Semantic chip** — Success / Warning / Error / Info, each `bg-*-subtle` +
  matching text colour, optional leading icon.
- **Dot-prefix badge** — pipeline / status legend; 8×8 colour swatch +
  label (`--color-neutral-300` · `--color-primary-300` · `--color-warning` ·
  `--color-primary-600` · `--color-primary-800` for Applied → Onboarded).
- **Numeric badge** — count chip on tabs / nav; surface variant on
  `--bg-surface`, active variant on `--bg-brand-subtle` + `--text-brand`.
- **Trend badge** — delta value + up/down/flat arrow on
  `--bg-success-subtle` / `--bg-warning-subtle`; KPI movement on dashboards.
- **Live badge** — pill with a pulsing dot (`animate-ping`) + "Live" /
  percentage; real-time status.

### Avatar

Initials circle or image. `🔭` not yet a shared primitive — currently inline
initials circles; extract to `avatar.tsx`.

- **Initials**: `--bg-brand-subtle` fill + `--color-primary-700` mono
  initials, `rounded-full` (literal avatars are the one allowed pill).
- **Image**: object-cover, `rounded-full`, with an initials fallback.
- **Sizes**: 24 / 32 / 40px common; touch target 44px when interactive.
- **Avatar group** `🔭`: overlapping with `-space-x-2` + ring in surface
  colour, "+N" overflow chip.

### Separator / Divider

Hairline rule on `--border-default`. Horizontal (full-width or inset) and
vertical (`w-px`, used in toolbars and KPI strips). Label-in-divider: centred
text on `--bg-page` over a full-width rule. `🔭` extract to `separator.tsx`.

### Progress bar (linear)

Track + fill. Track `--color-neutral-200` (or `white/[0.08]` on dark), fill
`--color-primary-600` (complete) / `--color-primary-400` (in-progress),
height `h-1`–`h-1.5`, `rounded-full`. Animate the fill with `scaleX`
(transform-origin left), never animated `width`. Determinate by default;
indeterminate uses a looping sweep `🔭`. Used in pipelines, the new-role
wizard, and the journeys timeline.

### Spinner & Skeleton

- **Spinner** — lucide `Loader2` + `animate-spin`, `currentColor`. For
  inline button loading and toast loading.
- **Skeleton** — `animate-pulse` blocks on `--bg-surface`, matched to the
  final content's shape; used for table rows and loading screens. `🔭`
  extract to `skeleton.tsx`.

### Tooltip

Brief, non-essential hint. `data-slot="tooltip-content"`. Dark surface:
`bg-foreground` (`--text-primary`) + `text-background` (white), `rounded-md`,
`px-3 py-1.5 text-xs`, arrow, `z-50`. Default `delayDuration={0}`. Never put
essential or interactive content in a tooltip (use a Popover). Touch devices
have no hover — provide an alternative affordance on mobile.

### Toast (Sonner)

Transient feedback, top of the overlay stack. `sonner.tsx`. Surface
`--popover` / `--popover-foreground` / `--border`, radius `--radius`. Typed
variants with lucide icons: **success** (CircleCheck), **info** (Info),
**warning** (TriangleAlert), **error** (OctagonX), **loading** (Loader2,
spinning). Auto-dismiss with manual dismiss; one concern per toast; never use
a toast for an error the user must act on (use inline/dialog).

### Kbd — keyboard key

Mono on `--bg-surface` with `--border-default` outline + `--radius-sm`,
`text-xs`. For shortcuts and the command palette (e.g. `⌘K`). `🔭`

### Toggle / segmented control

Two+ mutually exclusive options as one switch. Built on Radix Tabs (roving
focus, arrow-keys) restyled: a container (`--bg-surface` + `--border-default`
+ `p-1`), text-only triggers, and a single sliding pill
(`--bg-elevated` + `--shadow-sm`) animated between triggers with Framer
`layoutId` (200ms, ease-out-expo). Active label `--text-primary`, inactive
`--text-muted`. Compact (`self-start`) by default; full-width on mobile only
when it reads as a primary switch.

### Eyebrow & AiEyebrow

- **Eyebrow** (`eyebrow.tsx`) — plain `font-mono text-xs text-[var(--text-muted)]`,
  no background, no uppercase. The standard section label.
- **Overline** (typographic variant) — 11px `font-semibold uppercase
  tracking-[0.08em] --text-muted` for in-product section labels.
- **AiEyebrow** (`ai-eyebrow.tsx`) — mono `text-[11px] uppercase
  tracking-[0.12em]` in `--color-primary-600` + a 12px Sparkles glyph;
  marks AI-anchored sections only.

> Don't stack a mono eyebrow above *every* marketing section — it reads as
> AI scaffolding. Use it deliberately; the landing section headings use a
> hook-word headline instead. 🖥 In-product section labels use the
> Overline variant, never the marketing Eyebrow.

### Wordmark / logo

`Wordmark.tsx` — logo image with optional inversion filter. Inverts to white
on dark surfaces (`--bg-brand`, footer). Maintain clear-space ≥ the
wordmark's cap-height on all sides; never recolour, stretch, or place on a
low-contrast background.

### Decorative atoms 🌐

All are `aria-hidden`, `pointer-events-none`, and reduced-motion aware.
Website only — never on the platform.

| Atom | File | Intent |
|---|---|---|
| Border beam | `border-beam.tsx` | Animated gradient beam on an emphasised card border |
| Grid pattern | `grid-pattern.tsx` | SVG grid texture, masked, on dark tiles |
| Card glow | `background-components.tsx` | Soft radial halo behind cards; tints `primary` / `navy` / `amber` / `orange` |
| Sparkles | `sparkles.tsx` | tsparticles field, configurable density |
| Background paths | `background-paths.tsx` | Animated SVG path sweeps |
| Grain overlay | `.noise-overlay` | Film-grain turbulence on dark heroes |

---

# Molecules

A few atoms wired into one reusable unit. All exist in `src/components/ui/`
unless tagged `🔭`.

### Tabs (`tabs.tsx`)

Switch between peer panels. Variants: `default` (pill list on `--bg-surface`)
and `line` (underline indicator). Radix-backed: roving focus, arrow-key nav,
`aria-controls` wiring. Active trigger `--text-primary` + surface/underline;
inactive `text-foreground/60`. Pair content swaps with a ≤300ms crossfade.
Use for 2–5 sibling views; beyond that use nav.

### Accordion (`accordion.tsx`)

Vertically stacked disclosure. `single` (one open) or `multiple`. Header is a
full-width `button` (`aria-expanded`); body animates via
`accordion-down/up` (200ms). Used for FAQ (single-open) and the marketing
system-explainer (auto-advancing). Keep one panel open by default on FAQ.

### Dialog / Modal (`dialog.tsx`)

Focus-trapping overlay for a focused task or confirmation. Anatomy: `Overlay`
(scrim `bg-black/50` + `backdrop-blur-sm`), `Content` (centred,
`--bg-elevated`, `--radius-md`, `--shadow-lg`), `Header` / `Title` /
`Description`, `Footer` (actions, primary last), `Close`. Sizes: sm 400 / md
512 / lg 640. **Modal is the last resort** — exhaust inline / progressive
disclosure first. Always returns focus to the trigger on close.

### Dropdown menu (`dropdown-menu.tsx`)

Actions/options from a trigger. Items, `CheckboxItem`, `RadioGroup`/
`RadioItem`, `Label`, `Separator`, `Shortcut` (Kbd), `Sub`/`SubTrigger`/
`SubContent`, and a destructive item variant. Surface `--bg-elevated` +
`--shadow-md` + `--radius-md`, `z-50`. For actions on a row/object — not for
form selection (use Select).

### Select (`select.tsx`)

Single choice from a list. `Trigger` (sizes `sm` / `default`, chevron) +
`Content` panel + `Item` (check on selected) + `Label` / `Separator` +
scroll buttons. Filled / disabled / error states mirror Input. For ≤ ~12
options; beyond that use a Combobox `🔭`.

### Navigation menu (`navigation-menu.tsx`)

Top-level site navigation with optional mega-menu panels. Trigger + content
viewport + indicator. Drives the marketing nav. See *App shell* for product
sidebar nav.

### Form (`form.tsx`)

Field anatomy over react-hook-form + zod. `FormField` → `FormItem` →
`FormLabel` · `FormControl` · `FormDescription` · `FormMessage`. Rules:
label every control; mark **optional** fields (assume required by default);
help text in `FormDescription` (`--text-muted`); errors in `FormMessage`
(`--text-danger`, `aria-describedby`); 24px (`--space-6`) gap between fields;
on submit, focus the first invalid field.

### RadioCard (`RadioCard.tsx`)

Selectable card group (single choice) — bordered options with optional
description, selected state = `--border-brand` + subtle brand fill. Distinct
from the *Featured card*: RadioCard is an input; Featured is presentation.
`role="radiogroup"`, `sr-only` native inputs for a11y.

### Stepper / wizard nav

Progress through an ordered multi-step flow. Numbered dots: completed =
filled brand + check, active = filled brand, future = `--border-strong`
outline; connectors between. Completed steps are clickable; future steps are
not. Drives the new-role wizard. (See the journeys timeline for the
marketing variant of the same atom.)

### Pagination

Below tables/lists: "Showing X–Y of Z" + Prev/Next + page indicator. Buttons
use `ghost`/`outline`; current page is `--bg-brand-subtle` + `--text-brand`.

### Breadcrumb `🔭`

Ancestry trail with `/` separators; last crumb is current (no link). Inline
in the new-role header today; extract to `breadcrumb.tsx`.

### Popover `🔭`

Light dismissable surface for richer-than-tooltip, non-modal content
(filters, mini-forms). `--bg-elevated` + `--shadow-md` + `--radius-md`.
Distinguish from Tooltip (hint, non-interactive) and Dropdown (action list).

### Calendar / date picker `🔭`

Real date selection (currently visual mocks). Wire `react-day-picker`;
selected day `--interactive-primary`, range fill `--bg-brand-subtle`.

### Command palette `🔭`

`⌘K` global search + grouped results + Kbd hints, on `--shadow-lg`. For
power-user navigation across the app.

---

# Platform build kit — primitive status 🖥

Primitives the platform will need that are not yet shared components.
**Add each on first use** — never write shadcn components from scratch, and
always pin the CLI: `npx shadcn@3.8.5 add <component>` — then re-skin per
the token rules (radius cap, semantic tokens, full state matrix).

| Primitive | Status today | How to add |
|---|---|---|
| Avatar | Inline initials circles only | `npx shadcn@3.8.5 add avatar` |
| Avatar group | Missing | Custom-build over Avatar (`-space-x-2`, surface ring, "+N" chip) |
| Separator | Inline hairlines only | `npx shadcn@3.8.5 add separator` |
| Skeleton | Inline `animate-pulse` blocks | `npx shadcn@3.8.5 add skeleton` |
| Breadcrumb | Inline in the new-role header | `npx shadcn@3.8.5 add breadcrumb` |
| Sheet / Drawer | Mobile nav drawer is inline | `npx shadcn@3.8.5 add sheet` |
| Popover | Missing | `npx shadcn@3.8.5 add popover` |
| Calendar / date picker | Visual mocks only | `npx shadcn@3.8.5 add calendar` + `react-day-picker` wiring |
| Combobox | Missing (Select caps at ~12 options) | `npx shadcn@3.8.5 add command` + compose |
| Command palette | Missing | `npx shadcn@3.8.5 add command` |
| Kbd | Missing | Custom-build (mono on `--bg-surface`, `--radius-sm`) |
| Indeterminate progress | Determinate bars only | Extend the progress bar with a looping sweep |

---

# Cards (presentation)

Same radii, shadow, and padding rhythm — variants change tone, not
structure.

| Variant | Use | Signature |
|---|---|---|
| Basic card | Default container | `border` + `shadow-sm` + 24px padding |
| KPI card | Stat hero + label + hint | `--text-2xl` value in `--text-brand`, `tabular-nums`; optional **trend badge** + 2px accent top-border variant |
| Action card | Card with footer CTA | `CardFooter` with link + primary button |
| Featured (brand-bordered) | Selection / emphasis | 2px `--border-brand` outline + "Recommended" pill on `--bg-brand-subtle` |
| Status card | Inline callout | Tinted bg (`--bg-warning-subtle` etc.) + 2px left border in the semantic colour + leading icon |
| Empty state | No data | Dashed border, centred icon tile, copy, reset CTA |

> Cards are the lazy default — use them only when a bordered container is the
> right affordance. Never nest a card inside a card.

`Card` parts (`card.tsx`): `Card` · `CardHeader` · `CardTitle` ·
`CardDescription` · `CardAction` · `CardContent` · `CardFooter`.

---

# Tables 🖥

A single table primitive (`table.tsx`) with variants so each surface picks
the right density.

| Pattern | Details |
|---|---|
| Default table | Sortable headers (chevron icons), `StatusBadge` for status column, right-aligned `tabular-nums` numeric column, row-hover-revealed actions |
| Row states | Default · Hover (`--bg-surface`) · Selected (`--bg-brand-subtle`) · Disabled (`opacity-50`) |
| Compact density | Header height 32px, row padding `py-1.5`, `text-xs` cells |
| Selection + bulk actions | Checkbox column + select-all + sticky bulk action bar on `--bg-brand-subtle` with Move / Export / Archive |
| Sticky header | `sticky top-0` header with bottom shadow rule |
| Pagination footer | "Showing X of Y" + prev/next + page indicator |
| Empty state | Centred icon tile in a `py-12` row spanning all columns |
| Loading state | Skeleton rows with `animate-pulse` blocks on `--bg-surface` |

---

# Organisms & app patterns 🖥

Section-level compositions. Mostly bespoke in `(platform)` today; documented
here so they become reusable.

### App shell

The product chrome. Persistent **sidebar** on `--bg-brand` (expanded /
collapsed, icon + label nav items, active item = `--bg-brand-subtle` tint +
indicator, collapse toggle with `aria-pressed`). Below `lg` it collapses to a
**mobile top bar** (logo + hamburger) plus a **slide-in drawer** (`w-72`)
over a `bg-black/45` backdrop. Main content scrolls independently
(`flex-1 overflow-y-auto`).

### Page header

Top of a content view: optional back button (44×44 icon) + breadcrumb +
page title (`text-xl`/`text-lg`) + right-aligned actions (primary last). Used
across roles/new and detail pages.

### Section shell

A labelled block inside a page: title + subtitle + actions toolbar + body.
The repeating unit of the dashboard. One primary action per section.

### KPI / stat strip

Row of stat cards: label (overline) + bold `tabular-nums` value + optional
trend badge + hint. Selected cards get a 2px category-accent top border and a
tinted icon square (navy / amber / orange); the rest stay primary.

### Pipeline stage strip

Horizontal stage cards (Applied → Onboarded) with stage colour swatches,
dropoff %, stacked dual-tone gender bars, and milestone dots. Pipeline stage
colours are fixed:

| Stage | Swatch token |
|---|---|
| Applied | `--color-neutral-300` |
| Screened | `--color-primary-300` |
| Interview | `--color-warning` |
| Offered | `--color-primary-600` |
| Onboarded | `--color-primary-800` |

### Charts / data-viz

Custom, token-driven, no chart library required for the simple set.

| Chart | Spec |
|---|---|
| Horizontal bar | `h-1`–`h-2` track + coloured fill; label left, `tabular-nums` value right; hover tooltip |
| Stacked bar | Two-tone (e.g. female/male) inline bar; segment legend; hover tooltip |
| Donut / distribution | SVG `stroke-dasharray`; largest wedge → navy, second → primary, third → amber; interactive legend dims non-hovered wedges |
| Sparkline | Compact trend line / pulsing live dot |
| Chart tooltip | Dark surface (`--bg-brand` / `--text-inverse`), label + values + %, hairline separators |

Segment tones cycle primary → navy → amber → orange. Stars/ratings render in
amber, including on dark bands.

### Filter & bulk-action toolbars

- **Filter bar** — search field + Select/Popover filters + sort control,
  above a table/list; active filters shown as removable chips.
- **Bulk-action bar** — appears on row selection: count + Move / Export /
  Archive on `--bg-brand-subtle`, sticky.

### Empty / loading / error states

| State | Treatment |
|---|---|
| Empty (first-run) | Centred icon tile (tinted), title, one-line body, single reset/CTA. Warm, encouraging copy. |
| Loading | Skeleton matched to final layout (not a bare spinner) for content regions; spinner only for inline actions. |
| Inline error | Status card (tinted bg + full border + icon) with retry. Never fail silently. |
| Page error — 404 | Friendly heading + route home; illustration allowed. `🔭` |
| Page error — 500 | Apology + retry + support path; no stack traces to users. `🔭` |
| Permission / 403 | Explain access requirement + who to contact. `🔭` |

### Drawer / Sheet `🔭`

Edge-anchored panel for secondary flows (filters, detail peek, mobile nav).
Slide-in from a side over a scrim; `--bg-elevated` + `--shadow-lg`. The
mobile nav drawer exists inline; extract a reusable `Sheet`.

### Confirmation / unsaved-changes dialog

`UnsavedChangesDialog.tsx` — guards navigation away from a dirty form: Save
draft / Discard / Stay. Destructive confirmations use the `destructive`
button only on the final confirm, with a clear consequence sentence.

---

# Marketing surfaces 🌐

The public site alternates **near-black brand bands** (`--bg-brand`
`#0A0A0A`) with the **white canvas** to create a dark/light reading rhythm on
long scroll. Recurring devices:

- **Hook-word headline** — the emphasised word in a headline reveals with a
  clip-path wipe; cobalt on light surfaces, primary-300 on dark.
- **Eyebrow** — used deliberately, not above every section (see *Eyebrow &
  AiEyebrow*).
- **Bordered column rails** — light bands constrain to a fixed max-width with
  hairline `--border-default` vertical guides; dark bands stay unframed.
- **Framed cell + corner cross** (`CornerPlus`) — a content cell (card, marquee
  band, grid of cells) is outlined in hairline rails with a small "+" glyph
  straddling each corner intersection. The cross sits in a surface-coloured
  square that *breaks* the rail behind it, so it reads detached (a clear ~4px
  ring) and at one uniform weight no matter how many cell corners meet there.
  `aria-hidden` / `pointer-events-none`; `tone="light|dark"` picks the mask + line
  colour (light: `--border-strong` on the page bg; dark: white/25 on `--bg-brand`).
  In connected grids each cell draws only its top/left rails and the container its
  bottom/right, so shared edges render exactly once. Any full-bleed cell whose
  crosses reach the viewport edge needs an `overflow-x-clip` ancestor (the
  outer-half of the cross would otherwise force a horizontal scroll).
- **Section padding** — generous: `--space-20` block on mobile, `--space-24`
  on desktop.
- **One primary action per section** — any second action is demoted to
  outline or ghost.

### Section archetypes

| Archetype | Purpose | Design treatment |
|---|---|---|
| Statement hero | The promise, above the fold | Sticky viewport hero on the dark band; animated background field (gradient bars or spotlight beams), scroll parallax, primary + outline CTA pair |
| Segmented value | Tiers or stakeholders of the offer | Two-column list ↔ animated graphic, or an auto-advancing card carousel with a KPI pair and dot progress; each segment owns a category accent |
| System explainer | How the product works underneath | Dark band, auto-advancing accordion paired with a sticky crossfade graphic; an optional scroll-pinned layered visualisation |
| Proof | Trust through logos and outcomes | Per-buyer band: a horizontal **logo marquee** (label pinned left, greyscale logos scrolling + edge-masked, brightening on hover) over case cards inside the **framed cell + corner cross** treatment. Desktop lays cases out as one connected framed block (featured card + grid, or a bento); **below `lg` it collapses to a swipe carousel** of uniform fixed-height cards (one per cell, with prev/dot/next nav). Closes on a one-line social-proof bar with amber rating stars |
| Feature bento | Capability breadth at a glance | Dark glass bento (large + medium tiles), each tile backed by a calm, self-running conceptual graphic |
| Choice tabs | Two ways to engage | Light band, tabbed content with console-style mockups that crossfade on switch |
| Questions answered | Reduce friction before contact | Light band, sticky-left heading + single-open accordion |
| Closing CTA | Convert | Centred editorial block leading to the schedule / contact action |

### Navigation & footer

- **Top nav** — fixed and transparent full-width at the top; past a short
  scroll it condenses into a centred liquid-glass pill (border + blur +
  lift). It senses the section beneath it and flips its text light/dark to
  stay legible, and animates an active-link indicator dot.
- **Footer** — full-width near-black close: a multi-column link grid
  (audiences / product / company + a brand column); the wordmark inverts on
  the dark surface.

---

# Cross-cutting patterns

### Accessibility

- **Contrast**: WCAG AA on body and labels (4.5:1 text, 3:1 large text / UI).
- **Targets**: 44×44 minimum for every interactive control on touch.
- **Keyboard**: full keyboard operability — Tabs/accordion/menus use Radix
  roving focus; the FAQ accordion, booking form, and carousels are
  keyboard-navigable; modals trap focus and restore it on close.
- **Focus**: visible 3px focus ring (`--border-focus`/50), never removed.
- **ARIA**: `aria-current` on active nav, `aria-pressed` on toggles,
  `aria-expanded` on disclosures, `aria-label` on icon-only controls,
  `aria-invalid` + `aria-describedby` on errored fields, `role="radiogroup"`
  on card radios. Decorative layers are `aria-hidden`.
- **Reduced motion**: all scroll/idle/loop animation collapses to a static
  state under `prefers-reduced-motion`.
- **Plain language**: gloss jargon (EEO, TPO, P90) on first use inline.

### Responsive & adaptive behavior

- Mobile-first; enhance upward at `sm`/`md`/`lg`/`xl`.
- **Grid safety**: always give a multi-column grid an explicit base
  `grid-cols-1`, and add `min-w-0` to text/content children — an implicit
  `auto` track sizes to the widest child and causes horizontal overflow.
- Structural switch at `lg`: sidebar ↔ drawer, single ↔ multi-column.
- Segmented controls/toggles stay content-sized (`self-start`) on mobile
  unless they read as a primary full-width switch.
- Never let a fixed-width child (image, chart, mockup) exceed the viewport;
  constrain with `max-w-full` / `overflow-hidden` / `min-w-0`.

### Content & UX writing

- **Voice**: rigorous, curated, plainspoken. Specific evidence over
  adjectives ("48 hr from JD to ranked shortlist", not "fast").
- **Case**: sentence case for headings, labels, and buttons (not Title Case).
- **Buttons**: a verb + object ("Schedule a walkthrough", "Export ranked"),
  never "Submit"/"OK" where a specific verb fits.
- **Empty states**: warm and directive ("Your first drive ships in days").
- **Errors**: say what happened + how to recover; never blame the user.
- **No em dashes** in UI copy; use commas, colons, or parentheses.

### Data formatting

- `tabular-nums` on every numeric column/KPI for vertical alignment.
- Large numbers grouped/abbreviated: `1,247` · `10,000+` · `2.4M+`.
- Percentages whole unless precision matters (`88%`, `4.8`).
- Dates/times carry timezone where relevant ("Closes Fri 6 PM IST").
- Truncate overflowing names with `truncate` + a title/tooltip for the full
  value; never clip silently.

---

## Full CSS custom properties (paste into global stylesheet)

Production values. The token tables above are the source of truth;
breakpoints, z-index, duration, opacity, and blur are documented here as the
**target scale** — promote the commented ones to real tokens in a follow-up.

```css
:root {
  --font-sans: 'Satoshi', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  --text-xs:  13px;  --text-sm:  14px;  --text-base: 16px;  --text-md:  20px;
  --text-lg:  24px;  --text-xl:  32px;  --text-2xl: 48px;   --text-3xl: 64px;

  --tracking-tight: -0.025em;  --tracking-normal: 0em;  --tracking-wide: 0.04em;
  --font-regular: 400;  --font-medium: 500;  --font-semibold: 600;  --font-bold: 700;

  /* Primary — cobalt-violet */
  --color-primary-50:  #EDEDFB;  --color-primary-100: #D6D7F6;
  --color-primary-200: #ADAFED;  --color-primary-300: #8487E4;
  --color-primary-400: #6166DD;  --color-primary-500: #4F55F1;
  --color-primary-600: #494FDF;  --color-primary-700: #3A40C4;
  --color-primary-800: #2E339C;  --color-primary-900: #1F2374;

  /* Accent — collapsed onto primary (single-colour system) */
  --color-accent-50:  var(--color-primary-50);
  --color-accent-100: var(--color-primary-100);
  --color-accent-200: var(--color-primary-200);
  --color-accent-300: var(--color-primary-300);
  --color-accent-400: var(--color-primary-400);
  --color-accent-500: var(--color-primary-600);
  --color-accent-600: var(--color-primary-700);
  --color-accent-700: var(--color-primary-800);
  --color-accent-800: var(--color-primary-900);
  --color-accent-900: var(--color-primary-900);

  /* Neutral — cool ink */
  --color-neutral-50:  #FAFAFA;  --color-neutral-100: #F4F4F4;
  --color-neutral-200: #E2E2E7;  --color-neutral-300: #C9C9CD;
  --color-neutral-400: #8D969E;  --color-neutral-500: #5C5E60;
  --color-neutral-600: #505A63;  --color-neutral-700: #3A3D40;
  --color-neutral-800: #1F2226;  --color-neutral-900: #191C1F;

  /* Semantic */
  --color-success: #00A87E;  --color-success-bg: #E0F4EE;
  --color-warning: #EC7E00;  --color-warning-bg: #FDF0E0;
  --color-error:   #E23B4A;  --color-error-bg:   #FCE3E6;
  --color-info:    #376CD5;  --color-info-bg:    #E5EDFB;

  /* Category & data accents (opt-in via direct var reference) */
  --color-brand-navy:          #1A1981;
  --color-brand-navy-subtle:   #E5E5F4;
  --color-brand-amber:         #FDBA00;
  --color-brand-amber-subtle:  #FFF3D1;
  --color-brand-orange:        #FD5B02;
  --color-brand-orange-subtle: #FFE3D1;

  /* Text */
  --text-primary:  var(--color-neutral-900);
  --text-body:     var(--color-neutral-800);
  --text-muted:    var(--color-neutral-600);
  --text-disabled: var(--color-neutral-400);
  --text-inverse:  #FFFFFF;
  --text-brand:    var(--color-primary-600);
  --text-accent:   var(--color-primary-600);
  --text-danger:   var(--color-error);
  --text-warning:  var(--color-warning);

  /* Surfaces */
  --bg-page:           #FFFFFF;
  --bg-surface:        var(--color-neutral-100);
  --bg-elevated:       #FFFFFF;
  --bg-brand:          #0A0A0A;                /* decoupled from primary */
  --surface-elevated:  #16181A;                /* raised card on dark */
  --bg-brand-subtle:   var(--color-primary-50);
  --bg-accent-subtle:  var(--color-primary-50);
  --bg-danger-subtle:  var(--color-error-bg);
  --bg-warning-subtle: var(--color-warning-bg);
  --bg-success-subtle: var(--color-success-bg);

  /* Borders */
  --border-default: var(--color-neutral-200);
  --border-strong:  var(--color-neutral-300);
  --border-brand:   var(--color-primary-600);
  --border-danger:  var(--color-error);
  --border-focus:   var(--color-primary-600);

  /* Interactive */
  --interactive-primary:         var(--color-primary-600);
  --interactive-primary-hover:   var(--color-primary-700);
  --interactive-primary-pressed: var(--color-primary-800);
  --interactive-primary-subtle:  var(--color-primary-50);
  --interactive-accent:          var(--color-primary-600);
  --interactive-accent-hover:    var(--color-primary-700);
  --interactive-accent-pressed:  var(--color-primary-800);
  --interactive-danger:          var(--color-error);
  --interactive-danger-hover:    #C12B39;
  --interactive-danger-subtle:   var(--color-error-bg);

  /* Spacing — 4px grid */
  --space-0: 0px;   --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;  --space-7: 28px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px; --space-16: 64px;
  --space-20: 80px; --space-24: 96px;

  /* Radii — platform default: subtle only, max 6px */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 6px;
  --radius-xl: var(--radius-md);
  --radius-2xl: var(--radius-md);

  /* Shadows — 3 levels only */
  --shadow-sm: 0 1px 2px 0 rgba(26,25,23,0.06), 0 1px 4px 0 rgba(26,25,23,0.04);
  --shadow-md: 0 4px 8px -2px rgba(26,25,23,0.08), 0 2px 6px -2px rgba(26,25,23,0.06);
  --shadow-lg: 0 12px 24px -4px rgba(26,25,23,0.10), 0 4px 10px -4px rgba(26,25,23,0.08);

  /* 🔭 Target scale — promote to real tokens in a follow-up:
  --z-sticky: 40; --z-overlay: 50; --z-toast: 60;
  --duration-fast: 120ms; --duration-base: 200ms;
  --duration-slow: 300ms; --duration-slower: 600ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
  Breakpoints (Tailwind v4 defaults): sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536
  Opacity: hover .9 · disabled .5 · scrim .45–.5 · dark fills .03/.06/.08/.16
  Blur: overlay ~4px (backdrop-blur-sm) · nav pill ~12px (backdrop-blur-md) */
}

/* 🌐 Website surface scope — set by the (marketing) layout wrapper.
   Raises the container radius ceiling to 16px; controls keep sm/md. */
[data-surface="website"] {
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 16px;
}
```

---

*Document version 3.1 — June 2026. Governs both the website and the
platform; see "Surface routing" at the top for which sections apply where.*
