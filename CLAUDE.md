# PluginLive — Project Memory

## Design system

Full token reference: @docs/design-system.md

Read this file before generating any UI, component, or style code. The
design is finalised and governs **two surfaces**: the 🌐 website (marketing)
and the 🖥 platform (web app for recruiters, institutes & NGOs, and
students). Check the "Surface routing" table at the top of the design-system
doc to pick the correct design language for the surface you're touching.

## Tech stack

- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4 + CSS custom properties
- Components: shadcn/ui (New York style)
- Language: TypeScript
- Font: Satoshi (Fontshare CDN, loaded via `<link>` in root layout)
- Animation: tw-animate-css

## Non-negotiable design rules

### Colours

- Primary brand: `#494FDF` (`--color-primary-600`) — CTAs, active nav, focus rings, and any place that needs brand presence. Accent is collapsed onto primary, so positive / success / "accent" CTAs are also this colour.
- No separate accent hue — `--color-accent-*` is aliased to the primary ramp
- Page background: `#FFFFFF` (`--bg-page`) — pure canvas
- Sidebar / nav / dark hero surface: `#0A0A0A` (`--bg-brand`) — decoupled from primary so cobalt-violet CTAs read against it
- Error red `#E23B4A` — destructive actions and validation errors only, never decorative
- Warning amber `#EC7E00` — at-risk indicators only

### Typography

- Font: `'Satoshi', system-ui, sans-serif`
- Weights in use: 400 (body), 500 (labels/nav), 600 (headings/CTAs), 700 (page titles/KPIs), 900 (display, optional)
- Never hardcode px sizes — use Tailwind text-* utilities tied to the scale

### Spacing

- All spacing must be multiples of 4px
- Minimum touch target: 44×44px for all icon buttons

### Border radius — surface-split (🖥 platform max 6px · 🌐 website max 16px)

- Inputs, chips, badges → `rounded-sm` (4px) on both surfaces
- Buttons, inputs, dropdowns, tooltips, small inner elements → `rounded-md` (6px) on both surfaces
- 🖥 Platform: ALL cards and modals stay `rounded-md` (6px) — `rounded-lg/xl/2xl` are aliased to 6px there
- 🌐 Website: medium/inner cards → `rounded-lg` (12px); large cards, panels, modals, graphic frames → `rounded-xl` (16px). Activated by the `[data-surface="website"]` token scope set in the `(marketing)` layout — never hardcode px radii
- Nested rule: an inner card sits one radius step below its parent
- Never use pill shapes (9999px) except literal avatars and the Switch track

### Shadows — 3 levels only

- Cards on page → `shadow-sm`
- Floating bars, popovers → `shadow-md`
- Modals, overlays → `shadow-lg`
- Never apply shadow to coloured-background elements (buttons)

### Tokens

- Always use semantic tokens (`--text-primary`, `--bg-surface`, `--border-default`) in component code
- Never hardcode hex values anywhere in component files
- Use Tailwind utility classes where possible; use `var(--token)` in className only when no Tailwind class exists

## shadcn/ui

This project uses shadcn/ui (New York style, CSS variables enabled).

### How to add a new shadcn component

Run in terminal, never write shadcn components from scratch:

`npx shadcn@3.8.5 add [component-name]`

Pin to `3.8.5` — `shadcn@latest` (v4+) dropped the `new-york` style in favour of design-system presets (Nova, Vega, etc.) and will produce visually different components.

### shadcn token → PluginLive token mapping

| shadcn token         | PluginLive value              |
|----------------------|-------------------------------|
| --background         | #FFFFFF                       |
| --foreground         | --color-neutral-900 #191C1F   |
| --card               | --color-neutral-100 #F4F4F4   |
| --primary            | --color-primary-600 #494FDF   |
| --accent             | --color-primary-600 #494FDF   |
| --destructive        | --color-error #E23B4A         |
| --muted              | --color-neutral-100 #F4F4F4   |
| --muted-foreground   | --color-neutral-600 #505A63   |
| --border             | --color-neutral-200 #E2E2E7   |
| --ring               | --color-primary-600 #494FDF   |

### Rules when working with shadcn components

- Use shadcn's variant system (`variant="default|secondary|destructive|ghost|outline"`) — do not invent new variants inside shadcn files
- Extend shadcn components with `cva()` in a separate file — never edit files in `src/components/ui/` directly
- Custom variants must reference CSS tokens, never raw hex values
- Use `cn()` from `@/lib/utils` for all conditional class merging
- Never add inline styles — Tailwind classes or CSS variable references only

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools directly.

Available gstack skills:
`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`

## What Claude should never do

- Use arbitrary spacing values outside the 4px grid
- Use a border radius above 6px on the 🖥 platform, or above 16px on the 🌐 website (no pill shapes either way)
- Reintroduce a separate accent hue — the system is intentionally single-colour
- Use red for non-error emphasis
- Hardcode colour hex values in component code
- Edit files inside `src/components/ui/` — extend them instead
- Write shadcn components from scratch — always use the CLI to add them first
