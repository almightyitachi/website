# Design: Two-Card Walkthrough CTA Section

**Date:** 2026-05-26
**Status:** Approved

## Summary

Replace the single centered "The Walkthrough" CTA band in `page.tsx` with a two-card audience split. One card targets Corporates & Talent Teams; the other targets Institutes, NGOs & TPOs. Both cards live inside the existing dark band so the section's parallax chrome is preserved.

## Layout

- Outer shell: unchanged (`bg-[#0A0A0A]`, cobalt orb + grid texture parallax, `id="book"`)
- Section heading: centered H2 above the card grid — "Whichever altitude you're flying at, we'll meet you there."
- Card grid: `grid-cols-1 lg:grid-cols-2 gap-5`, stacks on mobile
- Trust bullets: removed (the two-card format carries the offer more directly)
- Footer strip: retained — "Drives shipped at Infosys, TCS, Wipro..."

## Cards

### Left — Corporates (white surface)
- Background: `bg-white shadow-lg`
- Eyebrow: "If you're hiring →"
- Title: "Corporates & Talent Teams"
- Body: "End-to-end campus hiring from interns to senior mandates. Ranked shortlists, proctored at scale, with the audit trail included."
- CTA 1 (primary): "Schedule a Walkthrough" — opens `walkthroughOpen` modal
- CTA 2 (outline): "Talk to sales" — opens same modal

### Right — Institutes (dark surface)
- Background: `bg-white/[0.04] border border-white/[0.10]`
- Eyebrow: "If you're placing →"
- Title: "Institutes, NGOs & TPOs"
- Body: "Full placement infrastructure for your batch. Drive invitations, student readiness tracking, and outcome reporting. Free for accredited institutions."
- CTA 1 (primary, cobalt): "Schedule a Walkthrough" — opens modal
- CTA 2 (ghost): "Talk to a TPO advisor" — opens same modal

## File Changed

`src/app/(marketing)/page.tsx` — replace the dark CTA band section content only. Modal, parallax motion refs, and `ShieldCheck` import all stay in scope (ShieldCheck removed from JSX but import left clean or removed if unused).
