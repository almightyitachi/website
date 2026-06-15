import type { Metadata } from "next"

import { ComingSoon } from "../coming-soon/ComingSoon"

// Catch-all for every path that isn't the landing page (`/`). On this
// landing-only build, all footer/nav routes — Hire, Place, Train, The Team,
// Case studies, Careers, Blog, Privacy, Terms — and any unknown path render
// the shared "Coming soon" surface. The FIRST path segment picks the title
// (so /case-studies/infosys -> "Case studies").
const TITLES: Record<string, string> = {
  hire: "Hire",
  place: "Place",
  train: "Train",
  team: "The Team",
  careers: "Careers",
  blog: "Blog",
  privacy: "Privacy",
  terms: "Terms",
  "case-studies": "Case studies",
}

function titleFor(slug?: string[]): string {
  const first = slug?.[0] ?? ""
  return TITLES[first] ?? "This page"
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  return { title: `${titleFor(slug)} · Coming soon · PluginLive` }
}

export default async function ComingSoonCatchAll({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  return <ComingSoon title={titleFor(slug)} />
}
