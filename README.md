# PluginLive — Website

The public marketing **landing page** for PluginLive, built with Next.js 16
(App Router), Tailwind CSS v4, and shadcn/ui.

This repo intentionally ships **only the landing page** (`/`). Every other
route — Hire, Place, Train, The Team, Case studies, Careers, Blog, Privacy,
Terms, and any unknown path — renders a shared, on-brand **"Coming soon"** page
(`src/app/(marketing)/[...slug]/page.tsx` → `coming-soon/ComingSoon.tsx`) with
the full site nav and footer, plus an early-access email field.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy (Vercel)

Connect this repo as its own Vercel project. **Root directory = repo root**
(this is a standalone Next.js app, not a monorepo package). Framework preset:
Next.js. No environment variables are required.

## Notes

- The early-access form posts to `src/app/api/early-access/route.ts`, a stub
  that validates the email and returns `200` but does **not** persist it yet.
  To actually collect addresses, wire that handler to a provider (Resend
  audience, a Vercel-marketplace database, or a form service).
- Design tokens and component rules live in [`docs/design-system.md`](docs/design-system.md).
